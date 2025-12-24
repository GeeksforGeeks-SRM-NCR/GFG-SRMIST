import { NextResponse } from 'next/server';
import { contentfulClient } from '@/lib/contentful';
import { createClient } from '@/lib/supabase-server';
import { spawn } from 'child_process';
import path from 'path';

// --------------------------------------------------
// LOC UTILITIES (NEW, SAFE)
// --------------------------------------------------

function countEffectiveLOC(code: string): number {
    return code
        .split('\n')
        .map(line => line.trim())
        .filter(line =>
            line !== '' &&
            !line.startsWith('//') &&
            !line.startsWith('#') &&
            !line.startsWith('/*') &&
            !line.startsWith('*')
        ).length;
}

async function getDynamicOptimalLOC(
    problemSlug: string,
    language: string,
    currentLOC: number
): Promise<number> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('user_submissions')
        .select('grading_result')
        .eq('problem_slug', problemSlug)
        .eq('language', language);

    if (error || !data || data.length === 0) {
        return currentLOC; // first submission
    }

    let bestLOC = currentLOC;

    for (const row of data) {
        const loc =
            row?.grading_result?.details?.lines_of_code?.max !== undefined
                ? row.grading_result.details.lines_of_code.max
                : null;

        if (typeof loc === 'number') {
            bestLOC = Math.min(bestLOC, loc);
        }
    }

    return bestLOC;
}

// --------------------------------------------------
// PISTON CONFIG (UNCHANGED)
// --------------------------------------------------

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    cpp: { language: 'c++', version: '10.2.0' },
    js: { language: 'javascript', version: '18.15.0' },
    py: { language: 'python', version: '3.10.0' },
    'c++': { language: 'c++', version: '10.2.0' },
};

// --------------------------------------------------
// PYTHON GRADER RUNNER (UNCHANGED)
// --------------------------------------------------

function runGradingScript(submissionData: object): Promise<any> {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(
            'python',
            [path.join(process.cwd(), 'scripts', 'grade_submission.py')]
        );

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', data => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', data => {
            stderr += data.toString();
        });

        pythonProcess.on('close', code => {
            if (code !== 0) {
                return reject(new Error(stderr));
            }
            resolve(JSON.parse(stdout));
        });

        pythonProcess.stdin.write(JSON.stringify(submissionData));
        pythonProcess.stdin.end();
    });
}

// --------------------------------------------------
// MAIN ROUTE
// --------------------------------------------------

export async function POST(request: Request) {
    try {
        const { code, language, problemSlug } = await request.json();

        if (!code || !language || !problemSlug) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const langConfig = LANGUAGE_MAP[language.toLowerCase()];
        if (!langConfig) {
            return NextResponse.json(
                { error: 'Unsupported language' },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // TEST CASE EXECUTION (UNCHANGED)
        // --------------------------------------------------

        const problemResponse = await contentfulClient.getEntries({
            content_type: 'codingProblem',
            'fields.slug': problemSlug,
            limit: 1,
        });

        if (problemResponse.items.length === 0) {
            return NextResponse.json(
                { error: 'Problem not found' },
                { status: 404 }
            );
        }

        const problem = problemResponse.items[0];
        const testCases = problem.fields.testCases as Array<{
            input: string;
            output: string;
        }>;

        if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
            return NextResponse.json(
                {
                    status: 'Failed',
                    message: 'Configuration Error: No test cases found for this problem.',
                },
                { status: 200 }
            );
        }

        for (const testCase of testCases) {
            const pistonPayload = {
                language: langConfig.language,
                version: langConfig.version,
                files: [{ content: code }],
                stdin: testCase.input || '',
            };

            const runRes = await fetch(PISTON_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pistonPayload),
            });

            const runData = await runRes.json();
            const actual = (runData?.run?.output || '').trim();
            const expected = (testCase.output || '').trim();

            if (actual !== expected) {
                return NextResponse.json(
                    {
                        status: 'Failed',
                        message: 'Your solution did not pass all test cases.',
                    },
                    { status: 200 }
                );
            }
        }

        // --------------------------------------------------
        // DYNAMIC LOC GRADING (NEW CORE)
        // --------------------------------------------------

        const currentLOC = countEffectiveLOC(code);

        // const optimalLOC = await getDynamicOptimalLOC(
        //     problemSlug,
        //     language,
        //     currentLOC
        // );
        const optimalLOC = 20; // Default value

        const mockExecutionTime = Math.floor(Math.random() * 5);
        const problemDifficulty = problem.fields.difficulty || 'Medium';

        const gradingPayload = {
            difficulty: problemDifficulty,
            execution_time_ms: mockExecutionTime,
            code,
            optimal_loc: optimalLOC,
        };

        const gradingResult = await runGradingScript(gradingPayload);

        // --------------------------------------------------
        // SAVE SUBMISSION (UPDATED LOGIC)
        // --------------------------------------------------

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const newPoints = Math.floor(gradingResult.total_score || 0);

            // Check if user has already submitted for this problem
            const { data: existingSubmission, error: fetchError } = await supabase
                .from('submissions')
                .select('points_awarded')
                .eq('user_id', user.id)
                .eq('problem_slug', problemSlug)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
                throw new Error('Error fetching existing submission: ' + fetchError.message);
            }

            if (existingSubmission) {
                // User has submitted before
                const previousPoints = existingSubmission.points_awarded || 0;
                if (newPoints > previousPoints) {
                    // Update the submission with new code and points
                    const { error: updateError } = await supabase
                        .from('submissions')
                        .update({
                            code,
                            language,
                            status: 'Passed',
                            runtime: mockExecutionTime,
                            points_awarded: newPoints,
                        })
                        .eq('user_id', user.id)
                        .eq('problem_slug', problemSlug);

                    if (updateError) {
                        throw new Error('Error updating submission: ' + updateError.message);
                    }

                    // Update total_points: add the difference
                    const pointsDifference = newPoints - previousPoints;
                    const { data: profile, error: fetchProfileError } = await supabase
                        .from('profiles')
                        .select('total_points')
                        .eq('id', user.id)
                        .single();

                    if (fetchProfileError) {
                        throw new Error('Error fetching profile: ' + fetchProfileError.message);
                    }

                    const currentPoints = profile?.total_points || 0;
                    const newTotalPoints = currentPoints + pointsDifference;

                    const { error: profileUpdateError } = await supabase
                        .from('profiles')
                        .update({ total_points: newTotalPoints })
                        .eq('id', user.id);

                    if (profileUpdateError) {
                        throw new Error('Error updating profile points: ' + profileUpdateError.message);
                    }
                }
                // If newPoints <= previousPoints, do nothing
            } else {
                // First submission for this problem
                const { error: insertError } = await supabase
                    .from('submissions')
                    .insert({
                        user_id: user.id,
                        problem_slug: problemSlug,
                        code,
                        language,
                        status: 'Passed',
                        runtime: mockExecutionTime,
                        points_awarded: newPoints,
                    });

                if (insertError) {
                    throw new Error('Error inserting submission: ' + insertError.message);
                }

                // Add points to total_points
                const { data: profile, error: fetchProfileError } = await supabase
                    .from('profiles')
                    .select('total_points')
                    .eq('id', user.id)
                    .single();

                if (fetchProfileError) {
                    throw new Error('Error fetching profile: ' + fetchProfileError.message);
                }

                const currentPoints = profile?.total_points || 0;
                const newTotalPoints = currentPoints + newPoints;

                const { error: profileUpdateError } = await supabase
                    .from('profiles')
                    .update({ total_points: newTotalPoints })
                    .eq('id', user.id);

                if (profileUpdateError) {
                    throw new Error('Error updating profile points: ' + profileUpdateError.message);
                }
            }
        }

        return NextResponse.json({
            status: 'Success',
            message: 'Congratulations! Your solution passed all test cases.',
            gradingResult,
        });

    } catch (error: any) {
        console.error('Submission Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}