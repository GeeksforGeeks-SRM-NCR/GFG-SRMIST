"use client";
import { Logo } from "../logo/logo";
import Link from "next/link";
import { useState, useEffect } from "react";
import DecryptedText from "./DecryptedText";
import { FiMenu, FiX, FiArrowLeft } from "react-icons/fi";
import { LogIn, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GlassyNavbar() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const navItems = [
        { label: 'About', href: '/pages/about' },
        { label: 'Events', href: '/pages/events' },
        { label: 'Team', href: '/pages/team' },
        { label: 'Challenges', href: '/pages/challenges' }
    ];

    const isHomePage = pathname === '/';

    return (
        <>
            <nav className="fixed top-[30px] left-1/2 -translate-x-1/2 w-[85%] max-w-[1100px] h-[70px] bg-white/8 backdrop-blur-[30px] saturate-[180%] border border-white/15 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_0_20px_rgba(255,255,255,0.02)] flex items-center justify-between px-6 md:px-10 z-[1000]">
                {/* Left side - Logo */}
                <div className="flex items-center flex-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    <Logo />
                </div>

                {/* Center - Navigation Links (Desktop) */}
                <div className="hidden md:flex gap-3 items-center justify-center flex-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`
                                font-sf-pro flex items-center justify-center px-7 py-2.5 text-lg font-medium text-white no-underline rounded-[30px] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                                ${hoveredIndex === index || pathname === item.href
                                    ? 'bg-[#2f8d46] border border-[#2f8d46] scale-105 shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[10px]'
                                    : 'bg-transparent border border-transparent scale-100 shadow-none'}
                            `}
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                        >
                            <DecryptedText
                                text={item.label}
                                animate={hoveredIndex === index}
                                animateOn="hover"
                                revealDirection="center"
                                speed={40}
                                maxIterations={15}
                                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
                                className="revealed font-sf-pro"
                                parentClassName="all-letters"
                                encryptedClassName="encrypted"
                            />
                        </Link>
                    ))}
                </div>

                {/* Right side - Login/Logout & Go Back */}
                <div className="hidden md:flex flex-none w-[150px] justify-end items-center gap-3">
                    {isHomePage && (
                        user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30"
                                title="Login"
                            >
                                <LogIn size={18} />
                            </Link>
                        )
                    )}

                    {!isHomePage && (
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30"
                        >
                            <FiArrowLeft />
                            <span>Home</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    {isHomePage && (
                        user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10"
                            >
                                <LogOut size={18} />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10"
                            >
                                <LogIn size={18} />
                            </Link>
                        )
                    )}

                    {!isHomePage && (
                        <Link
                            href="/"
                            className="flex items-center justify-center w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10"
                        >
                            <FiArrowLeft size={20} />
                        </Link>
                    )}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2 focus:outline-none"
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center md:hidden">
                    <div className="flex flex-col gap-6 items-center">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-sf-pro text-2xl font-medium text-white hover:text-[#2f8d46] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
