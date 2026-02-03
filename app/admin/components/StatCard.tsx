import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatItem {
    id: string;
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
}

export const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => {
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