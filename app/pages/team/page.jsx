"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "contentful";
import { Github, Linkedin, Instagram, Mail, ChevronDown, ChevronUp } from "lucide-react";
import GlassyNavbar from "../../components/GlassyNavbar";
import DotGrid from "../../components/DotGrid";
import TiltedCard from "../../components/TiltedCard";
import { motion, AnimatePresence } from "motion/react";

// Contentful Client
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export default function TeamPage() {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState(2025);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openTeams, setOpenTeams] = useState({});

    const years = [2025, 2024, 2023];

    const toggleTeam = (teamName) => {
        setOpenTeams((prev) => ({
            ...prev,
            [teamName]: !prev[teamName],
        }));
    };

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const response = await client.getEntries({
                    content_type: "memberProfile",
                    "fields.year": selectedYear,
                });

                const formatted = response.items.map((item) => {
                    const imgUrl = item.fields.photo?.fields?.file?.url;
                    return {
                        id: item.sys.id,
                        name: item.fields.name,
                        role: item.fields.role,
                        team: item.fields.team,
                        image: imgUrl ? (imgUrl.startsWith("//") ? `https:${imgUrl}` : imgUrl) : null,
                        generalMembers: item.fields.generalMembers,
                        socials: {
                            linkedin: item.fields.linkedin,
                            github: item.fields.github,
                            instagram: item.fields.instagram,
                            email: item.fields.email,
                        },
                    };
                });

                setMembers(formatted);
            } catch (err) {
                console.error("Error fetching members:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [selectedYear]);

    // Filtering Logic (from File A)
    const leadership = members.filter(
        (m) =>
            m.role?.toLowerCase().includes("chair") ||
            m.role?.toLowerCase().includes("president")
    );

    const coreTeam = members.filter(
        (m) =>
            !m.role?.toLowerCase().includes("chair") &&
            !m.role?.toLowerCase().includes("president")
    );

    const teamsWithMembers = members
        .filter((m) => m.generalMembers)
        .map((m) => ({
            teamName: m.team,
            leadName: m.name,
            memberList: m.generalMembers.split(",").map((s) => s.trim()),
        }));

    return (
        <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
            {/* Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
                <DotGrid
                    dotSize={3}
                    gap={15}
                    baseColor="#073b0d"
                    activeColor="#128224"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
                <GlassyNavbar />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "140px 40px 40px",
                        color: "white",
                        minHeight: "100vh",
                    }}
                >
                    <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "20px", color: "#46b94e" }}>
                        Our Team
                    </h1>

                    {/* Year Toggle */}
                    <div
                        style={{
                            display: "flex",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "40px",
                            padding: "5px",
                            marginBottom: "50px",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                style={{
                                    background: selectedYear === year ? "#46b94e" : "transparent",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 24px",
                                    borderRadius: "40px",
                                    cursor: "pointer",
                                    fontWeight: selectedYear === year ? "bold" : "normal",
                                }}
                            >
                                {year}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{ maxWidth: "1200px", width: "100%", display: "flex", flexDirection: "column", gap: "80px" }}>

                            {/* Leadership */}
                            {leadership.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px" }}>
                                    {leadership.map((member) => (
                                        <MemberCard key={member.id} member={member} big router={router} year={selectedYear} />
                                    ))}
                                </div>
                            )}

                            {/* Core Team */}
                            {coreTeam.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px" }}>
                                    {coreTeam.map((member) => (
                                        <MemberCard key={member.id} member={member} router={router} year={selectedYear} />
                                    ))}
                                </div>
                            )}

                            {/* General Members Accordion */}
                            {teamsWithMembers.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <motion.h2
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        style={{
                                            textAlign: "center",
                                            marginBottom: "40px",
                                            fontSize: "2.5rem",
                                            background: "linear-gradient(135deg, #46b94e 0%, #ffffff 50%, #46b94e 100%)",
                                            backgroundSize: "200% 200%",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                            animation: "gradient-shift 3s ease infinite"
                                        }}
                                    >
                                        Core Members
                                    </motion.h2>

                                    <div style={{ display: "grid", gap: "20px" }}>
                                        {teamsWithMembers.map((team, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                                style={{
                                                    background: "rgba(255,255,255,0.03)",
                                                    borderRadius: "15px",
                                                    border: "1px solid rgba(70,185,78,0.2)",
                                                    overflow: "hidden",
                                                    position: "relative",
                                                    backdropFilter: "blur(10px)",
                                                    boxShadow: openTeams[team.teamName]
                                                        ? "0 8px 32px rgba(70,185,78,0.3)"
                                                        : "0 4px 16px rgba(0,0,0,0.2)"
                                                }}
                                            >
                                                {/* Animated gradient border */}
                                                <div style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    borderRadius: "15px",
                                                    padding: "1px",
                                                    background: openTeams[team.teamName]
                                                        ? "linear-gradient(135deg, #46b94e, transparent, #46b94e)"
                                                        : "transparent",
                                                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                                    WebkitMaskComposite: "xor",
                                                    maskComposite: "exclude",
                                                    pointerEvents: "none",
                                                    opacity: openTeams[team.teamName] ? 1 : 0,
                                                    transition: "opacity 0.3s ease"
                                                }} />

                                                <motion.button
                                                    onClick={() => toggleTeam(team.teamName)}
                                                    whileHover={{
                                                        background: "rgba(70,185,78,0.15)",
                                                        scale: 1.01
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        width: "100%",
                                                        padding: "24px 30px",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        background: openTeams[team.teamName]
                                                            ? "rgba(70,185,78,0.1)"
                                                            : "transparent",
                                                        border: "none",
                                                        color: "white",
                                                        fontSize: "1.3rem",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        position: "relative",
                                                        zIndex: 1
                                                    }}
                                                >
                                                    <span style={{
                                                        fontWeight: "bold",
                                                        color: openTeams[team.teamName] ? "transparent" : "white",
                                                        background: openTeams[team.teamName]
                                                            ? "linear-gradient(90deg, #46b94e, #ffffff)"
                                                            : "transparent",
                                                        WebkitBackgroundClip: openTeams[team.teamName] ? "text" : "unset",
                                                        WebkitTextFillColor: openTeams[team.teamName] ? "transparent" : "white",
                                                        backgroundClip: openTeams[team.teamName] ? "text" : "unset",
                                                        transition: "all 0.3s ease"
                                                    }}>
                                                        {team.teamName} Team
                                                    </span>
                                                    <motion.div
                                                        animate={{ rotate: openTeams[team.teamName] ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {openTeams[team.teamName] ? <ChevronUp /> : <ChevronDown />}
                                                    </motion.div>
                                                </motion.button>

                                                <AnimatePresence>
                                                    {openTeams[team.teamName] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                                        >
                                                            <div style={{
                                                                padding: "10px 30px 30px",
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                gap: "12px"
                                                            }}>
                                                                {team.memberList.map((name, i) => (
                                                                    <motion.span
                                                                        key={i}
                                                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        transition={{
                                                                            delay: i * 0.02,
                                                                            duration: 0.3,
                                                                            type: "spring",
                                                                            stiffness: 200
                                                                        }}
                                                                        whileHover={{
                                                                            scale: 1.1,
                                                                            rotate: 2,
                                                                            boxShadow: "0 4px 20px rgba(70,185,78,0.4)",
                                                                            background: "rgba(70,185,78,0.3)"
                                                                        }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        style={{
                                                                            padding: "10px 18px",
                                                                            background: "rgba(70,185,78,0.2)",
                                                                            borderRadius: "25px",
                                                                            fontSize: "0.95rem",
                                                                            border: "1px solid rgba(70,185,78,0.4)",
                                                                            cursor: "pointer",
                                                                            fontWeight: "500",
                                                                            backdropFilter: "blur(5px)",
                                                                            transition: "all 0.3s ease"
                                                                        }}
                                                                    >
                                                                        {name}
                                                                    </motion.span>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright Footer */}
            <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs font-sans px-4">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}

// Unified Card Component (Design from B, Data from A)
function MemberCard({ member, router, big = false, year }) {
    const useBlackBackground = year === 2023 || year === 2024 || year === 2025;
    const imageSrc = member.image || "https://placehold.co/300x300/111/46b94e?text=" + member.name[0];

    return (
        <div
            onClick={() => router.push(`/pages/team/${member.id}`)}
            style={{ cursor: "pointer" }}
        >
            <TiltedCard
                imageSrc={imageSrc}
                altText={member.name}
                captionText={member.role}
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="300px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            padding: "20px",
                            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            height: "100%",
                            borderRadius: "15px"
                        }}
                    >
                        <h3 style={{ fontSize: big ? "1.8rem" : "1.3rem", color: "white", marginBottom: "5px" }}>{member.name}</h3>
                        <p style={{ color: "#46b94e", fontSize: big ? "1.1rem" : "0.95rem", marginBottom: "10px" }}>{member.role}</p>

                        <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
                            {member.socials?.linkedin && (
                                <a href={member.socials.linkedin} target="_blank" onClick={(e) => e.stopPropagation()} style={{ color: "white" }}>
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {member.socials?.github && (
                                <a href={member.socials.github} target="_blank" onClick={(e) => e.stopPropagation()} style={{ color: "white" }}>
                                    <Github size={18} />
                                </a>
                            )}
                            {member.socials?.instagram && (
                                <a href={member.socials.instagram} target="_blank" onClick={(e) => e.stopPropagation()} style={{ color: "white" }}>
                                    <Instagram size={18} />
                                </a>
                            )}
                            {member.socials?.email && (
                                <a href={`mailto:${member.socials.email}`} onClick={(e) => e.stopPropagation()} style={{ color: "white" }}>
                                    <Mail size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                }
            >
                {useBlackBackground && (
                    <div style={{ width: "100%", height: "100%", backgroundColor: "black", borderRadius: "15px" }}>
                        <img
                            src={imageSrc}
                            alt={member.name}
                            className="absolute top-0 left-0 object-cover rounded-[15px]"
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </div>
                )}
            </TiltedCard>
        </div>
    );
}
