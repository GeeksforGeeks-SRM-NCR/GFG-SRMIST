"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const Header: React.FC<{ userEmail: string }> = ({ userEmail }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    // const supabase = createClient(); // Removed as we import the instance directly

    // --- Configuration: User Mapping ---
    // Add more IDs here as needed
    const USER_ID_MAP: Record<string, string> = {
        "dk5389@srmist.edu.in": "Darshil Kumar",
        'ayaanmirza788@gmail.com': 'Ayaan Mirza',
        'sahilrajdubey@gmail.com': 'Sahil Raj Dubey',
        'taryan54@gmail.com': 'Aryan Tiwari',
        'nidhip@srmist.edu.in': 'Ms. Nidhi Pandey',
        'bhartiv@srmist.edu.in': 'Ms. Bharti Vidhury',
        'sarawatadrika@gmail.com': 'Adrika Sarawat',
    };

    const DEFAULT_NAME = "Admin User";

    // --- Helpers ---
    const getUserName = (email: string): string => {
        if (!email) return DEFAULT_NAME;
        const normalizedEmail = email.toLowerCase().trim();
        return USER_ID_MAP[normalizedEmail] || email.split('@')[0]; // Fallback to email prefix
    };

    const getInitials = (name: string): string => {
        const parts = name.split(' ').filter(part => part.length > 0);
        if (parts.length === 0) return "AD"; // Admin Default
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const displayName = getUserName(userEmail);
    const initials = getInitials(displayName);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header-anim flex items-center justify-between py-6 mb-8 relative z-50">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-sm text-gray-400">Welcome back, here's what's happening today.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center rounded-full border border-white/5 bg-[#121214] px-4 py-2 focus-within:border-white/20 transition-colors">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-600 w-48"
                    />
                </div>

                <button className="relative rounded-full border border-white/5 bg-[#121214] p-2.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-[#121214]"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 pl-4 border-l border-white/5 hover:opacity-80 transition-opacity"
                    >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-lg shadow-indigo-500/20">
                            {initials}
                        </div>
                        <div className="hidden md:flex flex-col items-start">
                            <span className="text-xs font-semibold text-white leading-none mb-1">{displayName}</span>
                            <span className="text-[10px] text-gray-500 leading-none">Admin</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-500 hidden md:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#121214] shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
                            <div className="px-4 py-3 border-b border-white/5 md:hidden">
                                <p className="text-sm font-medium text-white">{displayName}</p>
                                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                            </div>

                            <button
                                onClick={() => router.push('/')}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors border-b border-white/5"
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};