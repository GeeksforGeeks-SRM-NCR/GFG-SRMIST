'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Types ---
interface Registration {
    id: number;
    team_name: string;
    college: string;
    members_json: any;
}

// --- Mock Constants ---
const SUPER_ADMINS = ['admin@club.com', 'chairperson@club.com'];

export default function AdminPage() {
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<'guest' | 'lead' | 'admin'>('guest');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Team Lead State
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState('{}');

    // Admin State
    const [registrations, setRegistrations] = useState<Registration[]>([]);

    // --- Auth Handler ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoggedIn(true);
        if (SUPER_ADMINS.includes(email)) {
            setRole('admin');
            fetchRegistrations();
        } else {
            setRole('lead');
        }
    };

    // --- Team Lead Actions ---
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-mock-user-email': email,
                },
                body: JSON.stringify({
                    bio,
                    socialLinks: JSON.parse(socialLinks),
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update');
            setMessage('Profile updated successfully!');
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Admin Actions ---
    const fetchRegistrations = async () => {
        try {
            // Use the shared Supabase client
            const { supabase } = await import('@/lib/supabase');

            const { data, error } = await supabase
                .from('vuln-VANGUARD')
                .select('*');

            if (error) throw error;
            setRegistrations(data || []);
        } catch (err: any) {
            console.error('Supabase Error:', err);
            setMessage(`Failed to fetch registrations: ${err.message}`);
        }
    };

    const handleToggleRecruitment = async () => {
        setLoading(true);
        try {
            // We need to know the Entry ID of "GlobalSettings". 
            // For this demo, we'll assume a hardcoded ID or fetch it.
            // Let's assume 'global-settings-id'.
            const entryId = 'global-settings-id';

            // First, we might need to fetch current state to toggle, 
            // but for now let's just set it to 'true' or 'false' based on a prompt or toggle.
            // Let's just flip a boolean "recruitmentOpen".

            const res = await fetch('/api/admin/god-mode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-mock-user-email': email,
                },
                body: JSON.stringify({
                    action: 'update',
                    entryId: entryId,
                    data: {
                        recruitmentOpen: { 'en-US': true } // Simplified toggle logic
                    }
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to toggle');
            setMessage('Recruitment toggled (set to Open)!');
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Render ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-2 border rounded mb-4 text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {role === 'admin' ? 'Club Admin Dashboard' : 'My Profile'}
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">{email}</span>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="text-red-600 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {role === 'lead' && (
                <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Bio</label>
                            <textarea
                                className="w-full p-2 border rounded h-32 text-black"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write your bio..."
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Social Links (JSON)</label>
                            <textarea
                                className="w-full p-2 border rounded h-24 font-mono text-sm text-black"
                                value={socialLinks}
                                onChange={(e) => setSocialLinks(e.target.value)}
                                placeholder='{"twitter": "...", "linkedin": "..."}'
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {role === 'admin' && (
                <div className="space-y-8">
                    {/* Controls */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Global Controls</h2>
                        <button
                            onClick={handleToggleRecruitment}
                            disabled={loading}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                        >
                            Toggle Recruitment
                        </button>
                    </div>

                    {/* Registrations Table */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrations (vuln-VANGUARD)</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-100 text-gray-800 uppercase font-medium">
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Team Name</th>
                                        <th className="p-3">College</th>
                                        <th className="p-3">Members</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.length > 0 ? (
                                        registrations.map((reg) => (
                                            <tr key={reg.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{reg.id}</td>
                                                <td className="p-3 font-medium text-gray-900">{reg.team_name}</td>
                                                <td className="p-3">{reg.college}</td>
                                                <td className="p-3 font-mono text-xs">
                                                    {JSON.stringify(reg.members_json)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-3 text-center">No registrations found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
