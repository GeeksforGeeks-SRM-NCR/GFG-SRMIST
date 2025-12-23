"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Trophy, Target, TrendingUp, Crown, User, LogIn, Medal, Award, Settings, X, Upload, Camera, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserLoginModal from '../../components/UserLoginModal';
import { supabase } from '@/lib/supabase';


// Demo credentials
const DEMO_USER = {
    username: "demo",
    password: "demo123",
    email: "demo@gfg.com"
};

// Demo profile photos for top 3
const PROFILE_PHOTOS = {
    1: "https://randomuser.me/api/portraits/men/32.jpg",
    2: "https://randomuser.me/api/portraits/women/44.jpg",
    3: "https://randomuser.me/api/portraits/men/52.jpg"
};

export default function PracticeClient({
    totalProblems,
    solvedCount,
    progressPercentage,
    leaderboard,
    userRank,
    initialUserProfile
}) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(!!initialUserProfile);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(initialUserProfile);
    const [liveLeaderboard, setLiveLeaderboard] = useState(leaderboard);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    // Settings state
    const [showSettings, setShowSettings] = useState(false);
    const [settingsTab, setSettingsTab] = useState('profile'); // 'profile', 'username', 'password'
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [tempProfilePhoto, setTempProfilePhoto] = useState(null); // Temporary storage for preview
    const [newUsername, setNewUsername] = useState('');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [settingsError, setSettingsError] = useState('');
    const [settingsSuccess, setSettingsSuccess] = useState('');

    // Define fetchUserProfile before useEffect
    const fetchUserProfile = useCallback(async () => {
        console.log('Fetching user profile...');
        setIsLoadingProfile(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('User from supabase:', !!user);
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('username, full_name, avatar_url, total_points, rank')
                    .eq('id', user.id)
                    .single();
                
                console.log('Profile fetched:', !!profile, 'Error:', error);
                if (profile && !error) {
                    setUserProfile(profile);
                    setIsLoggedIn(true); // Ensure isLoggedIn is true when profile is set
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoadingProfile(false);
        }
    }, []);

    // Fetch user profile and leaderboard on mount and set up real-time updates
    useEffect(() => {
        // Check for existing session immediately on mount
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user && !initialUserProfile) {
                setIsLoggedIn(true);
                await fetchUserProfile();
            }
        };
        
        // Only fetch if we don't have initial profile
        if (!initialUserProfile) {
            checkSession();
        }
        fetchLeaderboard();
        
        // Set up real-time listener for leaderboard changes
        const leaderboardSubscription = supabase
            .channel('leaderboard_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'profiles' },
                () => {
                    fetchLeaderboard();
                }
            )
            .subscribe();

        // Set up real-time listener for profile changes
        const profileSubscription = supabase
            .channel('profile_changes')
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    // Update profile if it's the current user's profile
                    if (payload.new.id === userProfile?.id) {
                        fetchUserProfile();
                    }
                }
            )
            .subscribe();

        // Auth state listener - faster response
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event, 'Session:', !!session);
            
            if (session?.user) {
                setIsLoggedIn(true);
                // Fetch profile immediately when user logs in
                await fetchUserProfile();
            } else {
                setIsLoggedIn(false);
                setUserProfile(null);
                setIsLoadingProfile(false);
            }
        });

        return () => {
            leaderboardSubscription.unsubscribe();
            profileSubscription.unsubscribe();
            authSubscription.unsubscribe();
        };
    }, [fetchUserProfile]);

    const fetchLeaderboard = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('username, full_name, total_points, avatar_url, id')
            .order('total_points', { ascending: false })
            .limit(10);
        
        if (data) {
            setLiveLeaderboard(data);
        }
    };

    const handleLogout = async () => {
        // Immediately clear UI state before logout
        setIsLoggedIn(false);
        setUserProfile(null);
        setIsLoadingProfile(false);
        
        // Then perform logout
        await supabase.auth.signOut();
        router.refresh();
    };

    // Use props data if available, otherwise fallback
    const derivedCurrentUser = isLoggedIn || userRank !== 'N/A' ? {
        username: "You", // Ideally passed from parent or context
        rank: userRank || 'N/A',
        photo: null
    } : null;

    // Derived state - check if user is logged in
    const isUserLoggedIn = useMemo(() => {
        return isLoggedIn || !!userProfile;
    }, [isLoggedIn, userProfile]);

    // We navigate to the full profile page for settings now, as it handles uniqueness checks etc better
    const handleOpenSettings = () => {
        router.push('/practice/profile');
    };

    const getUserInitials = (username) => {
        return username.charAt(0).toUpperCase();
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfilePhoto = () => {
        if (tempProfilePhoto) {
            setProfilePhoto(tempProfilePhoto);
            setCurrentUser({ ...currentUser, photo: tempProfilePhoto });
            setSettingsSuccess('Profile photo updated successfully!');
            setTimeout(() => setSettingsSuccess(''), 3000);
        }
    };

    const handleUsernameChange = () => {
        if (!newUsername.trim()) {
            setSettingsError('Username cannot be empty');
            return;
        }
        setCurrentUser({ ...currentUser, username: newUsername });
        setSettingsSuccess('Username updated successfully!');
        setNewUsername('');
        setTimeout(() => setSettingsSuccess(''), 3000);
    };

    const handlePasswordReset = () => {
        setSettingsError('');

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setSettingsError('All fields are required');
            return;
        }

        if (passwordForm.currentPassword !== currentUser.password) {
            setSettingsError('Current password is incorrect');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setSettingsError('New password must be at least 6 characters');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSettingsError('New passwords do not match');
            return;
        }

        setCurrentUser({ ...currentUser, password: passwordForm.newPassword });
        setSettingsSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSettingsSuccess(''), 3000);
    };

    return (
        <>
            {/* Two Container Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Left Container - User Profile & Stats */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl border border-green-500/20 p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />

                    {/* Top Right Corner Buttons */}
                    {(isLoggedIn || isUserLoggedIn) && (
                        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-red-500/30"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}

                    <div className="relative z-10">
                        {(isUserLoggedIn && userProfile && !isLoadingProfile) ? (
                            <>
                                {/* Profile Circle */}
                                <div className="flex flex-col items-center mb-8">
                                    <div 
                                        className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-2xl border-4 border-white/20 overflow-hidden cursor-pointer hover:scale-105 transition-transform" 
                                        onClick={() => router.push('/practice/profile')}
                                    >
                                        {userProfile?.avatar_url ? (
                                            <img 
                                                src={userProfile.avatar_url} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                                loading="eager"
                                                fetchPriority="high"
                                            />
                                        ) : (
                                            <User size={48} />
                                        )}
                                    </div>

                                    {/* Username */}
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {userProfile?.username || userProfile?.full_name || 'Welcome Back!'}
                                    </h3>

                                    {/* Rank */}
                                    <p className="text-gray-400 text-lg flex items-center gap-2 mb-1">
                                        Current Rank: <span className="text-yellow-400 font-bold text-2xl">#{userRank}</span>
                                    </p>

                                    {/* Score */}
                                    <p className="text-green-400 text-lg font-semibold">
                                        {userProfile?.total_points || 0} Points
                                    </p>
                                </div>

                                {/* Stats Boxes */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Total Questions */}
                                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center hover:border-green-500/50 transition-all duration-300">
                                        <Target className="mx-auto mb-2 text-blue-400" size={24} />
                                        <div className="text-2xl font-bold text-white mb-1">{totalProblems}</div>
                                        <div className="text-xs text-gray-400">Total</div>
                                    </div>

                                    {/* Solved Questions */}
                                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center hover:border-green-500/50 transition-all duration-300">
                                        <Trophy className="mx-auto mb-2 text-green-400" size={24} />
                                        <div className="text-2xl font-bold text-green-400 mb-1">{solvedCount}</div>
                                        <div className="text-xs text-gray-400">Solved</div>
                                    </div>

                                    {/* Progress */}
                                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center hover:border-green-500/50 transition-all duration-300">
                                        <TrendingUp className="mx-auto mb-2 text-purple-400" size={24} />
                                        <div className="text-2xl font-bold text-purple-400 mb-1">{progressPercentage}%</div>
                                        <div className="text-xs text-gray-400">Progress</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/practice/profile')}
                                    className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <User size={16} />
                                    View Full Profile
                                </button>
                            </>
                        ) : isLoadingProfile ? (
                            <div className="flex flex-col items-center justify-center h-full py-12">
                                <Loader2 className="text-green-500 mb-6 animate-spin" size={64} />
                                <h3 className="text-2xl font-bold text-white mb-4">Loading Profile...</h3>
                                <p className="text-gray-400 text-center mb-6 max-w-sm">
                                    Fetching your data
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12">
                                <User className="text-gray-500 mb-6" size={64} />
                                <h3 className="text-2xl font-bold text-white mb-4">Track Your Progress</h3>
                                <p className="text-gray-400 text-center mb-6 max-w-sm">
                                    Sign in to monitor your coding journey and compete on leaderboards
                                </p>
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
                                >
                                    <LogIn size={20} />
                                    Sign In / Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Container - Leaderboard */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl rounded-3xl border border-yellow-500/20 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    {/* Leaderboard Title */}
                    <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif', letterSpacing: '2px' }}>
                        LEADERBOARD
                    </h2>

                    {/* Top 3 Podium */}
                    <div className="flex items-end justify-center gap-6 mb-8">
                        {/* 2nd Place */}
                        {liveLeaderboard[1] && (
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-xl border-4 border-gray-400/30 overflow-hidden">
                                    {liveLeaderboard[1]?.avatar_url ? (
                                        <img src={liveLeaderboard[1].avatar_url} alt="2nd place" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                                    ) : (
                                        <User size={32} />
                                    )}
                                </div>
                                <div className="bg-gradient-to-b from-gray-400/30 to-gray-500/30 backdrop-blur-md border border-gray-400/40 rounded-t-xl px-4 py-6 text-center w-24">
                                    <div className="text-3xl mb-2">🥈</div>
                                    <div className="text-xs text-gray-300 font-medium truncate">
                                        {liveLeaderboard[1]?.full_name || liveLeaderboard[1]?.username || 'User'}
                                    </div>
                                    <div className="text-sm font-bold text-white mt-1">
                                        {liveLeaderboard[1]?.total_points || 0}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {liveLeaderboard[0] && (
                            <div className="flex flex-col items-center -mt-8">
                                <Crown className="text-yellow-400 mb-2 animate-bounce" size={28} />
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-2xl border-4 border-yellow-400/50 overflow-hidden">
                                    {liveLeaderboard[0]?.avatar_url ? (
                                        <img src={liveLeaderboard[0].avatar_url} alt="1st place" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                                    ) : (
                                        <User size={40} />
                                    )}
                                </div>
                                <div className="bg-gradient-to-b from-yellow-400/40 to-yellow-600/40 backdrop-blur-md border border-yellow-400/50 rounded-t-xl px-4 py-8 text-center w-28">
                                    <div className="text-4xl mb-2">🥇</div>
                                    <div className="text-xs text-yellow-100 font-bold truncate">
                                        {liveLeaderboard[0]?.full_name || liveLeaderboard[0]?.username || 'User'}
                                    </div>
                                    <div className="text-lg font-bold text-white mt-2">
                                        {liveLeaderboard[0]?.total_points || 0}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {liveLeaderboard[2] && (
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-xl border-4 border-amber-700/30 overflow-hidden">
                                    {liveLeaderboard[2]?.avatar_url ? (
                                        <img src={liveLeaderboard[2].avatar_url} alt="3rd place" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
                                    ) : (
                                        <User size={32} />
                                    )}
                                </div>
                                <div className="bg-gradient-to-b from-amber-600/30 to-amber-800/30 backdrop-blur-md border border-amber-700/40 rounded-t-xl px-4 py-6 text-center w-24">
                                    <div className="text-3xl mb-2">🥉</div>
                                    <div className="text-xs text-amber-100 font-medium truncate">
                                        {liveLeaderboard[2]?.full_name || liveLeaderboard[2]?.username || 'User'}
                                    </div>
                                    <div className="text-sm font-bold text-white mt-1">
                                        {liveLeaderboard[2]?.total_points || 0}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* See Full Leaderboard Button */}
                <div className="text-center">
                    <button
                        onClick={() => router.push('/leaderboard')}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
                    >
                        See Full Leaderboard
                    </button>
                </div>
            </div>
        </div>

            {/* Login Modal */}
            <UserLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />

{/* Settings Modal */}
            {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings className="text-green-400" size={24} />
                        Profile Settings
                    </h2>
                    <button
                        onClick={() => {
                            setShowSettings(false);
                            setSettingsError('');
                            setSettingsSuccess('');
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6">
                    <button
                        onClick={() => {
                            setSettingsTab('profile');
                            setSettingsError('');
                            setSettingsSuccess('');
                        }}
                        className={`px-4 py-3 font-medium transition-all ${settingsTab === 'profile'
                            ? 'text-green-400 border-b-2 border-green-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Profile Photo
                    </button>
                    <button
                        onClick={() => {
                            setSettingsTab('username');
                            setSettingsError('');
                            setSettingsSuccess('');
                        }}
                        className={`px-4 py-3 font-medium transition-all ${settingsTab === 'username'
                            ? 'text-green-400 border-b-2 border-green-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Username
                    </button>
                    <button
                        onClick={() => {
                            setSettingsTab('password');
                            setSettingsError('');
                            setSettingsSuccess('');
                        }}
                        className={`px-4 py-3 font-medium transition-all ${settingsTab === 'password'
                            ? 'text-green-400 border-b-2 border-green-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Reset Password
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Success/Error Messages */}
                    {settingsSuccess && (
                        <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm">
                            {settingsSuccess}
                        </div>
                    )}
                    {settingsError && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                            {settingsError}
                        </div>
                    )}

                    {/* Profile Photo Tab */}
                    {settingsTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-2xl border-4 border-white/20 overflow-hidden">
                                    {tempProfilePhoto ? (
                                        <img src={tempProfilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : currentUser.photo ? (
                                        <img src={currentUser.photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        getUserInitials(currentUser.username)
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePhotoChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all shadow-lg hover:scale-105">
                                            <Camera size={20} />
                                            Choose Photo
                                        </div>
                                    </label>
                                    {tempProfilePhoto && (
                                        <button
                                            onClick={handleSaveProfilePhoto}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                                {tempProfilePhoto && (
                                    <p className="text-gray-400 text-sm mt-2">Click "Save" to confirm your new profile photo</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Username Tab */}
                    {settingsTab === 'username' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Current Username</label>
                                <input
                                    type="text"
                                    value={currentUser.username}
                                    disabled
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">New Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
                                    placeholder="Enter new username"
                                />
                            </div>
                            <button
                                onClick={handleUsernameChange}
                                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg"
                            >
                                Update Username
                            </button>
                        </div>
                    )}

                    {/* Password Tab */}
                    {settingsTab === 'password' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                onClick={handlePasswordReset}
                                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg"
                            >
                                Reset Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
        </>
    );
}
