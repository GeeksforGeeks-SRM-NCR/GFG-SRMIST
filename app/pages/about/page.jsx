"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Rocket, Lightbulb, Code2, Trophy, Users } from "lucide-react";
import GlassyNavbar from "../../components/GlassyNavbar";
import Squares from "../../components/Squares";
import { motion, useScroll, useTransform, useInView, useSpring } from "motion/react";

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

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value, duration]);

    return <span ref={ref}>{count}+</span>;
}

export default function HomePage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                }}
            >
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

                {/* Hero Section with Parallax */}
                <motion.div
                    style={{ y, opacity }}
                    className="hero-section"
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "100vh",
                            padding: "40px",
                            paddingTop: "120px",
                            color: "white",
                        }}
                    >
                        <motion.h1
                            className="font-sf-pro"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                fontSize: "clamp(3rem, 8vw, 5rem)",
                                marginBottom: "20px",
                                color: "#46b94e",
                                textAlign: "center",
                            }}
                        >
                            ABOUT US
                        </motion.h1>

                        <motion.h2
                            className="font-sf-pro"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            style={{
                                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                                marginBottom: "30px",
                                color: "#46b94e",
                                textAlign: "center",
                                padding: "0 20px",
                            }}
                        >
                            GeeksForGeeks SRMIST NCR Chapter
                        </motion.h2>

                        <motion.p
                            className="font-sf-pro"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            style={{
                                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                                textAlign: "center",
                                lineHeight: "1.8",
                                color: "rgba(255, 255, 255, 0.92)",
                                margin: 0,
                                padding: "clamp(20px, 5vw, 40px)",
                                background: "rgba(0, 0, 0, 0.6)",
                                borderRadius: "20px",
                                border: "1px solid rgba(70, 185, 78, 0.3)",
                                backdropFilter: "blur(10px)",
                                maxWidth: "900px",
                                width: "100%",
                            }}
                        >
                            Hey there,
                            <br /> Want to outshine in your career? or desire to give shape to
                            your ideas? if yes, then you are on the right page. Achieve your
                            dreams with geeksforgeeks and upgrade your skillsets consistently to
                            become more confident. Geeksforgeeks Students' chapter at SRM NCR is
                            working on the idea to impart knowledge among the geeks in a fun and
                            exciting way. It will be achieved through events, hackathons and
                            webinars to enlighten the mates. We aim for the perfection and
                            success of all who are connected with us through this chapter. So
                            keep yourself connected with us to ace your career beyond the skies.
                            Wishing you luck!!
                        </motion.p>
                    </div>


                </motion.div>



                {/* What We Do Section */}
                <section
                    style={{
                        padding: "80px 40px",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1200px",
                            margin: "0 auto",
                        }}
                    >
                        <motion.h2
                            className="font-sf-pro"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                textAlign: "center",
                                marginBottom: "60px",
                                color: "#46b94e",
                            }}
                        >
                            What We Do
                        </motion.h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "30px",
                            }}
                        >
                            {[
                                {
                                    icon: <Code2 size={40} />,
                                    title: "Coding Workshops",
                                    description:
                                        "Regular hands-on workshops on latest technologies, frameworks, and programming languages.",
                                },
                                {
                                    icon: <Trophy size={40} />,
                                    title: "Competitive Programming",
                                    description:
                                        "Organize coding contests and hackathons to sharpen problem-solving skills.",
                                },
                                {
                                    icon: <Users size={40} />,
                                    title: "Peer Learning",
                                    description:
                                        "Foster a collaborative environment where students learn from each other.",
                                },
                            ].map((item, index) => (
                                <ActivityCard key={index} {...item} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section
                    style={{
                        padding: "80px 40px",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1200px",
                            margin: "0 auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "40px",
                            textAlign: "center",
                        }}
                    >
                        {[
                            { number: "500", label: "Active Members" },
                            { number: "50", label: "Events Conducted" },
                            { number: "100", label: "Workshops" },
                            { number: "20", label: "Hackathons" },
                        ].map((stat, index) => (
                            <StatCard key={index} {...stat} index={index} />
                        ))}
                    </div>
                </section>

                {/* Join Us Section */}
                <section
                    style={{
                        padding: "80px 40px",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            maxWidth: "900px",
                            margin: "0 auto",
                            padding: "clamp(30px, 5vw, 50px)",
                            background: "rgba(0, 0, 0, 0.6)",
                            borderRadius: "20px",
                            border: "1px solid rgba(70, 185, 78, 0.3)",
                            backdropFilter: "blur(10px)",
                            textAlign: "center",
                        }}
                    >
                        <h2
                            className="font-sf-pro"
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3rem)",
                                marginBottom: "25px",
                                color: "#46b94e",
                            }}
                        >
                            Join Our Community
                        </h2>
                        <p
                            className="font-sf-pro"
                            style={{
                                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                                lineHeight: "1.8",
                                marginBottom: "35px",
                                color: "rgba(255, 255, 255, 0.92)",
                            }}
                        >
                            Be part of a vibrant community where innovation meets
                            collaboration. Whether you're a beginner or an expert, there's a
                            place for you here. Join us to learn, grow, and build amazing
                            things together!
                        </p>

                        <Link href="/pages/recruitment">
                            <motion.button
                                className="font-sf-pro"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 30px rgba(70, 185, 78, 0.5)",
                                    background: "rgba(70, 185, 78, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: "16px 45px",
                                    fontSize: "1.1rem",
                                    fontWeight: "600",
                                    color: "white",
                                    background: "rgba(70, 185, 78, 0.2)",
                                    border: "2px solid #46b94e",
                                    borderRadius: "30px",
                                    backdropFilter: "blur(10px)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Register Now
                            </motion.button>
                        </Link>
                    </motion.div>
                </section>

                {/* Add CSS animations */}
                <style>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }

          @keyframes scroll {
            0% {
              opacity: 0;
              transform: translateX(-50%) translateY(0);
            }
            40% {
              opacity: 1;
            }
            80% {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            100% {
              opacity: 0;
            }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(70, 185, 78, 0.3);
            }
            50% {
              box-shadow: 0 0 40px rgba(70, 185, 78, 0.6);
            }
          }
        `}</style>

                {/* Copyright Footer */}
                <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs px-4">
                    <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

// Mission Card Component
function MissionCard({ icon: Icon, title, description, delay }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
            }}
            style={{
                padding: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
        >
            <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <Icon
                    size={48}
                    color="#46b94e"
                    style={{ marginBottom: "20px" }}
                />
            </motion.div>
            <h3
                className="font-sf-pro"
                style={{
                    fontSize: "2rem",
                    marginBottom: "20px",
                    color: "#46b94e",
                }}
            >
                {title}
            </h3>
            <p
                className="font-sf-pro"
                style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "rgba(255, 255, 255, 0.8)",
                }}
            >
                {description}
            </p>
        </motion.div>
    );
}

// Activity Card Component
function ActivityCard({ icon, title, description, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                scale: 1.08,
                y: -10,
                transition: { duration: 0.3 }
            }}
            style={{
                padding: "35px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "15px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                    color: "#46b94e",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {icon}
            </motion.div>
            <h4
                className="font-sf-pro"
                style={{
                    fontSize: "1.4rem",
                    marginBottom: "15px",
                    color: "white",
                }}
            >
                {title}
            </h4>
            <p
                className="font-sf-pro"
                style={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "rgba(255, 255, 255, 0.7)",
                }}
            >
                {description}
            </p>
        </motion.div>
    );
}

// Stat Card Component
function StatCard({ number, label, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                scale: 1.15,
                transition: { duration: 0.3 }
            }}
            style={{
                padding: "30px",
            }}
        >
            <motion.div
                className="font-sf-pro"
                whileHover={{ scale: 1.1 }}
                style={{
                    fontSize: "3.5rem",
                    color: "#46b94e",
                    marginBottom: "10px",
                    fontWeight: "bold",
                }}
            >
                <AnimatedCounter value={number} />
            </motion.div>
            <div
                className="font-sf-pro"
                style={{
                    fontSize: "1.2rem",
                    color: "rgba(255, 255, 255, 0.8)",
                }}
            >
                {label}
            </div>

        </motion.div>

    );
}