'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile, uploadAvatar } from './actions';
import { User, Mail, Award, Clock, Code, Camera, Loader2, Save } from 'lucide-react';
import { vibrateLightClick } from '@/lib/vibration';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        fullName: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        const { data, error } = await getProfile();
        if (data) {
            setProfile(data);
            setFormData({
                username: data.username || '',
                fullName: data.full_name || ''
            });
        }
        setLoading(false);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const form = new FormData();
        form.append('username', formData.username);
        form.append('fullName', formData.fullName);

        const res = await updateProfile(form);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: res.success });
            loadProfile(); // Refresh data
        }
        setSaving(false);
    }

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append('avatar', file);

        const res = await uploadAvatar(form);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: 'Avatar updated!' });
            loadProfile();
        }
        setUploading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-green-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Profile not found or access denied.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="fixed inset-0 z-0">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
                
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 px-4 py-12 md:py-16">
                {/* Enhanced Header */}
                <div className="mb-12">
                    <div className="flex items-start gap-4 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="pt-1">
                            <h1 className="text-3xl md:text-4xl font-black text-white">
                                Profile Settings
                            </h1>
                            <p className="text-white/50 mt-2 text-sm md:text-base">Customize your identity and track your progress</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column: Avatar & Quick Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Enhanced Avatar Card */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <div className="flex flex-col items-center">
                                <div className="relative group mb-3">
                                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-green-500/50 shadow-2xl shadow-green-500/20 transition-all group-hover:border-green-400 group-hover:shadow-green-400/30">
                                        <img
                                            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || 'User'}&background=2f8d46&color=fff&size=200`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <label className="cursor-pointer flex flex-col items-center text-white">
                                            <Camera className="w-8 h-8 mb-2" />
                                            <span className="text-sm font-semibold">Change Photo</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/90 rounded-full flex items-center justify-center">
                                            <Loader2 className="w-10 h-10 animate-spin text-green-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Photo size note - moved right after circle */}
                                <p className="text-xs text-white/40 text-center mb-6 flex items-center justify-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Photo should be less than 1 MB
                                </p>

                                <h2 className="text-2xl font-bold mb-1 text-center">{profile.full_name || 'Anonymous Coder'}</h2>
                                <p className="text-sm text-white/50 mb-4 text-center break-all">{profile.college_email}</p>

                                <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-sm font-bold border border-green-500/30">
                                    {profile.rank || 'Beginner'}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stats Card */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                            <h3 className="font-bold text-white/80 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Award className="w-4 h-4 text-green-400" />
                                Your Statistics
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <Award className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <span className="text-sm text-white/70">Total Points</span>
                                    </div>
                                    <span className="text-xl font-black text-yellow-400">{profile.total_points}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <Code className="w-5 h-5 text-green-400" />
                                        </div>
                                        <span className="text-sm text-white/70">Rank</span>
                                    </div>
                                    <span className="text-xl font-black text-green-400">{profile.rank || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl h-full flex flex-col">
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <User className="w-6 h-6 text-green-400" />
                                </div>
                                Edit Your Details
                            </h3>

                            <form onSubmit={handleUpdate} className="space-y-6 flex-1 flex flex-col">
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                            <User className="w-4 h-4 text-green-400" />
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all text-white placeholder-white/30"
                                                placeholder="John Doe"
                                            />
                                            <User className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                            <Code className="w-4 h-4 text-green-400" />
                                            Username (Unique)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                                                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all text-white placeholder-white/30"
                                                placeholder="coding_wizard"
                                            />
                                            <Code className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-xs text-white/40 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            Used for leaderboard display
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-green-400" />
                                            College Email
                                        </label>
                                        <div className="relative opacity-60 cursor-not-allowed">
                                            <input
                                                type="email"
                                                value={profile.college_email}
                                                readOnly
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white/50"
                                            />
                                            <Mail className="w-5 h-5 text-white/20 absolute left-4 top-1/2 -translate-y-1/2" />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {message.text && (
                                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                                            {message.type === 'error' ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {message.text}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex gap-4 mt-auto">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        onClick={() => vibrateLightClick()}
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            vibrateLightClick();
                                            router.back();
                                        }}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
