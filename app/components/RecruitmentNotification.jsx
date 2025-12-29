"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Megaphone, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecruitmentNotification({ isRecruitmentOpen }) {
    const [stage, setStage] = useState('hidden');

    useEffect(() => {
        if (isRecruitmentOpen) {
            const hasSeenIntro = sessionStorage.getItem('hasSeenRecruitmentIntro');

            if (hasSeenIntro) {
                setStage('collapsed');
            } else {
                setStage('intro');
                sessionStorage.setItem('hasSeenRecruitmentIntro', 'true');

                const timer = setTimeout(() => {
                    setStage('collapsed');
                }, 5000); // 5 seconds

                return () => clearTimeout(timer);
            }
        }
    }, [isRecruitmentOpen]);

    if (!isRecruitmentOpen || stage === 'hidden') return null;

    return (
        <AnimatePresence mode="wait">
            {stage === 'intro' && (
                <motion.div
                    key="intro-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-[15px] px-6"
                >
                    <motion.div
                        key="intro-card"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.3 } }}
                        className="relative w-full max-w-[420px] bg-white/10 backdrop-blur-[30px] saturate-[180%] border border-white/20 rounded-[24px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] text-center flex flex-col items-center"
                    >
                        <button
                            onClick={() => setStage('collapsed')}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                            title="Dismiss"
                        >
                            <X size={20} />
                        </button>
                        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Megaphone size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                            Recruitment is Live!
                        </h2>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-[90%]">
                            Join our team and be part of something great. We are looking for talented individuals to join our campus body.
                        </p>
                        <Link
                            href="/pages/recruitment"
                            className="w-full py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/15 transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            Register Now
                        </Link>
                    </motion.div>
                </motion.div>
            )}

            {(stage === 'collapsed' || stage === 'expanded') && (
                <motion.div
                    key="notification"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`fixed bottom-6 right-6 z-[3000] flex flex-col items-end transition-all duration-300 ${stage === 'expanded' ? 'w-[320px]' : 'w-auto'}`}
                >
                    {/* Expanded Content */}
                    <AnimatePresence>
                        {stage === 'expanded' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="bg-white/10 backdrop-blur-[30px] saturate-[180%] border border-white/15 rounded-2xl p-5 mb-3 shadow-2xl w-full"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <Megaphone size={18} className="text-white" />
                                        <h3 className="text-white font-bold text-lg">Hiring Now!</h3>
                                    </div>
                                    <button
                                        onClick={() => setStage('collapsed')}
                                        className="text-white/40 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <p className="text-white/60 text-sm mb-5 leading-relaxed">
                                    Recruitment forms are officially open. Join our team and be part of something great!
                                </p>
                                <Link
                                    href="/pages/recruitment"
                                    className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/15"
                                >
                                    Register Now
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Float Button (Collapsed) - Reverted to Original Green Theme */}
                    <button
                        onClick={() => setStage(stage === 'expanded' ? 'collapsed' : 'expanded')}
                        className={`flex items-center gap-3 px-4 py-3 bg-[#111] hover:bg-[#222] border border-[#46b94e]/50 rounded-full shadow-lg shadow-[#46b94e]/10 transition-all duration-300 group ${stage === 'expanded' ? 'bg-[#46b94e]/10 border-[#46b94e]' : ''}`}
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-[#46b94e] rounded-full opacity-20 group-hover:opacity-40 animate-pulse"></div>
                            <Megaphone size={20} className="text-[#46b94e] relative z-10" />
                        </div>

                        {stage !== 'expanded' && (
                            <span className="text-white font-medium text-sm whitespace-nowrap">
                                Recruitment Open!
                            </span>
                        )}

                        {stage === 'expanded' ? (
                            <ChevronDown size={16} className="text-white/50" />
                        ) : (
                            <ChevronUp size={16} className="text-white/50" />
                        )}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
