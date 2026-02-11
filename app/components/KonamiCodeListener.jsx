'use client';

import { useState, useEffect } from 'react';
import { Terminal, X } from 'lucide-react';
import { vibrateLightClick } from '@/lib/vibration';
import Link from 'next/link';

export default function KonamiCodeListener() {
    const [keys, setKeys] = useState([]);
    const [triggered, setTriggered] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A 
    const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        const handleKeyDown = (e) => {
            if (!isDesktop) return;

            setKeys((prevKeys) => {
                const newKeys = [...prevKeys, e.key.toLowerCase()];
                if (newKeys.length > konamiCode.length) {
                    newKeys.shift();
                }
                return newKeys;
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', checkDesktop);
        };
    }, [isDesktop]);

    useEffect(() => {
        if (JSON.stringify(keys) === JSON.stringify(konamiCode)) {
            setTriggered(true);
            vibrateLightClick();
        }
    }, [keys]);

    if (!triggered) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-[#0f1210] border border-[#2f8d46]/50 p-10 rounded-2xl shadow-[0_0_50px_rgba(47,141,70,0.3)] max-w-md w-full text-center">
                <button
                    onClick={() => setTriggered(false)}
                    className="absolute top-4 right-4 text-[#2f8d46]/50 hover:text-[#2f8d46] hover:rotate-90 transition-all"
                >
                    <X size={24} />
                </button>

                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#2f8d46]/10 flex items-center justify-center animate-pulse border border-[#2f8d46]/30">
                        <Terminal size={48} className="text-[#2f8d46]" />
                    </div>
                </div>

                <h2 className="text-2xl font-mono font-bold text-[#2f8d46] mb-2 tracking-wider">ADMIN MODE ENABLED</h2>
                <p className="text-[#2f8d46]/60 font-mono text-sm mb-8">Welcome, Geek. Admin console ready.</p>

                <Link
                    href="/login"
                    onClick={() => vibrateLightClick()}
                    className="group w-full bg-[#2f8d46]/10 border border-[#2f8d46]/50 text-[#2f8d46] font-mono tracking-widest py-4 rounded-xl hover:bg-[#2f8d46]/20 transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(47,141,70,0.2)] hover:shadow-[0_0_30px_rgba(47,141,70,0.4)]"
                >
                    <span className="group-hover:animate-pulse">ENTER_CONSOLE</span>
                </Link>
            </div>
        </div>
    );
}
