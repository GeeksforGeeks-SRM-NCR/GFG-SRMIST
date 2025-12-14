import React from 'react';
import { contentfulClient } from '@/lib/contentful';
import ProblemCard from '@/components/ProblemCard';
import { createClient } from '@/lib/supabase-server';
import { Trophy, Medal, AlertCircle } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

async function getProblems() {
    try {
        const response = await contentfulClient.getEntries({
            content_type: 'codingProblem',
            order: '-sys.createdAt',
        });
        return response.items;
    } catch (error) {
        console.error("Contentful Error:", error);
        return [];
    }
}

async function getSolvedProblems(userId) {
    if (!userId) return new Set();

    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('user_submissions')
            .select('problem_slug')
            .eq('user_id', userId)
            .eq('status', 'Passed');

        if (!data) return new Set();
        return new Set(data.map(item => item.problem_slug));
    } catch (e) {
        console.error("Supabase Error:", e);
        return new Set();
    }
}

async function getLeaderboard() {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('user_stats')
            .select('*')
            .order('total_solved', { ascending: false })
            .limit(10); // Top 10 for sidebar
        return data || [];
    } catch (e) {
        return [];
    }
}

// Mock Data for Fallback
const MOCK_PROBLEMS = [
    {
        sys: { id: 'mock-1' },
        fields: {
            title: 'Two Sum',
            slug: 'two-sum',
            difficulty: 'Easy',
            description: 'Given an array of integers...',
        }
    },
    {
        sys: { id: 'mock-2' },
        fields: {
            title: 'Valid Palindrome',
            slug: 'valid-palindrome',
            difficulty: 'Easy',
            description: 'Check if a string is a palindrome...',
        }
    },
    {
        sys: { id: 'mock-3' },
        fields: {
            title: 'LRU Cache',
            slug: 'lru-cache',
            difficulty: 'Hard',
            description: 'Design an LRU Cache...',
        }
    }
];

export default async function PracticePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let problems = await getProblems();
    const solvedProblems = await getSolvedProblems(user?.id);
    const leaderboard = await getLeaderboard();

    // Fallback if no problems found (setup issue or empty contentful)
    const usingMock = problems.length === 0;
    if (problems.length === 0) {
        console.log("No problems found, using scenarios.");
        problems = MOCK_PROBLEMS;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Column: Problems */}
            <div className="flex-1">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-4">
                        Coding Challenges
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Master algorithms and data structures.
                    </p>
                    {usingMock && (
                        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 flex items-center gap-2">
                            <AlertCircle size={20} />
                            <span>Showing sample problems (Contentful data not found).</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {problems.map((problem) => (
                        <ProblemCard
                            key={problem.sys.id}
                            problem={problem}
                            isSolved={solvedProblems.has(problem.fields.slug)}
                        />
                    ))}
                </div>
            </div>

            {/* Right Column: Leaderboard */}
            <div className="w-full lg:w-96 shrink-0 space-y-6">
                <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Trophy className="text-yellow-500" size={20} />
                        Top Solvers
                    </h2>

                    <div className="space-y-4">
                        {leaderboard.length > 0 ? (
                            leaderboard.map((u, idx) => (
                                <div key={u.user_id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-yellow-400' :
                                                idx === 1 ? 'text-gray-300' :
                                                    idx === 2 ? 'text-amber-700' : 'text-gray-500'
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-gray-200 text-sm font-mono">
                                            User_{u.user_id.slice(0, 4)}..
                                        </span>
                                    </div>
                                    <span className="font-bold text-primary text-sm">{u.total_solved} Solved</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4 text-sm">
                                No submissions yet. Be the first!
                            </div>
                        )}
                    </div>

                    {/* Optional: Link to full leaderboard if we kept the page */}
                    {/* <Link href="/leaderboard" className="block mt-6 text-center text-sm text-primary hover:underline">
                View Full Leaderboard
            </Link> */}
                </div>

                {/* Stats Card (Optional) */}
                <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-medium text-white mb-2">Your Progress</h3>
                    {user ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Solved</span>
                                <span className="text-white">{solvedProblems.size}</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${Math.min((solvedProblems.size / problems.length) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            Log in to track your progress.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
