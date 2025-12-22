"use client";
import { Logo } from "../logo/logo";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import DecryptedText from "./DecryptedText";
import { FiMenu, FiX, FiArrowLeft } from "react-icons/fi";
import { LogIn, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UserLoginModal from "../../components/UserLoginModal";


export default function GlassyNavbar() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLoginOptions, setShowLoginOptions] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);

    const pathname = usePathname();
    const router = useRouter();

    // Use refs to track animation states
    const animationStatesRef = useRef({});
    const hoverTimeoutRef = useRef(null);
    const lastHoverTimeRef = useRef({});

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        checkUser();

        // Handle click outside to close login dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLoginOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
            // Clean up timeouts
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    // Enhanced hover handler that ensures animations complete
    const handleMouseEnter = useCallback((index) => {
        const now = Date.now();
        lastHoverTimeRef.current[index] = now;

        // Clear any pending timeout for this index
        if (animationStatesRef.current[index]?.timeout) {
            clearTimeout(animationStatesRef.current[index].timeout);
        }

        // Set the state immediately
        setHoveredIndex(index);

        // Mark this index as needing encryption animation
        animationStatesRef.current[index] = {
            isAnimating: true,
            lastAction: 'enter',
            timestamp: now
        };
    }, []);

    const handleMouseLeave = useCallback((index) => {
        const now = Date.now();
        lastHoverTimeRef.current[index] = now;

        // Don't immediately change state, wait a bit to see if we're re-entering
        if (animationStatesRef.current[index]?.timeout) {
            clearTimeout(animationStatesRef.current[index].timeout);
        }

        // Set a timeout to reset the hover state
        animationStatesRef.current[index] = {
            ...animationStatesRef.current[index],
            timeout: setTimeout(() => {
                // Only reset if this is still the most recent action
                if (lastHoverTimeRef.current[index] <= now) {
                    setHoveredIndex(null);
                    animationStatesRef.current[index] = {
                        ...animationStatesRef.current[index],
                        lastAction: 'leave',
                        timestamp: now,
                        isAnimating: false
                    };
                }
            }, 200) // Wait 200ms to ensure animation can complete
        };
    }, []);

    // Modified DecryptedText wrapper component that ensures proper animation
    const NavItemText = useCallback(({ text, isHovered, index }) => {
        // Force a key change to reset animation when hover state changes
        const animationKey = `${index}-${isHovered ? 'hover' : 'normal'}`;

        return (
            <div className="inline-block font-sf-pro font-bold text-[18px] text-center">
                <DecryptedText
                    key={animationKey}
                    text={text}
                    animate={isHovered}
                    animateOn="hover"
                    revealDirection="center"
                    speed={50}
                    maxIterations={8}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
                    className="revealed font-sf-pro"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                    // Force monospace to prevent width changes
                    style={{
                        fontFamily: "'SF Pro Mono', 'Monaco', 'Consolas', monospace",
                        letterSpacing: '0.02em'
                    }}
                />
            </div>
        );
    }, []);

    const navItems = [
        { label: 'About', href: '/pages/about' },
        { label: 'Events', href: '/pages/events' },
        { label: 'Team', href: '/pages/team' },
        { label: 'Challenges', href: '/practice' }
    ];

    const isHomePage = pathname === '/';

    return (
        <>
            <nav className="fixed top-[30px] left-1/2 -translate-x-1/2 w-[85%] max-w-[1100px] h-[70px] bg-white/8 backdrop-blur-[30px] saturate-[180%] border border-white/15 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_0_20px_rgba(255,255,255,0.02)] flex items-center justify-between px-6 md:px-10 z-[1000]">
                {/* Left side - Clickable Logo that navigates to home */}
                <Link
                    href="/"
                    className="flex items-center flex-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:opacity-90 transition-opacity duration-200"
                    title="Go to Home"
                >
                    <Logo />
                </Link>

                {/* Center - Navigation Links (Desktop) - Show only above 1100px */}
                <div className="hidden custom-desktop:flex gap-3 items-center justify-center flex-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                            className={`
                                font-sf-pro flex items-center justify-center px-7 py-2.5 text-lg font-medium text-white no-underline rounded-[30px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                                min-w-[130px] justify-center
                                ${hoveredIndex === index || pathname === item.href
                                    ? 'bg-[#2f8d46] border border-[#2f8d46] scale-105 shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[10px]'
                                    : 'bg-transparent border border-transparent scale-100 shadow-none'}
                            `}
                            style={{
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                // Prevent width changes during animation
                                width: 'auto',
                                minWidth: '130px',
                                maxWidth: '130px'
                            }}
                        >
                            <NavItemText
                                text={item.label}
                                isHovered={hoveredIndex === index}
                                index={index}
                            />
                        </Link>
                    ))}
                </div>

                {/* Right side - Login/Logout & Go Back - Show only above 1100px */}
                <div className="hidden custom-desktop:flex flex-none justify-end items-center gap-3 min-w-[180px]">
                    {isHomePage && (
                        user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30 whitespace-nowrap"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowLoginOptions(!showLoginOptions)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30 whitespace-nowrap"
                                    title="Login"
                                >
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </button>

                                {/* Login Options Dropdown */}
                                {showLoginOptions && (
                                    <div className="absolute top-full right-0 mt-3 w-48 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[1001] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={() => {
                                                setShowLoginModal(true);
                                                setShowLoginOptions(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#2f8d46]/20 flex items-center justify-center text-[#2f8d46]">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            </div>
                                            <span>User Login</span>
                                        </button>
                                        <Link
                                            href="/login"
                                            onClick={() => setShowLoginOptions(false)}
                                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                            </div>
                                            <span>Admin Login</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )

                    )}

                    {/* Home/Team button - always show when not on homepage */}
                    {!isHomePage && (
                        <Link
                            href={pathname.includes('/pages/team/2025/') ? '/pages/team' : '/'}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30 whitespace-nowrap"
                        >
                            <FiArrowLeft />
                            <span>{pathname.includes('/pages/team/2025/') ? 'Team' : 'Home'}</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button - Show below 1100px */}
                <div className="custom-desktop:hidden flex items-center gap-4">
                    {isHomePage && (
                        user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoginOptions(!showLoginOptions)}
                                    className="flex items-center justify-center w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10"
                                    title="Login"
                                >
                                    <LogIn size={18} />
                                </button>

                                {showLoginOptions && (
                                    <div className="absolute top-full right-0 mt-3 w-40 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[1001]">
                                        <button
                                            onClick={() => {
                                                setShowLoginModal(true);
                                                setShowLoginOptions(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-xs text-white border-b border-white/5"
                                        >
                                            User Login
                                        </button>
                                        <Link
                                            href="/login"
                                            onClick={() => {
                                                setShowLoginOptions(false);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-xs text-white block"
                                        >
                                            Admin Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )

                    )}

                    {/* Home button on mobile - show when not on homepage */}
                    {!isHomePage && (
                        <Link
                            href="/"
                            className="flex items-center justify-center w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/10"
                            title="Go to Home"
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

            {/* Mobile Menu Overlay - Show below 1100px */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center custom-desktop:hidden">
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

            <UserLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>

    );
}