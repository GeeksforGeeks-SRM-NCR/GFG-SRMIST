'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadAvatar } from './actions';
import { User, Mail, Award, Clock, Code, Camera, Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
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
        <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none fixed" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8 border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                        My Profile
                    </h1>
                    <p className="text-white/40 mt-2">Manage your identity and view your progress</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Quick Stats */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Avatar Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-green-500/30 mb-4">
                                <img
                                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || 'User'}&background=random`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <label className="cursor-pointer flex flex-col items-center text-xs text-white/80">
                                        <Camera className="w-6 h-6 mb-1" />
                                        <span>Change</span>
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
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-xl font-bold">{profile.full_name || 'Anonymous Coder'}</h2>
                            <p className="text-sm text-white/40 mb-4">{profile.college_email}</p>

                            <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-mono border border-green-500/20">
                                {profile.rank || 'Beginner'}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h3 className="font-semibold text-white/60 text-sm uppercase tracking-wider">Statistics</h3>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-white/60">Total Points</span>
                                </div>
                                <span className="text-lg font-bold">{profile.total_points}</span>
                            </div>

                            {/* Add more stats if available */}
                        </div>
                    </div>

                    {/* Right Column: Edit Details */}
                    <div className="md:col-span-2">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-green-400" />
                                Edit Details
                            </h3>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60 block">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-green-500/50 transition-colors"
                                            placeholder="John Doe"
                                        />
                                        <User className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/60 block">Username (Unique)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-green-500/50 transition-colors"
                                            placeholder="coding_wizard"
                                        />
                                        <Code className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="text-xs text-white/20">Used for leaderboard display.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/60 block">College Email</label>
                                    <div className="relative opacity-50 cursor-not-allowed">
                                        <input
                                            type="email"
                                            value={profile.college_email}
                                            readOnly
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-10"
                                        />
                                        <Mail className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {message.text && (
                                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
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
