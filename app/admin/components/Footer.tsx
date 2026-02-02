import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
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