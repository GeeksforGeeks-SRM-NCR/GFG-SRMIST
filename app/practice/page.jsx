import React from 'react';
import { contentfulClient } from '@/lib/contentful';
import ProblemCard from '@/components/ProblemCard';
import { createClient } from '@/lib/supabase-server';
import { Trophy, Medal, AlertCircle, Code2, Target, Flame, Crown, TrendingUp, Award } from 'lucide-react';
import GlassyNavbar from '../components/GlassyNavbar';
import Squares from '../components/Squares';
import LightRays from '../components/LightRays';

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

    // Calculate stats
    const totalProblems = problems.length;
    const solvedCount = solvedProblems.size;
    const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
    
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
                        
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-900 via-green-500 to-green-900 pb-2">
                            Coding Challenges
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
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

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 hover:scale-105">
                            <Target className="mb-3 text-green-400" size={28} />
                            <div className="text-3xl font-bold text-white mb-1">{totalProblems}</div>
                            <div className="text-sm text-gray-400">Total Problems</div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
                            <Trophy className="mb-3 text-blue-400" size={28} />
                            <div className="text-3xl font-bold text-blue-400 mb-1">{solvedCount}</div>
                            <div className="text-sm text-gray-400">Solved</div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
                            <TrendingUp className="mb-3 text-purple-400" size={28} />
                            <div className="text-3xl font-bold text-purple-400 mb-1">{progressPercentage}%</div>
                            <div className="text-sm text-gray-400">Progress</div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
                            <Flame className="mb-3 text-yellow-400" size={28} />
                            <div className="text-3xl font-bold text-yellow-400 mb-1">
                                {user ? (leaderboard.findIndex(u => u.user_id === user.id) + 1 || '-') : '-'}
                            </div>
                            <div className="text-sm text-gray-400">Your Rank</div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Problems */}
                        <div className="flex-1">
                            {/* Section Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                                    Problem Set
                                </h2>
                                <p className="text-gray-400 text-sm ml-7">Click on any problem to start solving</p>
                            </div>

                            {/* Difficulty Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-md border border-green-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                                    <div className="text-2xl font-bold text-green-400">{easyProblems.length}</div>
                                    <div className="text-xs text-green-300/80 mt-1 font-medium">Easy</div>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                                    <div className="text-2xl font-bold text-yellow-400">{mediumProblems.length}</div>
                                    <div className="text-xs text-yellow-300/80 mt-1 font-medium">Medium</div>
                                </div>
                                <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-md border border-red-500/30 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                                    <div className="text-2xl font-bold text-red-400">{hardProblems.length}</div>
                                    <div className="text-xs text-red-300/80 mt-1 font-medium">Hard</div>
                                </div>
                            </div>

                            {/* Problems List */}
                            <div className="space-y-3">
                                {problems.map((problem, index) => (
                                    <div 
                                        key={problem.sys.id}
                                        style={{ 
                                            animationDelay: `${index * 50}ms`,
                                            animation: 'fadeInUp 0.5s ease-out forwards',
                                            opacity: 0
                                        }}
                                    >
                                        <ProblemCard
                                            problem={problem}
                                            isSolved={solvedProblems.has(problem.fields.slug)}
                                            index={index}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Leaderboard & Progress */}
                        <div className="w-full lg:w-96 shrink-0 space-y-6">
                            {/* Your Progress Card */}
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Award className="text-green-400" size={20} />
                                            Your Progress
                                        </h3>
                                    </div>

                                    {user ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-300">Problems Solved</span>
                                                <span className="text-2xl font-bold text-green-400">{solvedCount}/{totalProblems}</span>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div>
                                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                                    <span>Completion Rate</span>
                                                    <span className="text-green-400 font-semibold">{progressPercentage}%</span>
                                                </div>
                                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Difficulty Breakdown */}
                                            <div className="pt-4 border-t border-white/10 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Easy</span>
                                                    <span className="text-green-400 font-medium">
                                                        {Array.from(solvedProblems).filter(slug => 
                                                            problems.find(p => p.fields.slug === slug)?.fields.difficulty === 'Easy'
                                                        ).length}/{easyProblems.length}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Medium</span>
                                                    <span className="text-yellow-400 font-medium">
                                                        {Array.from(solvedProblems).filter(slug => 
                                                            problems.find(p => p.fields.slug === slug)?.fields.difficulty === 'Medium'
                                                        ).length}/{mediumProblems.length}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Hard</span>
                                                    <span className="text-red-400 font-medium">
                                                        {Array.from(solvedProblems).filter(slug => 
                                                            problems.find(p => p.fields.slug === slug)?.fields.difficulty === 'Hard'
                                                        ).length}/{hardProblems.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-gray-400 mb-4">Log in to track your coding journey</p>
                                            <a href="/login" className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                                                Sign In
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Leaderboard Card */}
                            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
                                
                                <div className="relative z-10">
                                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <Crown className="text-yellow-400" size={20} />
                                        Top Solvers
                                    </h2>

                                    <div className="space-y-3">
                                        {leaderboard.length > 0 ? (
                                            leaderboard.map((u, idx) => (
                                                <div 
                                                    key={u.user_id} 
                                                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                                                        idx < 3 
                                                            ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20' 
                                                            : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                                                            idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                            idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                            idx === 2 ? 'bg-amber-700/20 text-amber-600' :
                                                            'bg-white/5 text-gray-500'
                                                        }`}>
                                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                                        </div>
                                                        <span className="text-gray-200 text-sm font-mono">
                                                            {user && user.id === u.user_id ? 'You' : `User_${u.user_id.slice(0, 4)}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-green-400 text-sm">{u.total_solved}</span>
                                                        <Trophy size={14} className="text-green-400/60" />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <Trophy className="mx-auto mb-3 text-gray-600" size={32} />
                                                <p className="text-gray-500 text-sm">No submissions yet. Be the first!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
