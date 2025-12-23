import React from 'react';
import { contentfulClient } from '@/lib/contentful';
import ProblemCard from '@/components/ProblemCard';
import { createClient } from '@/lib/supabase-server';
import { AlertCircle, Code2 } from 'lucide-react';
import GlassyNavbar from '../components/GlassyNavbar';
import Squares from '../components/Squares';
import PracticeClient from './PracticeClient';

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
            .from('submissions')
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
            .from('profiles')
            .select('username, total_points, avatar_url, id') // Select necessary fields
            .order('total_points', { ascending: false })
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

    // Fetch user profile if logged in
    let userProfile = null;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, total_points, rank')
            .eq('id', user.id)
            .single();
        userProfile = profile;
    }

    // Fallback if no problems found (setup issue or empty contentful)
    const usingMock = problems.length === 0;
    if (problems.length === 0) {
        console.log("No problems found, using scenarios.");
        problems = MOCK_PROBLEMS;
    }

    // Calculate stats
    const totalProblems = problems.length;
    const solvedCount = solvedProblems.size;
    const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
    const userRank = user && leaderboard.length > 0 ? (leaderboard.findIndex(u => u.id === user.id) + 1 || 'N/A') : 'N/A';

    const easyProblems = problems.filter(p => p.fields.difficulty === 'Easy');
    const mediumProblems = problems.filter(p => p.fields.difficulty === 'Medium');
    const hardProblems = problems.filter(p => p.fields.difficulty === 'Hard');

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>



            {/* Ambient Glow Blobs */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[128px] z-0 animate-pulse" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] z-0 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative z-10">
                <GlassyNavbar />

                <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-full px-6 py-3 mb-6">
                            <Code2 className="text-green-400" size={20} />
                            <span className="text-green-400 font-semibold">Master Your Skills</span>
                        </div>


                        <h1 className="font-sf-pro" style={{
                            fontSize: "clamp(3rem, 10vw, 6.5rem)",
                            fontWeight: "800",
                            color: "#fff",
                            marginBottom: "25px",
                            letterSpacing: "-3px",
                            lineHeight: "1.1",
                        }}>
                            CODING <span style={{ color: "rgba(32,140,41,1)" }}> CHALLENGES</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
                            Sharpen your problem-solving skills with curated DSA challenges.
                            <span className="text-white"> Track progress, compete on leaderboards</span>, and become interview-ready.
                        </p>
                    </div>

                    {/* Alert if using mock data */}
                    {usingMock && (
                        <div className="mb-8 p-4 rounded-2xl bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 text-yellow-200 flex items-center gap-3 max-w-4xl mx-auto">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <span className="text-sm">Showing sample problems (Contentful data not found).</span>
                        </div>
                    )}

                    {/* New Two Container Section */}
                    <PracticeClient
                        totalProblems={totalProblems}
                        solvedCount={solvedCount}
                        progressPercentage={progressPercentage}
                        leaderboard={leaderboard}
                        userRank={userRank}
                        initialUserProfile={userProfile}
                    />

                    {/* Main Content */}
                    <div className="w-full">
                        {/* Problem Set Title */}
                        <div className="mb-8">

                            <h1 className="font-sf-pro  text-center bg-clip-text text-transparent mb-6" style={{
                                fontSize: "clamp(3.2rem, 10vw, 6.5rem)",
                                fontWeight: "800",
                                color: "#fff",
                                marginBottom: "25px",
                                letterSpacing: "-3px",
                                lineHeight: "1.1",
                            }}>
                                PROBLEM <span style={{ color: "rgba(32,140,41,1)" }}> SET</span>
                            </h1>

                        </div>

                        {/* Difficulty Stats - Full Width */}
                        <div className="grid grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
                            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-green-400 mb-2">{easyProblems.length}</div>
                                <div className="text-sm text-green-300/80 font-medium">Easy Problems</div>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-yellow-400 mb-2">{mediumProblems.length}</div>
                                <div className="text-sm text-yellow-300/80 font-medium">Medium Problems</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-red-400 mb-2">{hardProblems.length}</div>
                                <div className="text-sm text-red-300/80 font-medium">Hard Problems</div>
                            </div>
                        </div>

                        {/* Problems List - Full Width */}
                        <div className="space-y-4 max-w-6xl mx-auto">
                            {problems.map((problem, index) => (
                                <div key={problem.sys.id}>
                                    <ProblemCard
                                        problem={problem}
                                        isSolved={solvedProblems.has(problem.fields.slug)}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Footer */}
            <div className="relative z-20 w-full text-center py-6 text-white/60 text-xs">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}
