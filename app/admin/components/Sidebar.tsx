"use client";

import React, { useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, Settings, Shield } from 'lucide-react';
import gsap from 'gsap';
import { useRouter, usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        gsap.fromTo(sidebarRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );

        gsap.fromTo('.nav-item',
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.4, ease: 'power2.out' }
        );
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', link: '/admin' },
        { icon: Calendar, label: 'Schedule', link: '/admin/events' },
        { icon: Users, label: 'Members', link: '/admin/members' },
        { icon: Settings, label: 'Settings', link: '/admin/settings' },
    ];

    const isActive = (link: string) => {
        if (link === '/admin' && pathname === '/admin') return true;
        if (link !== '/admin' && pathname?.startsWith(link)) return true;
        return false;
    };

    return (
        <div ref={sidebarRef} className="hidden md:flex h-screen w-64 flex-col border-r border-white/5 bg-black/50 backdrop-blur-xl p-6 fixed left-0 top-0 z-50">
            <div className="flex items-center gap-3 px-2 mb-12">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 shadow-lg shadow-green-900/20">
                    <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white leading-none">GFG Admin</h1>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Portal</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item, idx) => {
                    const active = isActive(item.link);
                    return (
                        <button
                            key={idx}
                            onClick={() => router.push(item.link)}
                            className={`nav-item group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300
                            ${active
                                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`} />
                            {item.label}
                            {active && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            )}
                        </button>
                    )
                })}
            </nav>
        </div>
    );
};
