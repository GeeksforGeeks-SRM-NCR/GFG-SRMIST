import { NextResponse } from 'next/server';
import { contentfulClient } from '@/lib/contentful';
import { createClient } from '@/lib/supabase-server';

// Piston API
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    cpp: { language: 'c++', version: '10.2.0' },
    js: { language: 'javascript', version: '18.15.0' },
    py: { language: 'python', version: '3.10.0' },
    'c++': { language: 'c++', version: '10.2.0' },
};

export async function POST(request: Request) {
    try {
        const { code, language, problemSlug } = await request.json();

        if (!code || !language || !problemSlug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const langConfig = LANGUAGE_MAP[language.toLowerCase()];
        if (!langConfig) {
            return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
        }

        // 1. Fetch Problem
        const response = await contentfulClient.getEntries({
            content_type: 'codingProblem',
            'fields.slug': problemSlug,
            limit: 1,
        });

        if (response.items.length === 0) {
            return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
        }

        const problem = response.items[0];
        const testCases = problem.fields.testCases as Array<{ input: string; output: string }>;

        if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
            // Graceful fallback to simple execution without validation if no test cases
            // But user expects competitive programming validation.
            // Return error but with 200/400 status to prevent 500 crash in UI
            console.warn(`No test cases for problem: ${problemSlug}`);
            return NextResponse.json({
                passed: false,
                results: [],
                error: 'Configuration Error: No test cases defined for this problem.'
            });
        }

        // 2. Execute Code
        const results = [];
        let allPassed = true;

        for (const testCase of testCases) {
            // Piston takes input as stdin string
            const pistonPayload = {
                language: langConfig.language,
                version: langConfig.version,
                files: [{ content: code }],
                stdin: testCase.input || "", // Ensure string
            };

            try {
                const runRes = await fetch(PISTON_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pistonPayload),
                });

                if (!runRes.ok) {
                    throw new Error(`Execution API Error: ${runRes.statusText}`);
                }

                const runData = await runRes.json();

                // Check if compile error or runtime error
                if (runData.run) {
                    const actualOutput = (runData.run.output || "").trim();
                    const expectedOutput = (testCase.output || "").trim();
                    const passed = actualOutput === expectedOutput;

                    // If checking strict equality fails, maybe try flexible check (ignore trailing newlines etc) which .trim() does.
                    // Complex objects usage: if output is "[0, 1]", comparing strings works if format matches.

                    if (!passed) allPassed = false;

                    results.push({
                        input: testCase.input,
                        expected: expectedOutput,
                        actual: actualOutput,
                        passed: passed,
                        stderr: runData.run.stderr || "", // runtime errors
                        stdout: runData.run.stdout // stdout
                    });
                } else {
                    // Unexpected API response structure
                    throw new Error('Invalid API response');
                }

            } catch (err: any) {
                console.error("Test Case Error:", err);
                results.push({
                    input: testCase.input,
                    expected: testCase.output,
                    actual: "Execution Failed",
                    passed: false,
                    error: err.message
                });
                allPassed = false;
            }
        }

        // 3. Update Supabase
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            try {
                await supabase.from('user_submissions').insert({
                    user_id: user.id,
                    problem_slug: problemSlug,
                    code: code,
                    language: language,
                    status: allPassed ? 'Passed' : 'Failed',
                    runtime: 0 // Placeholder
                });

                if (allPassed) {
                    // Naive increment for Leaderboard MVP
                    // In prod: Check uniqueness
                    const { data: stats } = await supabase.from('user_stats').select('total_solved').eq('user_id', user.id).single();

                    // Ideally use rpc or trigger. Client-side increment is race-condition prone but ok for MVP
                    const current = stats?.total_solved || 0;
                    // Upsert
                    await supabase.from('user_stats').upsert({
                        user_id: user.id,
                        total_solved: current + 1
                    }, { onConflict: 'user_id' });
                }
            } catch (dbErr) {
                console.error("Supabase Error:", dbErr);
                // Don't fail the request if stats fail
            }
        }

        return NextResponse.json({
            passed: allPassed,
            results: results,
        });

    } catch (error: any) {
        console.error('Execution API Global Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
