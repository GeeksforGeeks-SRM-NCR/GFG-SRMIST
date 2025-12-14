'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Lock } from 'lucide-react';

const ProblemCard = ({ problem, isSolved }) => {
    const { title, slug, difficulty, description } = problem.fields;

    const difficultyColor = {
        Easy: 'text-green-400 border-green-500/30 bg-green-500/10',
        Medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
        Hard: 'text-red-400 border-red-500/30 bg-red-500/10',
    }[difficulty] || 'text-gray-400';

    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/30 backdrop-blur-md p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyColor} mb-2`}>
                        {difficulty}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>
                {isSolved && (
                    <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                        <Check size={20} />
                    </div>
                )}
            </div>

            {/* Short description preview if needed, or just link */}

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    {/* Could add 'Submitted by X users' here */}
                </span>

                <Link
                    href={`/practice/${slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white group-hover:translate-x-1 transition-all"
                >
                    Solve Challenge <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default ProblemCard;
