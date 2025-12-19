"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
    Code2,
    Trophy,
    Users,
    Target,
    Rocket,
    BookOpen,
    Award,
    Zap,
    ArrowRight,
    Plus,
    Minus
} from "lucide-react";
import GlassyNavbar from "../../components/GlassyNavbar";
import Squares from "../../components/Squares";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react";

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let startTime;
        const targetValue = parseInt(value);
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * targetValue));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, value, duration]);

    return <span ref={ref}>{count}+</span>;
}

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
            {/* Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
                <GlassyNavbar />

                {/* Hero Section */}
                <motion.section style={{ y }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        padding: "40px 20px",
                        paddingTop: "140px",
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ textAlign: "center", marginBottom: "50px", maxWidth: "1200px" }}
                        >
                            <div style={{
                                display: "inline-block",
                                padding: "8px 20px",
                                background: "rgba(70, 185, 78, 0.1)",
                                border: "1px solid rgba(70, 185, 78, 0.3)",
                                borderRadius: "50px",
                                marginBottom: "30px",
                            }}>
                                <span style={{
                                    fontSize: "0.9rem",
                                    color: "#46b94e",
                                    fontWeight: "600",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                }}>
                                    Campus Body
                                </span>
                            </div>

                            <h1 className="font-sf-pro" style={{
                                fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
                                fontWeight: "800",
                                color: "#fff",
                                marginBottom: "25px",
                                letterSpacing: "-3px",
                                lineHeight: "1.1",
                            }}>
                                ABOUT <span style={{ color: "#46b94e" }}>US</span>
                            </h1>

                            <h2 className="font-sf-pro" style={{
                                fontSize: "clamp(1.3rem, 3vw, 2rem)",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontWeight: "400",
                                marginBottom: "20px",
                                letterSpacing: "0.5px",
                            }}>
                                GeeksForGeeks • Campus Body SRMIST NCR
                            </h2>

                            <div style={{
                                width: "80px",
                                height: "3px",
                                background: "#46b94e",
                                margin: "0 auto",
                            }} />
                        </motion.div>

                        {/* Description Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            style={{
                                maxWidth: "1000px",
                                width: "100%",
                                padding: "clamp(40px, 6vw, 60px)",
                                background: "rgba(255, 255, 255, 0.03)",
                                borderRadius: "24px",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                backdropFilter: "blur(20px)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "1px",
                                background: "linear-gradient(90deg, transparent, rgba(70, 185, 78, 0.5), transparent)",
                            }} />

                            <p className="font-sf-pro" style={{
                                fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                                lineHeight: "2",
                                color: "rgba(255, 255, 255, 0.85)",
                                textAlign: "center",
                            }}>
                                Hey there,
                                <br /><br />
                                Want to outshine in your career? or desire to give shape to your ideas?
                                If yes, then you are on the right page. Achieve your dreams with GeeksforGeeks
                                and upgrade your skillsets consistently to become more confident.
                                <br /><br />
                                GeeksforGeeks Campus Body at SRM NCR is working on the idea to impart
                                knowledge among the geeks in a fun and exciting way. It will be achieved through
                                events, hackathons and webinars to enlighten the mates.
                                <br /><br />
                                We aim for the perfection and success of all who are connected with us through
                                this chapter. So keep yourself connected with us to ace your career beyond the skies.
                                <br /><br />
                                Wishing you luck!!
                            </p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Our Purpose Section */}
                <section style={{ padding: "100px 40px" }}>
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: "center", marginBottom: "80px" }}
                        >
                            <div style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "50px",
                                marginBottom: "20px",
                            }}>
                                <span style={{
                                    fontSize: "0.85rem",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    fontWeight: "500",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                }}>
                                    Our Foundation
                                </span>
                            </div>

                            <h2 className="font-sf-pro" style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: "700",
                                color: "#fff",
                                marginBottom: "15px",
                                letterSpacing: "-1px",
                            }}>
                                Purpose & <span style={{ color: "#46b94e" }}>Vision</span>
                            </h2>

                            <p style={{
                                fontSize: "1.1rem",
                                color: "rgba(255, 255, 255, 0.5)",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}>
                                Driving innovation through education and collaboration
                            </p>
                        </motion.div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                            gap: "40px",
                        }}>
                            <PurposeCard
                                icon={Target}
                                title="Our Mission"
                                description="To empower students with industry-relevant skills, foster innovation, and build a strong community of tech enthusiasts who can solve real-world problems through coding and collaborative learning."
                                number="01"
                            />
                            <PurposeCard
                                icon={Rocket}
                                title="Our Vision"
                                description="To be the leading technical community that bridges the gap between academic learning and industry requirements, creating future-ready professionals who can contribute meaningfully to the tech ecosystem."
                                number="02"
                            />
                        </div>
                    </div>
                </section>

                {/* What We Do Section */}
                <section style={{ padding: "50px 40px", background: "rgba(0, 0, 0, 0.2)" }}>
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: "center", marginBottom: "80px" }}
                        >
                            <div style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "50px",
                                marginBottom: "20px",
                            }}>
                                <span style={{
                                    fontSize: "0.85rem",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    fontWeight: "500",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                }}>
                                    Our Activities
                                </span>
                            </div>

                            <h2 className="font-sf-pro" style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: "700",
                                color: "#fff",
                                marginBottom: "15px",
                                letterSpacing: "-1px",
                            }}>
                                What We <span style={{ color: "#46b94e" }}>Do</span>
                            </h2>

                            <p style={{
                                fontSize: "1.1rem",
                                color: "rgba(255, 255, 255, 0.5)",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}>
                                Comprehensive programs designed for your growth
                            </p>
                        </motion.div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                            gap: "30px",
                        }}>
                            {[
                                {
                                    icon: Code2,
                                    title: "Coding Workshops",
                                    description: "Regular hands-on workshops on latest technologies, frameworks, and programming languages.",
                                },
                                {
                                    icon: Trophy,
                                    title: "Competitive Programming",
                                    description: "Organize coding contests and hackathons to sharpen problem-solving skills.",
                                },
                                {
                                    icon: Users,
                                    title: "Peer Learning",
                                    description: "Foster a collaborative environment where students learn from each other.",
                                },
                                {
                                    icon: BookOpen,
                                    title: "Technical Webinars",
                                    description: "Expert-led sessions featuring industry leaders sharing insights on cutting-edge technologies.",
                                },
                                {
                                    icon: Zap,
                                    title: "Innovation Labs",
                                    description: "Practical project-based learning experiences tackling real-world challenges.",
                                },
                                {
                                    icon: Award,
                                    title: "Skill Certification",
                                    description: "Recognized certifications validating your achievements and expertise.",
                                },
                            ].map((item, index) => (
                                <ActivityCard key={index} {...item} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section style={{ padding: "50px 40px" }}>
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: "center", marginBottom: "80px" }}
                        >
                            <div style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "50px",
                                marginBottom: "20px",
                            }}>
                                <span style={{
                                    fontSize: "0.85rem",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    fontWeight: "500",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                }}>
                                    By The Numbers
                                </span>
                            </div>

                            <h2 className="font-sf-pro" style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: "700",
                                color: "#fff",
                                marginBottom: "15px",
                                letterSpacing: "-1px",
                            }}>
                                Our <span style={{ color: "#46b94e" }}>Impact</span>
                            </h2>
                        </motion.div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "30px",
                        }}>
                            {[
                                { number: "500", label: "Active Members", icon: Users },
                                { number: "50", label: "Events Conducted", icon: Trophy },
                                { number: "100", label: "Workshops", icon: BookOpen },
                                { number: "20", label: "Hackathons", icon: Code2 },
                            ].map((stat, index) => (
                                <StatCard key={index} {...stat} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Alumni Milestone Section */}
                <section style={{ padding: "100px 40px", overflow: "hidden" }}>
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: "center", marginBottom: "60px" }}
                        >
                            <div style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "50px",
                                marginBottom: "20px",
                            }}>
                                <span style={{
                                    fontSize: "0.85rem",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    fontWeight: "500",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                }}>
                                    Our Success
                                </span>
                            </div>

                            <h2 className="font-sf-pro" style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: "700",
                                color: "#fff",
                                marginBottom: "15px",
                                letterSpacing: "-1px",
                            }}>
                                Alumni <span style={{ color: "#46b94e" }}>Milestone</span>
                            </h2>

                            <p style={{
                                fontSize: "1.1rem",
                                color: "rgba(255, 255, 255, 0.5)",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}>
                                Our alumni are thriving at top companies worldwide
                            </p>
                        </motion.div>

                        <LogoSlider />
                    </div>
                </section>

                {/* FAQ Section */}
                <section style={{ padding: "100px 40px", background: "rgba(0, 0, 0, 0.2)" }}>
                    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: "center", marginBottom: "60px" }}
                        >
                            <div style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "50px",
                                marginBottom: "20px",
                            }}>
                                <span style={{
                                    fontSize: "0.85rem",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    fontWeight: "500",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                }}>
                                    Got Questions?
                                </span>
                            </div>

                            <h2 className="font-sf-pro" style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: "700",
                                color: "#fff",
                                marginBottom: "15px",
                                letterSpacing: "-1px",
                            }}>
                                Frequently Asked <span style={{ color: "#46b94e" }}>Questions</span>
                            </h2>

                            <p style={{
                                fontSize: "1.1rem",
                                color: "rgba(255, 255, 255, 0.5)",
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}>
                                Everything you need to know about GeeksforGeeks Campus Body
                            </p>
                        </motion.div>

                        <FAQAccordion />
                    </div>
                </section>

                {/* Join Us Section */}
                <section style={{ padding: "100px 40px 140px" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            maxWidth: "1000px",
                            margin: "0 auto",
                            padding: "clamp(50px, 7vw, 80px)",
                            background: "rgba(255, 255, 255, 0.03)",
                            borderRadius: "24px",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            backdropFilter: "blur(20px)",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "1px",
                            background: "linear-gradient(90deg, transparent, rgba(70, 185, 78, 0.5), transparent)",
                        }} />

                        <div style={{
                            display: "inline-block",
                            padding: "6px 16px",
                            background: "rgba(70, 185, 78, 0.1)",
                            border: "1px solid rgba(70, 185, 78, 0.3)",
                            borderRadius: "50px",
                            marginBottom: "30px",
                        }}>
                            <span style={{
                                fontSize: "0.85rem",
                                color: "#46b94e",
                                fontWeight: "500",
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                            }}>
                                Get Started
                            </span>
                        </div>

                        <h2 className="font-sf-pro" style={{
                            fontSize: "clamp(2.5rem, 6vw, 4rem)",
                            fontWeight: "700",
                            marginBottom: "25px",
                            color: "#fff",
                            letterSpacing: "-1px",
                        }}>
                            Join Our Community
                        </h2>

                        <p className="font-sf-pro" style={{
                            fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                            lineHeight: "1.8",
                            marginBottom: "45px",
                            color: "rgba(255, 255, 255, 0.7)",
                            maxWidth: "700px",
                            margin: "0 auto 45px",
                        }}>
                            Be part of a vibrant community where innovation meets collaboration.
                            Whether you're a beginner or an expert, there's a place for you here.
                            Join us to learn, grow, and build amazing things together!
                        </p>

                        <Link href="/pages/recruitment">
                            <motion.button
                                className="font-sf-pro"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    padding: "18px 50px",
                                    fontSize: "1.1rem",
                                    fontWeight: "600",
                                    color: "white",
                                    background: "#46b94e",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                Register Now
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </motion.div>
                </section>

                {/* Copyright Footer */}
                <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs px-4">
                    <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

// Purpose Card Component
function PurposeCard({ icon: Icon, title, description, number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -8 }}
            style={{
                padding: "50px 40px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                fontSize: "5rem",
                fontWeight: "900",
                color: "rgba(255, 255, 255, 0.02)",
                lineHeight: "1",
            }}>
                {number}
            </div>

            <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "rgba(70, 185, 78, 0.1)",
                border: "1px solid rgba(70, 185, 78, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "30px",
            }}>
                <Icon size={28} color="#46b94e" />
            </div>

            <h3 className="font-sf-pro" style={{
                fontSize: "1.8rem",
                color: "#fff",
                fontWeight: "700",
                marginBottom: "20px",
                letterSpacing: "-0.5px",
            }}>
                {title}
            </h3>

            <p className="font-sf-pro" style={{
                fontSize: "1.05rem",
                lineHeight: "1.8",
                color: "rgba(255, 255, 255, 0.6)",
            }}>
                {description}
            </p>

            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "2px",
                background: "linear-gradient(90deg, #46b94e, transparent)",
            }} />
        </motion.div>
    );
}

// Activity Card Component
function ActivityCard({ icon: Icon, title, description, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            style={{
                padding: "40px 30px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "rgba(70, 185, 78, 0.1)",
                border: "1px solid rgba(70, 185, 78, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "25px",
            }}>
                <Icon size={24} color="#46b94e" />
            </div>

            <h4 className="font-sf-pro" style={{
                fontSize: "1.4rem",
                marginBottom: "15px",
                color: "white",
                fontWeight: "600",
                letterSpacing: "-0.3px",
            }}>
                {title}
            </h4>

            <p className="font-sf-pro" style={{
                fontSize: "1rem",
                lineHeight: "1.7",
                color: "rgba(255, 255, 255, 0.6)",
            }}>
                {description}
            </p>
        </motion.div>
    );
}

// Stat Card Component
function StatCard({ number, label, icon: Icon, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            style={{
                padding: "35px 25px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "rgba(70, 185, 78, 0.1)",
                border: "1px solid rgba(70, 185, 78, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
            }}>
                <Icon size={22} color="#46b94e" />
            </div>

            <div className="font-sf-pro" style={{
                fontSize: "3rem",
                color: "#46b94e",
                marginBottom: "12px",
                fontWeight: "800",
                letterSpacing: "-2px",
            }}>
                <AnimatedCounter value={number} />
            </div>

            <div className="font-sf-pro" style={{
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: "500",
            }}>
                {label}
            </div>

            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, transparent, #46b94e, transparent)",
            }} />
        </motion.div>
    );
}

// Logo Slider Component
function LogoSlider() {
    const logos = [
        { name: "Infosys", src: "/infosys.png", width: "250px" },
        { name: "Dell", src: "/dell.png", width: "250px" },
        { name: "EY", src: "/ey.png", width: "110px" },
        { name: "Boeing", src: "/boeing.png", width: "250px" },
        { name: "BF", src: "/bf.png", width: "250px" },
    ];

    // Calculate exact width for one set of logos
    const gapSize = 100;
    const singleSetWidth = logos.reduce((acc, logo) => {
        return acc + parseInt(logo.width) + gapSize;
    }, 0);

    return (
        <div style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            padding: "5px 0",
        }}>
            <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "150px",
                background: "linear-gradient(to right, rgba(0, 0, 0, 1), transparent)",
                zIndex: 2,
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "150px",
                background: "linear-gradient(to left, rgba(0, 0, 0, 1), transparent)",
                zIndex: 2,
                pointerEvents: "none",
            }} />

            <motion.div
                animate={{
                    x: [0, -singleSetWidth],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 25,
                        ease: "linear",
                    },
                }}
                style={{
                    display: "flex",
                    gap: `${gapSize}px`,
                    width: "max-content",
                    alignItems: "center",
                }}
            >
                {[...logos, ...logos, ...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                    <div
                        key={index}
                        style={{
                            width: logo.width,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={logo.src}
                            alt={logo.name}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "contain",
                                transition: "transform 0.3s ease",
                                display: "block",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// FAQ Accordion Component
function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is GeeksforGeeks campus body?",
            answer: "GeeksforGeeks Campus Body is a student-led initiative that brings the power of GeeksforGeeks to your campus. It's a community of passionate coders and tech enthusiasts who organize workshops, coding competitions, and technical events to enhance students' programming skills and prepare them for successful careers in technology."
        },
        {
            question: "How will GeeksforGeeks campus body help students?",
            answer: "The campus body helps students by providing access to quality technical education, organizing regular coding contests, conducting workshops on trending technologies, offering mentorship from industry experts, creating networking opportunities with peers and professionals, and providing a platform to showcase their skills through various technical events and competitions."
        },
        {
            question: "What perks will me and my team get from GFG?",
            answer: "You and your team will receive exclusive benefits including GeeksforGeeks merchandise, certificates of recognition, priority access to GFG resources and courses, opportunities to write articles for GeeksforGeeks platform, direct interaction with GFG team members, organizing rights for official GFG events on campus, and potential internship opportunities."
        },
        {
            question: "What benefits as a GeeksforGeeks campus body lead?",
            answer: "As a campus body lead, you'll gain invaluable leadership experience, enhance your organizational and management skills, build a strong professional network, receive special recognition from GeeksforGeeks, get featured on official GFG channels, access exclusive resources and support from the GFG team, and stand out in your career with this prestigious position on your resume."
        },
        {
            question: "Can I collaborate with other clubs?",
            answer: "Absolutely! We encourage collaboration with other technical and non-technical clubs on campus. This creates more opportunities for students, brings diverse perspectives to events, helps in organizing larger and more impactful events, and fosters a stronger overall community culture on campus. Cross-club collaboration is one of our core values."
        },
        {
            question: "How is it beneficial for my college?",
            answer: "The campus body brings numerous benefits to your college including enhanced technical culture, improved placement records through better-prepared students, increased visibility and reputation in the tech community, opportunities for students to participate in national-level competitions, stronger industry connections, and creation of a vibrant coding ecosystem that attracts prospective students and recruiters."
        }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {faqs.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    index={index}
                />
            ))}
        </div>
    );
}

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onClick, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                overflow: "hidden",
            }}
        >
            <button
                onClick={onClick}
                style={{
                    width: "100%",
                    padding: "25px 30px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                }}
            >
                <h3 className="font-sf-pro" style={{
                    fontSize: "1.2rem",
                    color: "#fff",
                    fontWeight: "600",
                    margin: 0,
                    paddingRight: "20px",
                }}>
                    {question}
                </h3>
                
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        minWidth: "40px",
                        minHeight: "40px",
                        borderRadius: "10px",
                        background: isOpen ? "rgba(70, 185, 78, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${isOpen ? "rgba(70, 185, 78, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                    }}
                >
                    <Plus size={20} color={isOpen ? "#46b94e" : "rgba(255, 255, 255, 0.6)"} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{
                            padding: "0 30px 25px 30px",
                            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        }}>
                            <p className="font-sf-pro" style={{
                                fontSize: "1.05rem",
                                lineHeight: "1.8",
                                color: "rgba(255, 255, 255, 0.7)",
                                margin: "20px 0 0 0",
                            }}>
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}