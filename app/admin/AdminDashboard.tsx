"use client";

import React, { useEffect, useRef } from 'react';
import {
    LayoutDashboard, Calendar, Users, Settings, HelpCircle, Shield,
    Search, Bell, ChevronDown, TrendingUp, TrendingDown,
    ArrowUpRight, UserCog, FileText, LucideIcon
} from 'lucide-react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { Sidebar } from './components/Sidebar';

// --- TYPES ---
interface DashboardItem {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    actionText: string;
    theme: 'purple' | 'emerald' | 'blue' | 'orange';
    link: string;
}

interface StatItem {
    id: string;
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
}

// --- DATA ---
const DASHBOARD_ITEMS: DashboardItem[] = [
    {
        id: 'events',
        title: 'Events Manager',
        description: 'Schedule, edit and oversee all club activities and workshops.',
        icon: Calendar,
        actionText: 'Manage Events',
        theme: 'purple',
        link: '/admin/events'
    },
    {
        id: 'recruitment',
        title: 'Recruitment Portal',
        description: 'Process applications, interview candidates, and manage flow.',
        icon: Users,
        actionText: 'View Applicants',
        theme: 'emerald',
        link: '/admin/recruitment'
    },
    {
        id: 'user-management',
        title: 'User Control',
        description: 'Manage permissions, roles, and view system access logs.',
        icon: UserCog,
        actionText: 'Configure Users',
        theme: 'blue',
        link: '/admin/users'
    },
    {
        id: 'event-registrations',
        title: 'Registrations',
        description: 'Track team signups, individual submissions and payments.',
        icon: FileText,
        actionText: 'Review Data',
        theme: 'orange',
        link: '/admin/registrations'
    },
];

const ADMIN_MAPPING: { [key: string]: string } = {
    'dk5389@srmist.edu.in': 'Darshil Kumar',
    'ayaanmirza788@gmail.com': 'Ayaan Mirza',
    'sahilrajdubey@gmail.com': 'Sahil Raj Dubey',
    'taryan54@gmail.com': 'Aryan Tiwari',
    'nidhip@srmist.edu.in': 'Ms. Nidhi Pandey',
    'bhartiv@srmist.edu.in': 'Ms. Bharti Vidhury',
    'sarawatadrika@gmail.com': 'Adrika Sarawat',
};

// --- COMPONENTS ---



const TopBar: React.FC<{ userEmail: string }> = ({ userEmail }) => {
    const displayName = ADMIN_MAPPING[userEmail] || userEmail.split('@')[0] || 'Admin';
    const displayInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <header className="header-anim flex items-center justify-between py-6 mb-8">
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

                <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-lg shadow-indigo-500/20">
                        {displayInitials}
                    </div>
                    <div className="hidden md:flex flex-col items-start min-w-[100px]">
                        <span className="text-xs font-semibold text-white leading-none mb-1 truncate w-full">
                            {displayName}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-none">Admin</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                </div>
            </div>
        </header>
    );
};

const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => {
    return (
        <div className="stat-card-anim group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121214] p-5 hover:border-white/10 transition-colors duration-300">
            <div className="relative z-10">
                <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border ${stat.trendUp
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stat.trend}
                    </div>
                </div>
            </div>

            {/* Hover Gradient */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
        </div>
    );
};

const DashboardCard: React.FC<{ item: DashboardItem; index: number }> = ({ item }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const themeConfig = {
        purple: {
            accent: 'bg-purple-500',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
            text: 'text-purple-400',
            gradient: 'from-purple-500/20 to-transparent',
            border: 'group-hover:border-purple-500/30'
        },
        emerald: {
            accent: 'bg-emerald-500',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
            text: 'text-emerald-400',
            gradient: 'from-emerald-500/20 to-transparent',
            border: 'group-hover:border-emerald-500/30'
        },
        blue: {
            accent: 'bg-blue-500',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
            text: 'text-blue-400',
            gradient: 'from-blue-500/20 to-transparent',
            border: 'group-hover:border-blue-500/30'
        },
        orange: {
            accent: 'bg-orange-500',
            glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]',
            text: 'text-orange-400',
            gradient: 'from-orange-500/20 to-transparent',
            border: 'group-hover:border-orange-500/30'
        },
    };

    const theme = themeConfig[item.theme];

    const handleMouseEnter = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, { y: -4, duration: 0.3, ease: 'power2.out' });
        const icon = cardRef.current.querySelector('.icon-container');
        if (icon) {
            gsap.to(icon, { scale: 1.1, rotate: 5, duration: 0.4, ease: 'back.out(1.7)' });
        }
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
        const icon = cardRef.current.querySelector('.icon-container');
        if (icon) {
            gsap.to(icon, { scale: 1, rotate: 0, duration: 0.4, ease: 'power2.out' });
        }
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
        dashboard-card-anim group relative flex flex-col justify-between overflow-hidden rounded-3xl 
        bg-[#121214] border border-white/5 p-7 cursor-pointer
        transition-colors duration-300 ${theme.border} ${theme.glow}
      `}
            onClick={() => router.push(item.link)}
        >
            <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${theme.gradient} blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className={`icon-container flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white shadow-inner`}>
                    <item.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 p-2 text-gray-500 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-5 w-5" />
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-400 transition-colors">
                    {item.description}
                </p>
                <span className={`text-xs font-bold tracking-wider uppercase ${theme.text}`}>
                    {item.actionText}
                </span>
            </div>

            <div className={`absolute bottom-0 left-0 h-1 w-0 ${theme.accent} transition-all duration-500 ease-out group-hover:w-full`} />
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <div className="footer-anim mt-12 w-full rounded-2xl border border-white/5 bg-[#121214]/50 py-6 text-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 text-white/20">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">GFG Secure System</span>
                </div>
                <p className="text-[10px] font-medium text-gray-600">
                    Authorized Access Only · {new Date().getFullYear()} GFG Student Chapter
                </p>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

interface AdminDashboardProps {
    userEmail: string;
    totalEvents: number;
    totalRecruitments: number;
    totalUsers: number;
    totalMembers: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, totalEvents, totalRecruitments, totalUsers, totalMembers }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { id: 's1', label: 'Total Events', value: totalEvents.toString(), trend: '+12%', trendUp: true },
        { id: 's2', label: 'Reference Users', value: totalUsers.toString(), trend: '+20%', trendUp: true },
        { id: 's3', label: 'Club Members', value: totalMembers.toString(), trend: '+5.2%', trendUp: true },
        { id: 's4', label: 'Registered Candidates', value: totalRecruitments.toString(), trend: '+5.2%', trendUp: true },
    ];

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', active: true, link: '/admin' },
        { icon: Calendar, label: 'Schedule', active: false, link: '/admin/events' },
        { icon: Users, label: 'Members', active: false, link: '/admin/members' },
        { icon: Settings, label: 'Settings', active: false, link: '/admin/settings' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.header-anim', { y: -20, opacity: 0, duration: 0.6, delay: 0.2 })
                .from('.stat-card-anim', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
                .from('.dashboard-card-anim', { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.3")
                .from('.footer-anim', { opacity: 0, duration: 0.5 }, "-=0.2");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-indigo-500/30 font-sans">

            <Sidebar />

            <main className="flex-1 h-screen overflow-y-auto relative no-scrollbar">
                {/* Added ml-64 to match sidebar width, plus extra padding effectively shifting content right */}
                <div ref={containerRef} className="mx-auto max-w-7xl px-8 py-8 md:px-12 md:py-10 lg:px-16 ml-0 md:ml-72">

                    <TopBar userEmail={userEmail} />

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {stats.map((stat) => (
                            <StatCard key={stat.id} stat={stat} />
                        ))}
                    </div>

                    <div className="mb-8 flex items-end justify-between">
                        <h3 className="text-lg font-semibold text-white tracking-tight">Quick Actions</h3>
                        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Customize Layout
                        </button>
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
                        {DASHBOARD_ITEMS.map((item, index) => (
                            <DashboardCard
                                key={item.id}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>

                    <Footer />

                    {/* Background Ambient Effects */}
                    <div className="fixed top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="fixed bottom-0 left-64 h-[400px] w-[400px] rounded-full bg-emerald-900/5 blur-[100px] pointer-events-none mix-blend-screen" />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
