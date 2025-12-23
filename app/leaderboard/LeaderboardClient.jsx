// "use client";
// import React from 'react';
// import { Trophy, Crown, Medal, Award, TrendingUp, ArrowLeft } from 'lucide-react';
// import Squares from '../components/Squares';
// import { Logo } from "../logo/logo";
// import { Logo2 } from "../logo/logo2";
// import Link from "next/link";
// import { useRouter } from 'next/navigation';

// export default function LeaderboardClient({ leaderboard }) {
//     const router = useRouter();

//     const getAvatar = (user) => {
//         if (user.avatar_url) return user.avatar_url;
//         return `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=random`;
//     };

//     return (
//         <div className="min-h-screen bg-black text-white relative overflow-hidden">
//             {/* Background */}
//             <div className="fixed inset-0 z-0">
//                 <Squares
//                     speed={0.5}
//                     squareSize={40}
//                     direction='diagonal'
//                     borderColor='#333'
//                     hoverFillColor='#222'
//                 />
//             </div>

//             {/* Ambient Glow */}
//             <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[128px] z-0 animate-pulse" />
//             <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[128px] z-0 animate-pulse" style={{ animationDelay: '1s' }} />

//             {/* Custom Navbar with Back Button */}
//             <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
//                 <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//                     {/* Back Button */}
//                     <button
//                         onClick={() => router.back()}
//                         className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group"
//                     >
//                         <ArrowLeft className="text-green-400 group-hover:-translate-x-1 transition-transform" size={20} />
//                         <span className="text-white font-medium">Back</span>
//                     </button>

//                     {/* Logo */}
//                     <Link href="/" className="absolute left-1/2 -translate-x-1/2">
//                         <Logo />
//                     </Link>

//                     {/* Empty space for balance */}
//                     <div className="w-24"></div>
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="relative z-10">
//                 <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
//                     {/* Hero Section */}
//                     <div className="text-center mb-16">
//                         <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-full px-6 py-3 mb-6">
//                             <Trophy className="text-yellow-400" size={20} />
//                             <span className="text-yellow-400 font-semibold">Top Performers</span>
//                         </div>

//                         <h1 className="font-sf-pro" style={{
//                             fontSize: "clamp(3.5rem, 5vw, 6.5rem)",
//                             fontWeight: "800",
//                             color: "#fff",
//                             marginBottom: "25px",
//                             letterSpacing: "-3px",
//                             lineHeight: "1.1",
//                         }}>
//                             GLOBAL <span style={{ color: "#FFA500" }}>LEADERBOARD</span>
//                         </h1>

//                         <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
//                             Compete with the best coders and climb the ranks
//                         </p>
//                     </div>

//                     {/* Complete Rankings Container */}
//                     <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
//                         {/* Header with Logo2 */}
//                         <div className="p-8 border-b border-white/10">
//                             <div className="flex flex-col items-center gap-4 mb-2">
//                                 <div className="w-48">
//                                     <Logo2 />
//                                 </div>
//                                 <h2 className="text-3xl font-bold text-white flex items-center gap-3">
//                                     <TrendingUp className="text-green-400" size={32} />
//                                     Complete Rankings
//                                 </h2>
//                             </div>
//                         </div>

//                         {/* Top 3 Podium */}
//                         {leaderboard.length >= 3 && (
//                             <div className="bg-gradient-to-b from-white/5 to-transparent p-8 pt-24 border-b border-white/10">
//                                 <div className="flex items-end justify-center gap-8">
//                                     {/* 2nd Place */}
//                                     <div className="flex flex-col items-center">
//                                         <Medal className="text-gray-400 mb-3" size={36} />
//                                         <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-2xl border-4 border-gray-400/40 animate-pulse overflow-hidden">
//                                             <img src={getAvatar(leaderboard[1])} alt="2nd place" className="w-full h-full object-cover" />
//                                         </div>
//                                         <div className="bg-gradient-to-b from-gray-400/30 to-gray-500/30 backdrop-blur-md border border-gray-400/40 rounded-t-2xl px-6 py-10 text-center min-w-[160px]">
//                                             <div className="text-6xl mb-3">🥈</div>
//                                             <h3 className="text-white font-bold text-xl mb-2 truncate max-w-[140px]">{leaderboard[1].username || 'Anonymous'}</h3>
//                                             <div className="text-3xl font-bold text-white mb-2">{leaderboard[1].total_points}</div>
//                                             <p className="text-sm text-gray-300">points</p>
//                                         </div>
//                                     </div>

//                                     {/* 1st Place */}
//                                     <div className="flex flex-col items-center -mt-16">
//                                         <Crown className="text-yellow-400 mb-3 animate-bounce" size={48} />
//                                         <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-2xl border-4 border-yellow-400/60 animate-pulse overflow-hidden">
//                                             <img src={getAvatar(leaderboard[0])} alt="1st place" className="w-full h-full object-cover" />
//                                         </div>
//                                         <div className="bg-gradient-to-b from-yellow-400/40 to-yellow-600/40 backdrop-blur-md border border-yellow-400/60 rounded-t-2xl px-8 py-12 text-center min-w-[180px]">
//                                             <div className="text-7xl mb-4">🥇</div>
//                                             <h3 className="text-white font-bold text-2xl mb-3 truncate max-w-[160px]">{leaderboard[0].username || 'Anonymous'}</h3>
//                                             <div className="text-4xl font-bold text-white mb-2">{leaderboard[0].total_points}</div>
//                                             <p className="text-base text-yellow-100">points</p>
//                                         </div>
//                                     </div>

//                                     {/* 3rd Place */}
//                                     <div className="flex flex-col items-center">
//                                         <Award className="text-amber-600 mb-3" size={36} />
//                                         <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-2xl border-4 border-amber-700/40 animate-pulse overflow-hidden">
//                                             <img src={getAvatar(leaderboard[2])} alt="3rd place" className="w-full h-full object-cover" />
//                                         </div>
//                                         <div className="bg-gradient-to-b from-amber-600/30 to-amber-800/30 backdrop-blur-md border border-amber-700/40 rounded-t-2xl px-6 py-10 text-center min-w-[160px]">
//                                             <div className="text-6xl mb-3">🥉</div>
//                                             <h3 className="text-white font-bold text-xl mb-2 truncate max-w-[140px]">{leaderboard[2].username || 'Anonymous'}</h3>
//                                             <div className="text-3xl font-bold text-white mb-2">{leaderboard[2].total_points}</div>
//                                             <p className="text-sm text-amber-200">points</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Scrollable Rankings List */}
//                         <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
//                             <div className="p-6 space-y-3">
//                                 {leaderboard.length > 3 ? (
//                                     leaderboard.slice(3).map((user, idx) => {
//                                         const actualRank = idx + 4;
//                                         return (
//                                             <div
//                                                 key={user.username || idx}
//                                                 className="flex items-center justify-between p-5 rounded-xl transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20"
//                                             >
//                                                 <div className="flex items-center gap-4 flex-1">
//                                                     {/* Rank Badge */}
//                                                     <div className="w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg bg-white/10 text-gray-400 border border-white/20">
//                                                         #{actualRank}
//                                                     </div>

//                                                     {/* User Avatar */}
//                                                     <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
//                                                         <img src={getAvatar(user)} alt={user.username} className="w-full h-full object-cover" />
//                                                     </div>

//                                                     {/* User Info */}
//                                                     <div className="flex-1">
//                                                         <h3 className="text-white font-semibold text-lg">{user.username || 'Anonymous'}</h3>
//                                                         <p className="text-gray-400 text-sm">{user.rank || 'Student'}</p>
//                                                     </div>
//                                                 </div>

//                                                 {/* Score */}
//                                                 <div className="text-right">
//                                                     <div className="flex items-center gap-2">
//                                                         <Trophy className="text-green-400" size={20} />
//                                                         <span className="text-2xl font-bold text-green-400">{user.total_points}</span>
//                                                     </div>
//                                                     <p className="text-xs text-gray-500 mt-1">points</p>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })
//                                 ) : leaderboard.length === 0 ? (
//                                     <div className="text-center py-16">
//                                         <Trophy className="mx-auto mb-4 text-gray-600" size={48} />
//                                         <p className="text-gray-500 text-lg">No data available yet</p>
//                                         <p className="text-gray-600 text-sm mt-2">Start solving problems to appear on the leaderboard!</p>
//                                     </div>
//                                 ) : null}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Copyright Footer */}
//             <div className="relative z-20 w-full text-center py-6 text-white/60 text-xs">
//                 <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
//             </div>

//             {/* Custom Scrollbar Styles */}
//             <style jsx>{`
//                 .custom-scrollbar::-webkit-scrollbar {
//                     width: 8px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-track {
//                     background: rgba(255, 255, 255, 0.05);
//                     border-radius: 10px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb {
//                     background: rgba(70, 185, 78, 0.5);
//                     border-radius: 10px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//                     background: rgba(70, 185, 78, 0.7);
//                 }
//             `}</style>
//         </div>
//     );
// }


"use client";
import React from 'react';
import { Trophy, Crown, Medal, Award, TrendingUp, ArrowLeft, Users, Code, CheckCircle, Star } from 'lucide-react';
import Squares from '../components/Squares';
import { Logo } from "../logo/logo";
import { Logo2 } from "../logo/logo2";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function LeaderboardClient({ leaderboard, stats, currentUserRank }) {
    const router = useRouter();

    const getAvatar = (user) => {
        if (user.avatar_url) return user.avatar_url;
        const displayName = user.full_name || user.username || 'User';
        return `https://ui-avatars.com/api/?name=${displayName}&background=random`;
    };

    const getDisplayName = (user) => {
        return user.full_name || user.username || 'Anonymous';
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>

            {/* Ambient Glow */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[128px] z-0 animate-pulse" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[128px] z-0 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Custom Navbar with Back Button */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 group"
                    >
                        <ArrowLeft className="text-green-400 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="text-white font-medium">Back</span>
                    </button>

                    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                        <Logo />
                    </Link>

                    <div className="w-24"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-full px-6 py-3 mb-6">
                            <Trophy className="text-yellow-400" size={20} />
                            <span className="text-yellow-400 font-semibold">Top Performers</span>
                        </div>

                        <h1 className="font-sf-pro" style={{
                            fontSize: "clamp(3.5rem, 5vw, 6.5rem)",
                            fontWeight: "800",
                            color: "#fff",
                            marginBottom: "25px",
                            letterSpacing: "-3px",
                            lineHeight: "1.1",
                        }}>
                            GLOBAL <span style={{ color: "#FFA500" }}>LEADERBOARD</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                            Compete with the best coders and climb the ranks
                        </p>

                        {/* Current User Rank Badge (if logged in) */}
                        {currentUserRank && (
                            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl px-8 py-4 mb-8">
                                <Star className="text-green-400" size={24} />
                                <div className="text-left">
                                    <p className="text-sm text-gray-400">Your Rank</p>
                                    <p className="text-2xl font-bold text-white">#{currentUserRank.actualRank}</p>
                                </div>
                                <div className="h-12 w-px bg-white/20"></div>
                                <div className="text-left">
                                    <p className="text-sm text-gray-400">Total Points</p>
                                    <p className="text-2xl font-bold text-green-400">{currentUserRank.total_points}</p>
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <Users className="text-blue-400" size={24} />
                                    <span className="text-3xl font-bold text-white">{stats.totalUsers}</span>
                                </div>
                                <p className="text-gray-400 text-sm">Total Competitors</p>
                            </div>
                            
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <Code className="text-purple-400" size={24} />
                                    <span className="text-3xl font-bold text-white">{stats.totalSubmissions}</span>
                                </div>
                                <p className="text-gray-400 text-sm">Total Submissions</p>
                            </div>
                            
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <CheckCircle className="text-green-400" size={24} />
                                    <span className="text-3xl font-bold text-white">{stats.successfulSubmissions}</span>
                                </div>
                                <p className="text-gray-400 text-sm">Successful Solutions</p>
                            </div>
                        </div>
                    </div>

                    {/* Complete Rankings Container */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                        {/* Header with Logo2 */}
                        <div className="p-8 border-b border-white/10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-48">
                                    <Logo2 />
                                </div>

                            </div>
                        </div>

                        {/* Top 3 Podium - Only show if we have at least 1 user */}
                        {leaderboard.length > 0 && (
                            <div className="bg-gradient-to-b from-white/5 to-transparent p-8 pt-24 border-b border-white/10">
                                <div className="flex items-end justify-center gap-8 flex-wrap">
                                    {/* 2nd Place - Only show if we have at least 2 users */}
                                    {leaderboard.length >= 2 && (
                                        <div className="flex flex-col items-center">
                                            <Medal className="text-gray-400 mb-3" size={36} />
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-2xl border-4 border-gray-400/40  overflow-hidden">
                                                <img src={getAvatar(leaderboard[1])} alt="2nd place" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="bg-gradient-to-b from-gray-400/30 to-gray-500/30 backdrop-blur-md border border-gray-400/40 rounded-t-2xl px-6 py-10 text-center min-w-[160px]">
                                                <div className="text-6xl mb-3">🥈</div>
                                                <h3 className="text-white font-bold text-xl mb-2 truncate max-w-[140px]">{getDisplayName(leaderboard[1])}</h3>
                                                <div className="text-3xl font-bold text-white mb-2">{leaderboard[1].total_points}</div>
                                                <p className="text-sm text-gray-300 mb-2">points</p>
                                                <div className="mt-3 px-3 py-1 bg-gray-600/50 rounded-full text-xs text-gray-200">
                                                    Rank #{leaderboard[1].currentRank}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 1st Place - Always show if we have at least 1 user */}
                                    <div className="flex flex-col items-center -mt-16">
                                        <Crown className="text-yellow-400 mb-3 animate-bounce" size={48} />
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-2xl border-4 border-yellow-400/60 overflow-hidden">
                                            <img src={getAvatar(leaderboard[0])} alt="1st place" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="bg-gradient-to-b from-yellow-400/40 to-yellow-600/40 backdrop-blur-md border border-yellow-400/60 rounded-t-2xl px-8 py-12 text-center min-w-[180px]">
                                            <div className="text-7xl mb-4">🥇</div>
                                            <h3 className="text-white font-bold text-2xl mb-3 truncate max-w-[160px]">{getDisplayName(leaderboard[0])}</h3>
                                            <div className="text-4xl font-bold text-white mb-2">{leaderboard[0].total_points}</div>
                                            <p className="text-base text-yellow-100 mb-2">points</p>
                                            <div className="mt-3 px-4 py-1 bg-yellow-600/50 rounded-full text-sm font-bold text-yellow-50">
                                                👑 Champion
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3rd Place - Only show if we have at least 3 users */}
                                    {leaderboard.length >= 3 && (
                                        <div className="flex flex-col items-center">
                                            <Award className="text-amber-600 mb-3" size={36} />
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-2xl border-4 border-amber-700/40 overflow-hidden">
                                                <img src={getAvatar(leaderboard[2])} alt="3rd place" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="bg-gradient-to-b from-amber-600/30 to-amber-800/30 backdrop-blur-md border border-amber-700/40 rounded-t-2xl px-6 py-10 text-center min-w-[160px]">
                                                <div className="text-6xl mb-3">🥉</div>
                                                <h3 className="text-white font-bold text-xl mb-2 truncate max-w-[140px]">{getDisplayName(leaderboard[2])}</h3>
                                                <div className="text-3xl font-bold text-white mb-2">{leaderboard[2].total_points}</div>
                                                <p className="text-sm text-amber-200 mb-2">points</p>
                                                <div className="mt-3 px-3 py-1 bg-amber-700/50 rounded-full text-xs text-amber-100">
                                                    Rank #{leaderboard[2].currentRank}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Scrollable Rankings List */}
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <div className="p-6 space-y-3">
                                {/* Show remaining users after top 3, or all users in list if less than 3 */}
                                {leaderboard.length > 3 ? (
                                    // Show users from 4th place onwards
                                    leaderboard.slice(3).map((user, idx) => {
                                        const actualRank = user.currentRank;
                                        const isCurrentUser = currentUserRank && user.id === currentUserRank.user_id;
                                        
                                        return (
                                            <div
                                                key={user.id || idx}
                                                className={`flex items-center justify-between p-5 rounded-xl transition-all duration-300 border ${
                                                    isCurrentUser 
                                                        ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20'
                                                        : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
                                                } hover:scale-[1.02]`}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    {/* Rank Badge */}
                                                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg border-2 ${
                                                        actualRank <= 10 
                                                            ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-400'
                                                            : 'bg-white/10 text-gray-400 border-white/20'
                                                    }`}>
                                                        #{actualRank}
                                                    </div>

                                                    {/* User Avatar */}
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                                        <img src={getAvatar(user)} alt={getDisplayName(user)} className="w-full h-full object-cover" />
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-white font-semibold text-lg">{getDisplayName(user)}</h3>
                                                            {isCurrentUser && (
                                                                <span className="px-2 py-1 bg-green-500/30 text-green-400 text-xs rounded-full font-semibold">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-400">{user.displayRank || `Rank #${actualRank}`}</p>
                                                    </div>
                                                </div>

                                                {/* Score */}
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className="text-green-400" size={20} />
                                                        <span className="text-2xl font-bold text-green-400">{user.total_points}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">points</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : leaderboard.length === 0 ? (
                                    // No users at all
                                    <div className="text-center py-16">
                                        <Trophy className="mx-auto mb-4 text-gray-600" size={48} />
                                        <p className="text-gray-500 text-lg">No data available yet</p>
                                        <p className="text-gray-600 text-sm mt-2">Start solving problems to appear on the leaderboard!</p>
                                    </div>
                                ) : (
                                    // 1-3 users total - show message that they're on the podium
                                    <div className="text-center py-16">
                                        <Trophy className="mx-auto mb-4 text-green-400" size={48} />
                                        <p className="text-gray-400 text-lg">Top {leaderboard.length} competitors shown above!</p>
                                        <p className="text-gray-500 text-sm mt-2">Keep solving to climb the ranks 🚀</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Footer */}
            <div className="relative z-20 w-full text-center py-6 text-white/60 text-xs">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(70, 185, 78, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(70, 185, 78, 0.7);
                }
            `}</style>
        </div>
    );
}
