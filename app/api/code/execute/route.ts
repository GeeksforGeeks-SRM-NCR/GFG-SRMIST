// import { NextResponse } from 'next/server';
// import { contentfulClient } from '@/lib/contentful';
// import { createClient } from '@/lib/supabase-server';
// import { calculateScore } from '@/lib/scoring-algo';

// // Piston API
// const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
//     javascript: { language: 'javascript', version: '18.15.0' },
//     python: { language: 'python', version: '3.10.0' },
//     cpp: { language: 'c++', version: '10.2.0' },
//     js: { language: 'javascript', version: '18.15.0' },
//     py: { language: 'python', version: '3.10.0' },
//     'c++': { language: 'c++', version: '10.2.0' },
//     java: { language: 'java', version: '15.0.2' },
// };

// export async function POST(request: Request) {
//     try {
//         const { code, language, problemSlug } = await request.json();

//         // 1. Auth Check (Secure)
//         const supabase = await createClient();
//         const { data: { user } } = await supabase.auth.getUser();

//         if (!user) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         if (!code || !language || !problemSlug) {
//             return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//         }

//         const langConfig = LANGUAGE_MAP[language.toLowerCase()];
//         if (!langConfig) {
//             return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
//         }

//         // 2. Fetch Problem
//         const response = await contentfulClient.getEntries({
//             content_type: 'codingProblem',
//             'fields.slug': problemSlug,
//             limit: 1,
//         });

//         if (response.items.length === 0) {
//             return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
//         }

//         const problem = response.items[0];
//         const testCases = problem.fields.testCases as Array<{ input: string; output: string }>;
//         const basePoints = (problem.fields.points as number) || 100;

//         if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//             return NextResponse.json({
//                 error: 'Configuration Error: No test cases defined for this problem.'
//             }, { status: 500 });
//         }

//         // 3. Execute Code via Piston
//         const results = [];
//         let allPassed = true;
//         let totalRuntime = 0;

//         // Note: Piston doesn't support running multiple test cases in one go easily unless we wrap logic.
//         // For MVP, we run parallel or sequential requests. Sequential is safer for rate limits.

//         for (const testCase of testCases) {
//             const pistonPayload = {
//                 language: langConfig.language,
//                 version: langConfig.version,
//                 files: [{ content: code }],
//                 stdin: testCase.input || "",
//             };

//             try {
//                 const runRes = await fetch(PISTON_API_URL, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(pistonPayload),
//                 });

//                 if (!runRes.ok) {
//                     throw new Error(`Piston API Error: ${runRes.statusText}`);
//                 }

//                 const runData = await runRes.json();
//                 const runOutput = runData.run || {};

//                 // Output cleaning (trim newlines)
//                 const actualOutput = (runOutput.stdout || "").trim();
//                 const expectedOutput = (testCase.output || "").trim();
//                 const passed = actualOutput === expectedOutput;

//                 // Runtime parsing (approximated from Piston if available, else 0)
//                 // Piston doesn't strictly return runtime ms easily in all versions, 
//                 // but usually it's fast enough. We'll simulate or capture if available.
//                 // Assuming Piston v2 doesn't always give precise ms in run object, 
//                 // we might need to rely on our own timing or assume constant.
//                 // Actually Piston returns `run.signal` etc. 
//                 // Let's rely on client perception or just use a placeholder for now as Piston free tier doesn't guarantee metric accuracy.
//                 const runtime = 0; // Placeholder

//                 if (!passed) allPassed = false;

//                 results.push({
//                     input: testCase.input,
//                     expected: expectedOutput,
//                     actual: actualOutput,
//                     passed: passed,
//                     stderr: runOutput.stderr || "",
//                 });

//             } catch (err: any) {
//                 console.error("Test Case Error:", err);
//                 results.push({
//                     input: testCase.input,
//                     expected: testCase.output,
//                     actual: "Execution Error",
//                     passed: false,
//                     error: err.message
//                 });
//                 allPassed = false;
//             }
//         }

//         // 4. Calculate Score using logic
//         // Simulate a runtime based on "success" just for the scoring algo demonstration.
//         // In real judge0, we get time.
//         const simulatedRuntime = allPassed ? Math.floor(Math.random() * 100) + 20 : 0;
//         const points = calculateScore(allPassed, simulatedRuntime, basePoints);

//         // 5. Update Database (Submissions & Stats)
//         try {
//             // Insert Submission
//             await supabase.from('submissions').insert({
//                 user_id: user.id, // linked to profiles.id via cascade
//                 problem_slug: problemSlug,
//                 code: code,
//                 language: language,
//                 status: allPassed ? 'Passed' : 'Failed',
//                 runtime: simulatedRuntime,
//                 points_awarded: points
//             });

//             if (allPassed) {
//                 // Check if user has ALREADY solved this problem (excluding the one we just inserted based on logic or simply checking count).
//                 // Since we inserted above, if this is the first time, count should be 1.

//                 const { count } = await supabase
//                     .from('submissions')
//                     .select('*', { count: 'exact', head: true })
//                     .eq('user_id', user.id)
//                     .eq('problem_slug', problemSlug)
//                     .eq('status', 'Passed');

//                 // If count is 1, it means this is the first time (the one we just inserted).
//                 if (count === 1) {
//                     const { data: profile } = await supabase.from('profiles').select('total_points').eq('id', user.id).single();
//                     const newTotal = (profile?.total_points || 0) + points;

//                     await supabase.from('profiles').update({
//                         total_points: newTotal,
//                         updated_at: new Date().toISOString()
//                     }).eq('id', user.id);
//                 }
//             }
//         } catch (dbErr) {
//             console.error("DB Update Error", dbErr);
//             // Non-blocking error for user response, but log it
//         }

//         return NextResponse.json({
//             passed: allPassed,
//             results: results,
//             points_awarded: points,
//             runtime: simulatedRuntime
//         });

//     } catch (error: any) {
//         console.error('Execution API Global Error:', error);
//         return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import { contentfulClient } from '@/lib/contentful';
import { createClient } from '@/lib/supabase-server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Piston API Configuration
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    cpp: { language: 'c++', version: '10.2.0' },
    js: { language: 'javascript', version: '18.15.0' },
    py: { language: 'python', version: '3.10.0' },
    'c++': { language: 'c++', version: '10.2.0' },
    java: { language: 'java', version: '15.0.2' },
};

/**
 * Count non-empty, non-comment lines of code
 */
function countLinesOfCode(code: string, language: string): number {
    if (!code) return 0;
    const lines = code.trim().split('\n');
    let count = 0;

    for (const line of lines) {
        const stripped = line.trim();
        // Skip empty lines and comments
        if (stripped &&
            !stripped.startsWith('//') &&
            !stripped.startsWith('#') &&
            !stripped.startsWith('/*') &&
            !stripped.startsWith('*')) {
            count++;
        }
    }
    return count;
}

/**
 * Call Python grading algorithm to calculate advanced score
 */
async function calculateAdvancedScore(submissionData: {
    difficulty: string;
    execution_time_ms: number;
    code: string;
    optimal_loc: number;
    expected_complexity: string;
    user_complexity: string;
}): Promise<{
    total_score: number;
    max_marks: number;
    details: any;
}> {
    try {
        // Path to the Python grading script
        const scriptPath = path.join(process.cwd(), 'scripts', 'grade_submission.py');
        const input = JSON.stringify(submissionData);
        const base64Input = Buffer.from(input).toString('base64');

        // Execute python script with base64 encoded input to avoid shell issues
        const command = `python ${scriptPath} --input-base64 ${base64Input}`;

        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 1024 * 1024,
            timeout: 5000 // 5 second timeout
        });

        if (stderr) {
            console.warn('Python script stderr:', stderr);
        }

        const result = JSON.parse(stdout);
        return result;
    } catch (error: any) {
        console.error('Grading algorithm error:', error);

        // Fallback to basic scoring if Python script fails
        const fallbackScore = submissionData.difficulty === 'easy' ? 10 :
            submissionData.difficulty === 'medium' ? 20 : 30;

        return {
            total_score: fallbackScore,
            max_marks: fallbackScore,
            details: {
                error: 'Grading algorithm unavailable, using fallback scoring',
                execution_speed: { score: 0, max: 0 },
                lines_of_code: { score: 0, max: 0 }
            }
        };
    }
}

/**
 * Update rankings for all users based on total points
 */
async function updateAllRankings(supabase: any): Promise<void> {
    try {
        // Fetch all users sorted by points from profiles
        const { data: allUsers, error } = await supabase
            .from('profiles')
            .select('id, total_points')
            .order('total_points', { ascending: false });

        if (error) {
            console.error('Error fetching users for ranking:', error);
            return;
        }

        if (allUsers && allUsers.length > 0) {
            // Update rank for each user based on their position
            for (let i = 0; i < allUsers.length; i++) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        rank: `#${i + 1}`
                    })
                    .eq('id', allUsers[i].id);

                if (updateError) {
                    console.error(`Error updating rank for user ${allUsers[i].id}:`, updateError);
                }
            }
            console.log(`Successfully updated rankings for ${allUsers.length} users`);
        }
    } catch (error) {
        console.error('Error in updateAllRankings:', error);
    }
}

/**
 * Main POST handler for code execution
 */
export async function POST(request: Request) {
    try {
        const { code, language, problemSlug } = await request.json();

        // 1. Authentication Check
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Input Validation
        if (!code || !language || !problemSlug) {
            return NextResponse.json({
                error: 'Missing required fields: code, language, and problemSlug are required'
            }, { status: 400 });
        }

        const langConfig = LANGUAGE_MAP[language.toLowerCase()];
        if (!langConfig) {
            return NextResponse.json({
                error: `Unsupported language: ${language}. Supported languages: ${Object.keys(LANGUAGE_MAP).join(', ')}`
            }, { status: 400 });
        }

        // 3. Fetch Problem from Contentful
        const response = await contentfulClient.getEntries({
            content_type: 'codingProblem',
            'fields.slug': problemSlug,
            limit: 1,
        });

        if (response.items.length === 0) {
            return NextResponse.json({
                error: `Problem not found: ${problemSlug}`
            }, { status: 404 });
        }

        const problem = response.items[0];
        const testCases = problem.fields.testCases as Array<{ input: string; output: string }>;
        const difficulty = (problem.fields.difficulty as string)?.toLowerCase() || 'easy';
        const expectedComplexity = (problem.fields.expectedComplexity as string) || 'O(n)';
        const optimalLOC = (problem.fields.optimalLOC as number) || 20;

        if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
            return NextResponse.json({
                error: 'Configuration Error: No test cases defined for this problem.'
            }, { status: 500 });
        }

        // 4. Execute Code via Piston API
        const results = [];
        let allPassed = true;
        const executionTimes: number[] = [];

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const pistonPayload = {
                language: langConfig.language,
                version: langConfig.version,
                files: [{ content: code }],
                stdin: testCase.input || "",
            };

            try {
                const startTime = Date.now();

                const runRes = await fetch(PISTON_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pistonPayload),
                });

                const endTime = Date.now();
                const runtime = endTime - startTime;
                executionTimes.push(runtime);

                if (!runRes.ok) {
                    throw new Error(`Piston API Error: ${runRes.status} ${runRes.statusText}`);
                }

                const runData = await runRes.json();
                const runOutput = runData.run || {};

                // Compare outputs (trim whitespace)
                const actualOutput = (runOutput.stdout || "").trim();
                const expectedOutput = (testCase.output || "").trim();
                const passed = actualOutput === expectedOutput;

                if (!passed) allPassed = false;

                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expected: expectedOutput,
                    actual: actualOutput,
                    passed: passed,
                    stderr: runOutput.stderr || "",
                    runtime: runtime
                });

            } catch (err: any) {
                console.error(`Test Case ${i + 1} Error:`, err);
                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expected: testCase.output,
                    actual: "Execution Error",
                    passed: false,
                    error: err.message,
                    stderr: err.message
                });
                allPassed = false;
            }
        }

        // 5. Calculate execution statistics
        const avgRuntime = executionTimes.length > 0
            ? Math.round(executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length)
            : 0;

        // 6. Return response WITHOUT updating database or awarding points
        // Points are only awarded on submission via /api/code/submit
        return NextResponse.json({
            success: true,
            passed: allPassed,
            results: results,
            runtime: avgRuntime,
            message: allPassed
                ? `All ${testCases.length} test cases passed! Click Submit to save your solution and earn points.`
                : `${results.filter(r => r.passed).length}/${testCases.length} test cases passed. Keep trying!`
        });

    } catch (error: any) {
        console.error('Execution API Global Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error',
            details: error.stack
        }, { status: 500 });
    }
}