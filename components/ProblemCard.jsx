'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Code2, Award, Zap, Clock, TrendingUp } from 'lucide-react';

const ProblemCard = ({ problem, isSolved, index }) => {
    const { title, slug, difficulty, description } = problem.fields;

    // Safely extract text from description (could be Rich Text object or string)
    const getDescriptionText = (desc) => {
        if (!desc) return null;
        if (typeof desc === 'string') return desc;
        
        // If it's a Rich Text object from Contentful
        if (desc.content && Array.isArray(desc.content)) {
            const texts = [];
            const extractText = (node) => {
                if (node.nodeType === 'text') {
                    texts.push(node.value);
                } else if (node.content && Array.isArray(node.content)) {
                    node.content.forEach(extractText);
                }
            };
            desc.content.forEach(extractText);
            return texts.join(' ').trim();
        }
        
        return null;
    };

    const descriptionText = getDescriptionText(description);

    const difficultyConfig = {
        Easy: { 
            color: 'text-green-400', 
            bg: 'bg-green-500/10',
            border: 'border-green-500/30',
            glow: 'hover:shadow-green-500/20',
            gradient: 'from-green-500/10 via-green-500/5 to-transparent',
            accentColor: '#46b94e'
        },
        Medium: { 
            color: 'text-yellow-400', 
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            glow: 'hover:shadow-yellow-500/20',
            gradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
            accentColor: '#ffd93d'
        },
        Hard: { 
            color: 'text-red-400', 
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            glow: 'hover:shadow-red-500/20',
            gradient: 'from-red-500/10 via-red-500/5 to-transparent',
            accentColor: '#ff6b6b'
        },
    };

    const config = difficultyConfig[difficulty] || {
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        glow: 'hover:shadow-gray-500/20',
        gradient: 'from-gray-500/5 to-transparent',
        accentColor: '#9ca3af'
    };

    return (
        <Link href={`/practice/${slug}`}>
            <div className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.01] hover:border-white/30 ${config.glow} hover:shadow-2xl cursor-pointer`}>
                {/* Problem Number Badge */}
                <div className="absolute top-5 left-5 z-10">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-sm font-bold text-white/60">#{index + 1}</span>
                    </div>
                </div>

                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                {/* Left Accent Bar */}
                <div 
                    className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ backgroundColor: config.accentColor }}
                />
                
                {/* Solved Badge Overlay */}
                {isSolved && (
                    <div className="absolute top-5 right-5 z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 blur-lg opacity-40 animate-pulse" />
                            <div className="relative p-2.5 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-500/40">
                                <Check size={18} className="text-green-400" strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 pl-14">
                        <div className="flex-1 pr-12">
                            {/* Difficulty Badge */}
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${config.border} ${config.bg} ${config.color} mb-3 shadow-sm`}>
                                <Zap size={12} className="mr-1.5" />
                                {difficulty}
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-gray-200 group-hover:to-white transition-all duration-300 leading-tight mb-3">
                                {title}
                            </h3>

                            {/* Description (if available) */}
                            {descriptionText && (
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 mb-4 line-clamp-2 leading-relaxed transition-colors">
                                    {descriptionText}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 pl-14">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Code2 size={14} />
                                <span className="font-medium">DSA Problem</span>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 group-hover:text-green-300 group-hover:gap-3 transition-all">
                            <span>Solve Now</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Animated Border Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 rounded-2xl border ${config.border} blur-sm`} />
                </div>

                {/* Top Right Corner Shine Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
        </Link>
    );
};

export default ProblemCard;
