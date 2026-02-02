"use client";

import React, { useEffect, useRef } from 'react';
import {
    LayoutDashboard, Calendar, Users, Settings, UserCog, FileText, LucideIcon,
    ArrowUpRight, TrendingUp, TrendingDown
} from 'lucide-react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

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

// --- COMPONENTS ---

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

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Removed header and footer animations since they are now in layout
            tl.from('.stat-card-anim', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.1 })
                .from('.dashboard-card-anim', { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.3");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full">
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
        </div>
    );
};

export default AdminDashboard;
