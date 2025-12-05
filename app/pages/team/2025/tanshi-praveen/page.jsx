"use client";

import { useState, useEffect } from "react";
import { Mail, Linkedin, Github, MapPin, Briefcase } from "lucide-react";
import GlassyNavbar from "../../../../components/MemberNavbar";
import Squares from "../../../../components/Squares";
import { contentfulClient } from '@/lib/contentful';
import { Logo2 } from "../../../../logo/logo2";

export default function AdrikaSarawatPage() {
    const [isHovered, setIsHovered] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "Tanshi Praveen",
        role: "Photography Lead",
        memberId: "GFG-2024-1150",
        location: "SRM Institute of Science and Technology",
        email: "tanshipraveen005@gmail.com",
        linkedin: "https://www.linkedin.com/in/tanshi-praveen-a46b21328",
        github: "https://github.com/",

        about: "I’m Tanshi Praveen, a 3rd-year B.Tech CSE student passionate about photography. I have hands-on experience in MERN Stack development, Data Analytics, and strong problem-solving skills with a good DSA foundation. I enjoy creating efficient, user-focused projects and continuously improving my technical expertise.",

        profileImage: "https://images.ctfassets.net/u39iu0kuz48f/1svgSaHqKCs8XD6YLibQis/86e292798d2d8bfd3d9486492f8ec9b0/IMG_8783.JPG",

        skills: [
            { name: "React", level: "Advanced", color: "#61DAFB" },
            { name: "Next.js", level: "Advanced", color: "#000000" },
            { name: "Node.js", level: "Intermediate", color: "#339933" },
            { name: "TypeScript", level: "Advanced", color: "#3178C6" },
            { name: "Data Analytics and Visualization", level: "Intermediate", color: "#3776AB" },
            { name: "MongoDB", level: "Intermediate", color: "#47A248" },
            { name: "Git", level: "Advanced", color: "#F05032" },
            { name: "Problem Solving", level: "Beginner", color: "#2496ED" },
        ],
    });

    // Fetch profile data from Contentful
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'memberProfile',
                    'fields.name': 'Tanshi Praveen',
                });

                if (response.items.length > 0) {
                    const member = response.items[0].fields;
                    setProfileData(prev => ({
                        ...prev,
                        name: member.name || prev.name,
                        role: member.role || prev.role,
                        memberId: member.memberId || prev.memberId,
                        location: member.location || prev.location,
                        email: member.email || prev.email,
                        linkedin: member.linkedin || prev.linkedin,
                        github: member.github || prev.github,
                        about: member.about || prev.about,
                        profileImage: member.profileImage || prev.profileImage,
                        skills: member.skills || prev.skills,
                    }));
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                // Keep using default data on error
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
            {/* Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#333"
                    hoverFillColor="#222"
                />
            </div>

            {/* Foreground content */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <GlassyNavbar backLink="/pages/team" backLabel="← Back to Team" />

                <main
                    style={{
                        minHeight: "100vh",
                        padding: "100px 40px 40px",
                        color: "white",
                    }}
                >
                    {/* Main Content Container */}
                    <div
                        className="main-grid"
                        style={{
                            maxWidth: "1400px",
                            width: "100%",
                            margin: "0 auto",
                            display: "grid",
                            gridTemplateColumns: "400px 1fr",
                            gridTemplateRows: "auto auto",
                            gap: "30px",
                            alignItems: "start",
                        }}
                    >
                        {/* Top Left - Lanyard ID Card */}
                        <div
                            className="id-card-container"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "sticky",
                                top: "120px",
                                left: "220px",
                            }}
                        >
                            {/* Lanyard String */}
                            <div
                                className="id-card-wrapper"
                                style={{
                                    position: "relative",

                                    transformOrigin: "top center",
                                }}
                            >
                                {/* Lanyard Clip */}
                                <div
                                    style={{
                                        width: "40px",
                                        height: "20px",
                                        background: "linear-gradient(145deg, #444, #222)",
                                        borderRadius: "10px 10px 0 0",
                                        margin: "0 auto",
                                        position: "relative",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            background: "#666",
                                            borderRadius: "50%",
                                            position: "absolute",
                                            top: "6px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    />
                                </div>

                                {/* Lanyard String */}
                                <div
                                    style={{
                                        width: "4px",
                                        height: "80px",
                                        background: "linear-gradient(to bottom, #00ff88, #00cc6a)",
                                        margin: "0 auto",
                                        boxShadow: "0 0 10px rgba(0,255,136,0.3)",
                                    }}
                                />

                                {/* ID Card */}
                                <div
                                    style={{
                                        width: "320px",
                                        background: "rgba(5, 3, 3, 0.89)",
                                        backdropFilter: "blur(20px)",
                                        borderRadius: "24px",
                                        padding: "30px",
                                        border: "1px solid rgba(0, 255, 136, 0.2)",
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(0, 255, 136, 0.1), inset 0 0 20px rgba(0, 255, 136, 0.05)",
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05) rotateY(5deg)";
                                        e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(0,255,136,0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                                        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,136,0.1)";
                                    }}
                                >

                                    {/* Logo2 at Top Center */}
                                    <div
                                        style={{
                                            width: "180px",
                                            height: "auto",
                                            margin: "0 auto 50px",
                                        }}
                                    >
                                        <Logo2 />
                                    </div>

                                    {/* Profile Image */}
                                    <div
                                        style={{
                                            width: "170px",
                                            height: "170px",
                                            margin: "20px auto 30px",
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            border: "4px solid rgba(0,255,136,0.5)",
                                            boxShadow: "0 0 30px rgba(0,255,136,0.3), inset 0 0 20px rgba(0,0,0,0.3)",
                                            position: "relative",
                                        }}
                                    >
                                        <img
                                            src={profileData.profileImage}
                                            alt={profileData.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>

                                    {/* Name and Role */}
                                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                                        <h2
                                            style={{

                                                fontSize: "26px",
                                                fontWeight: "700",
                                                marginBottom: "8px",
                                                color: "#00ff88",
                                            }}
                                        >
                                            {profileData.name}
                                        </h2>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                color: "#00ff88",
                                                fontWeight: "500",
                                                letterSpacing: "1px",
                                            }}
                                        >
                                            {profileData.role}
                                        </p>
                                    </div>

                                    {/* ID Number */}
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            padding: "10px",
                                            background: "rgba(0,0,0,0.3)",
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            border: "1px solid rgba(0,255,136,0.2)",
                                        }}
                                    >
                                        <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>
                                            Member Since 2024
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                letterSpacing: "2px",
                                                color: "#00ff88",
                                            }}
                                        >

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - About Me and Technical Skills */}
                        <div
                            className="right-column"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "30px",
                                paddingLeft: "240px",
                                paddingTop: "120px",
                            }}
                        >
                            {/* About Me Section */}
                            <div
                                style={{
                                    background: "rgba(10, 10, 10, 0.8)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "24px",
                                    padding: "28px 32px",
                                    border: "1px solid rgba(0, 255, 136, 0.2)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(0, 255, 136, 0.1), inset 0 0 20px rgba(0, 255, 136, 0.05)",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    maxWidth: "580px",
                                    width: "100%",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-6px)";
                                    e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,136,0.15), inset 0 1px 0 rgba(255,255,255,0.12)";
                                    e.currentTarget.style.border = "2px solid rgba(0,255,136,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)";
                                    e.currentTarget.style.border = "2px solid rgba(0,255,136,0.2)";
                                }}
                            >
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                        <div
                                            style={{
                                                width: "4px",
                                                height: "28px",
                                                background: "linear-gradient(180deg, #00ff88, #00cc6a)",
                                                borderRadius: "2px",
                                                boxShadow: "0 0 15px rgba(0,255,136,0.4)",
                                            }}
                                        />
                                        <h3
                                            style={{
                                                fontSize: "26px",
                                                fontWeight: "700",

                                                letterSpacing: "-0.3px",
                                                margin: 0,
                                                color: "#00ff88",
                                            }}
                                        >
                                            About Me
                                        </h3>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: "14px",
                                            lineHeight: "1.7",
                                            color: "rgba(255,255,255,0.85)",
                                            marginBottom: "20px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        {profileData.about}
                                    </p>

                                    {/* Contact Info Grid */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "12px",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "12px 14px",
                                                background: "rgba(0,255,136,0.05)",
                                                borderRadius: "12px",
                                                border: "1px solid rgba(0,255,136,0.15)",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(0,255,136,0.08)";
                                                e.currentTarget.style.border = "1px solid rgba(0,255,136,0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(0,255,136,0.05)";
                                                e.currentTarget.style.border = "1px solid rgba(0,255,136,0.15)";
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))",
                                                    borderRadius: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <MapPin size={16} color="#00ff88" />
                                            </div>
                                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", flex: 1, lineHeight: "1.4" }}>
                                                {profileData.location}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                padding: "12px 14px",
                                                background: "rgba(0,255,136,0.05)",
                                                borderRadius: "12px",
                                                border: "1px solid rgba(0,255,136,0.15)",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(0,255,136,0.08)";
                                                e.currentTarget.style.border = "1px solid rgba(0,255,136,0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(0,255,136,0.05)";
                                                e.currentTarget.style.border = "1px solid rgba(0,255,136,0.15)";
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08))",
                                                    borderRadius: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Mail size={16} color="#00ff88" />
                                            </div>
                                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", flex: 1, lineHeight: "1.4" }}>
                                                {profileData.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <a
                                            href={`${profileData.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                padding: "12px 16px",
                                                background: "linear-gradient(135deg, rgba(0,119,181,0.12), rgba(0,119,181,0.04))",
                                                border: "1.5px solid rgba(0,119,181,0.25)",
                                                borderRadius: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                textDecoration: "none",
                                                color: "#0ea5e9",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,119,181,0.2), rgba(0,119,181,0.08))";
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,119,181,0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,119,181,0.12), rgba(0,119,181,0.04))";
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <Linkedin size={16} />
                                            LinkedIn
                                        </a>
                                        <a
                                            href={`${profileData.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                padding: "12px 16px",
                                                background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))",
                                                border: "1.5px solid rgba(139,92,246,0.25)",
                                                borderRadius: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                textDecoration: "none",
                                                color: "#a78bfa",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.08))";
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(139,92,246,0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))";
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <Github size={16} />
                                            GitHub
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Skills Section - Below About Me */}
                            <div
                                style={{
                                    background: "rgba(10, 10, 10, 0.8)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "24px",
                                    padding: "28px 32px",
                                    border: "1px solid rgba(0, 255, 136, 0.2)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(0, 255, 136, 0.1), inset 0 0 20px rgba(0, 255, 136, 0.05)",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    maxWidth: "580px",
                                    width: "100%",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-6px)";
                                    e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,255,136,0.15), inset 0 1px 0 rgba(255,255,255,0.12)";
                                    e.currentTarget.style.border = "2px solid rgba(0,255,136,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)";
                                    e.currentTarget.style.border = "2px solid rgba(0,255,136,0.2)";
                                }}
                            >
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                        <div
                                            style={{
                                                width: "4px",
                                                height: "28px",
                                                background: "linear-gradient(180deg, #00ff88, #00cc6a)",
                                                borderRadius: "2px",
                                                boxShadow: "0 0 15px rgba(0,255,136,0.4)",
                                            }}
                                        />
                                        <h3
                                            style={{
                                                fontSize: "26px",
                                                fontWeight: "700",
                                                letterSpacing: "-0.3px",
                                                margin: 0,
                                                color: "#00ff88",
                                            }}
                                        >
                                            Technical Skills
                                        </h3>
                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                                            gap: "12px",
                                        }}
                                    >
                                        {profileData.skills.map((skill, index) => (
                                            <div
                                                key={skill.name}
                                                style={{
                                                    padding: "16px 20px",
                                                    background: `linear-gradient(135deg, ${skill.color}10, ${skill.color}04)`,
                                                    border: `1.5px solid ${skill.color}28`,
                                                    borderRadius: "14px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    animation: `fadeInUp 0.5s ease ${index * 0.06}s both`,
                                                    cursor: "pointer",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                                                    e.currentTarget.style.boxShadow = `0 12px 30px ${skill.color}35`;
                                                    e.currentTarget.style.border = `1.5px solid ${skill.color}60`;
                                                    e.currentTarget.style.background = `linear-gradient(135deg, ${skill.color}18, ${skill.color}06)`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                    e.currentTarget.style.border = `1.5px solid ${skill.color}28`;
                                                    e.currentTarget.style.background = `linear-gradient(135deg, ${skill.color}10, ${skill.color}04)`;
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        color: "#ffffff",
                                                    }}
                                                >
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes swingLanyard {
          0% {
            transform: rotate(3deg);
          }
          50% {
            transform: rotate(-3deg);
          }
          100% {
            transform: rotate(3deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Styles */
        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          .id-card-container {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            margin-bottom: 20px;
          }

          .right-column {
            padding-left: 0 !important;
            padding-top: 0 !important;
          }
        }

        @media (max-width: 768px) {
          main {
            padding: 80px 20px 40px !important;
          }
          
          .id-card-wrapper {
            transform: scale(0.85);
          }

          .right-column > div {
            padding: 20px 24px !important;
          }

          .right-column h3 {
            font-size: 22px !important;
          }

          .right-column p {
            font-size: 13px !important;
          }
        }

        @media (max-width: 480px) {
          main {
            padding: 70px 16px 30px !important;
          }

          .id-card-wrapper {
            transform: scale(0.75);
          }

          .main-grid {
            gap: 30px !important;
          }

          .right-column > div {
            padding: 18px 20px !important;
            border-radius: 18px !important;
          }

          .right-column h3 {
            font-size: 20px !important;
          }

          .right-column p {
            font-size: 12px !important;
            line-height: 1.6 !important;
          }

          .right-column > div > div > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }

          .right-column a {
            font-size: 12px !important;
            padding: 10px 14px !important;
          }
        }
      `}</style >
        </div >
    );
}
