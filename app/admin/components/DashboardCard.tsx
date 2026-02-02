import React, { useRef } from 'react';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import gsap from 'gsap';

export interface DashboardItem {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    actionText: string;
    theme: 'purple' | 'emerald' | 'blue' | 'orange';
}

interface DashboardCardProps {
    item: DashboardItem;
    index: number;
    onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ item, index, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);

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
        if (cardRef.current) {
            gsap.to(cardRef.current, { y: -4, duration: 0.3, ease: 'power2.out' });
            const iconContainer = cardRef.current.querySelector('.icon-container');
            if (iconContainer) {
                gsap.to(iconContainer, { scale: 1.1, rotate: 5, duration: 0.4, ease: 'back.out(1.7)' });
            }
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
            const iconContainer = cardRef.current.querySelector('.icon-container');
            if (iconContainer) {
                gsap.to(iconContainer, { scale: 1, rotate: 0, duration: 0.4, ease: 'power2.out' });
            }
        }
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
        dashboard-card-anim group relative flex flex-col justify-between overflow-hidden rounded-3xl 
        bg-[#121214] border border-white/5 p-7 cursor-pointer
        transition-colors duration-300 ${theme.border} ${theme.glow}
      `}
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