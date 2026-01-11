"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "contentful";
import { Github, Linkedin, Instagram, Mail, ChevronDown, ChevronUp } from "lucide-react";
import GlassyNavbar from "../../components/GlassyNavbar";
import Squares from "../../components/Squares";
import TiltedCard from "../../components/TiltedCard";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedTooltip } from "../../../components/ui/animated-tooltip";

// Contentful Client
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const createSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')    // Remove special chars
        .replace(/[\s_-]+/g, '-')    // Replace spaces with hyphens
        .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
};

export default function TeamPage() {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState(2025);
    const [members, setMembers] = useState([]);
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openTeams, setOpenTeams] = useState({});

    const years = [2025, 2024, 2023];

    const toggleTeam = (teamName) => {
        setOpenTeams((prev) => ({
            ...prev,
            [teamName]: !prev[teamName],
        }));
    };

    // Fetch faculty members once (independent of year)
    useEffect(() => {
        const fetchFacultyMembers = async () => {
            try {
                const response = await client.getEntries({
                    content_type: "memberProfile",
                    order: 'fields.order',
                });

                const formatted = response.items.map((item) => {
                    const imgUrl = item.fields.photo?.fields?.file?.url;
                    const slug = createSlug(item.fields.name);

                    let orderValue = 999;
                    if (item.fields.order !== undefined && item.fields.order !== null) {
                        orderValue = typeof item.fields.order === 'number'
                            ? item.fields.order
                            : parseInt(item.fields.order, 10);

                        if (isNaN(orderValue)) {
                            orderValue = 999;
                        }
                    }

                    return {
                        id: item.sys.id,
                        slug: slug,
                        name: item.fields.name,
                        role: item.fields.role,
                        team: item.fields.team,
                        image: imgUrl ? (imgUrl.startsWith("//") ? `https:${imgUrl}` : imgUrl) : null,
                        generalMembers: item.fields.generalMembers,
                        coLead: item.fields.coLead,
                        order: orderValue,
                        socials: {
                            linkedin: item.fields.linkedin,
                            github: item.fields.github,
                            instagram: item.fields.instagram,
                            email: item.fields.email,
                        },
                    };
                });

                // Filter only faculty members
                const faculty = formatted.filter(
                    (m) =>
                        m.role?.toLowerCase().includes("faculty") ||
                        m.role?.toLowerCase().includes("coordinator")
                ).sort((a, b) => a.order - b.order);

                setFacultyMembers(faculty);
            } catch (err) {
                console.error("Error fetching faculty members:", err);
            }
        };

        fetchFacultyMembers();
    }, []);

    // Fetch year-based members
    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const response = await client.getEntries({
                    content_type: "memberProfile",
                    "fields.year": selectedYear,
                    order: 'fields.order',
                });

                console.log('Fetched members count:', response.items.length);

                const formatted = response.items.map((item) => {
                    const imgUrl = item.fields.photo?.fields?.file?.url;
                    const slug = createSlug(item.fields.name);

                    // Parse order field properly
                    let orderValue = 999;
                    if (item.fields.order !== undefined && item.fields.order !== null) {
                        orderValue = typeof item.fields.order === 'number'
                            ? item.fields.order
                            : parseInt(item.fields.order, 10);

                        if (isNaN(orderValue)) {
                            orderValue = 999;
                        }
                    }

                    console.log(`${item.fields.name}: order=${orderValue}`);

                    return {
                        id: item.sys.id,
                        slug: slug,
                        name: item.fields.name,
                        role: item.fields.role,
                        team: item.fields.team,
                        image: imgUrl ? (imgUrl.startsWith("//") ? `https:${imgUrl}` : imgUrl) : null,
                        generalMembers: item.fields.generalMembers,
                        coLead: item.fields.coLead,
                        order: orderValue,
                        socials: {
                            linkedin: item.fields.linkedin,
                            github: item.fields.github,
                            instagram: item.fields.instagram,
                            email: item.fields.email,
                        },
                    };
                });

                // Sort members by order field (ascending)
                const sortedMembers = formatted.sort((a, b) => {
                    const orderA = Number(a.order) || 999;
                    const orderB = Number(b.order) || 999;
                    return orderA - orderB;
                });

                console.log('Sorted order:', sortedMembers.map(m => `${m.name}:${m.order}`).join(', '));

                setMembers(sortedMembers);
            } catch (err) {
                console.error("Error fetching members:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [selectedYear]);

    // Filtering Logic with Order Sorting
    // Faculty members are now fetched separately and don't depend on year
    const facultyCoordinators = facultyMembers;

    const leadership = members
        .filter(
            (m) =>
                (m.role?.toLowerCase().includes("chair") ||
                    m.role?.toLowerCase().includes("president")) &&
                !m.role?.toLowerCase().includes("faculty") &&
                !m.role?.toLowerCase().includes("coordinator")
        )
        .sort((a, b) => a.order - b.order);

    const coreTeam = members
        .filter(
            (m) =>
                !m.role?.toLowerCase().includes("chair") &&
                !m.role?.toLowerCase().includes("president") &&
                !m.role?.toLowerCase().includes("faculty") &&
                !m.role?.toLowerCase().includes("coordinator")
        )
        .sort((a, b) => a.order - b.order);

    const teamsWithMembers = members
        .filter((m) => m.generalMembers)
        .map((m) => ({
            teamName: m.team,
            leadName: m.name,
            coLeadName: m.coLead,
            memberList: m.generalMembers.split(",").map((s) => s.trim()),
        }));

    // Team member photo mapping - placeholder images (replace with actual photos)
    const memberPhotoMap = {

        "Aryan Sharma": "/Users/sahilrajdubey/.gemini/antigravity/brain/cd18f689-c26a-4455-9649-16cdb8fce8d0/team_member_1_1765724493945.png",
        "Priya Patel": "/Users/sahilrajdubey/.gemini/antigravity/brain/cd18f689-c26a-4455-9649-16cdb8fce8d0/team_member_2_1765724513504.png",
        "Rahul Kumar": "/Users/sahilrajdubey/.gemini/antigravity/brain/cd18f689-c26a-4455-9649-16cdb8fce8d0/team_member_3_1765724531360.png",
        "Sneha Gupta": "/Users/sahilrajdubey/.gemini/antigravity/brain/cd18f689-c26a-4455-9649-16cdb8fce8d0/team_member_4_1765724547957.png",
        "Vikram Singh": "/Users/sahilrajdubey/.gemini/antigravity/brain/cd18f689-c26a-4455-9649-16cdb8fce8d0/team_member_5_1765724575419.png",

    };

    // Convert team members to AnimatedTooltip format
    const getTooltipItems = (memberList) => {
        return memberList.map((name, index) => ({
            id: index + 1,
            name: name,
            designation: "Team Member",
            image: memberPhotoMap[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=46b94e&color=fff&size=100`,
        }));
    };

    return (
        <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
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

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "clamp(120px, 20vh, 150px) clamp(30px, 5vw, 40px) 100px",
                        color: "white",
                        minHeight: "100vh",
                    }}
                >
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{ maxWidth: "1400px", width: "100%", display: "flex", flexDirection: "column", gap: "80px" }}>

                            {/* Faculty Coordinators */}
                            {facultyCoordinators.length > 0 && (
                                <div>
                                    <h2 className="font-sf-pro" style={{
                                        fontSize: "clamp(2rem, 8vw, 5.5rem)",
                                        fontWeight: "800",
                                        color: "#fff",
                                        marginBottom: "clamp(20px, 5vw, 40px)",
                                        letterSpacing: "clamp(-1px, -0.3vw, -2px)",
                                        lineHeight: "1.1",
                                        textAlign: "center",
                                        padding: "0 20px",
                                    }}>
                                        FACULTY <span style={{ color: "#46b94e" }}>COORDINATOR</span>
                                    </h2>
                                    <div style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        gap: "clamp(20px, 4vw, 60px)",
                                        padding: "0 clamp(10px, 3vw, 20px)"
                                    }}>
                                        {facultyCoordinators.map((member) => (
                                            <MemberCard key={member.id} member={member} big router={router} year={selectedYear} clickable={false} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Our Team Section Header */}
                            <h1 className="font-sf-pro" style={{
                                fontSize: "clamp(3.5rem, 5vw, 4.5rem)",
                                fontWeight: "800",
                                color: "#fff",
                                marginBottom: "-20px",
                                letterSpacing: "-3px",
                                lineHeight: "1.1",
                                textAlign: "center",
                            }}>
                                OUR <span style={{ color: "#46b94e" }}> TEAM</span>
                            </h1>

                            {/* Year Toggle */}
                            <div
                                style={{
                                    display: "flex",
                                    background: "rgba(255,255,255,0.1)",
                                    borderRadius: "40px",
                                    padding: "1px",
                                    marginBottom: "2px",
                                    backdropFilter: "blur(10px)",
                                    alignSelf: "center",
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

                            {/* Leadership */}
                            {leadership.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(30px, 4vw, 60px)" }}>
                                    {leadership.map((member) => (
                                        <MemberCard key={member.id} member={member} big router={router} year={selectedYear} />
                                    ))}
                                </div>
                            )}

                            {/* Core Team */}
                            {coreTeam.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(30px, 4vw, 60px)" }}>
                                    {coreTeam.map((member) => (
                                        <MemberCard key={member.id} member={member} router={router} year={selectedYear} />
                                    ))}
                                </div>
                            )}

                            {/* Team-wise Members Section - Clean Design */}
                            {teamsWithMembers.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full mt-20 px-4"
                                >
                                    {/* Section Header */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center mb-16"
                                    >
                                        <h2 className="font-sf-pro" style={{
                                            fontSize: "clamp(3.5rem, 5vw, 6.5rem)",
                                            fontWeight: "800",
                                            color: "#fff",
                                            marginBottom: "25px",
                                            letterSpacing: "-3px",
                                            lineHeight: "1.1",
                                        }}>
                                            CORE <span style={{ color: "#46b94e" }}> MEMBERS</span>
                                        </h2>
                                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                            Meet the talented individuals driving each department
                                        </p>
                                    </motion.div>

                                    {/* Single Column Team Layout - Wider & Collapsible */}
                                    <div className="max-w-6xl mx-auto space-y-6">
                                        {teamsWithMembers.map((team, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 40 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                            >
                                                {/* Team Header - Clickable */}
                                                <button
                                                    onClick={() => toggleTeam(team.teamName)}
                                                    className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-all duration-200"
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="text-3xl font-bold text-white mb-2">
                                                            {team.teamName}
                                                        </h3>
                                                        <p className="text-gray-400">
                                                            Led by <span className="text-white font-medium">{team.leadName}</span>
                                                            {team.coLeadName && (
                                                                <> & <span className="text-white font-medium">{team.coLeadName}</span></>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-white">
                                                                {team.memberList.length}
                                                            </div>
                                                            <p className="text-sm text-gray-400">Members</p>
                                                        </div>

                                                        {/* Chevron Icon */}
                                                        <motion.div
                                                            animate={{ rotate: openTeams[team.teamName] ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-white"
                                                        >
                                                            <ChevronDown size={24} />
                                                        </motion.div>
                                                    </div>
                                                </button>

                                                {/* Collapsible Team Members Grid */}
                                                <AnimatePresence>
                                                    {openTeams[team.teamName] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            <div className="px-8 pb-8 pt-4 border-t border-white/10">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    {team.memberList.map((memberName, i) => {
                                                                        const memberImage = memberPhotoMap[memberName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=1f1f1f&color=fff&size=100`;

                                                                        return (
                                                                            <motion.div
                                                                                key={i}
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ delay: i * 0.05 }}
                                                                                className="flex items-center gap-4 p-4 bg-black/20 rounded-xl hover:bg-black/40 transition-all duration-200 border border-white/5 hover:border-white/10"
                                                                            >


                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-white font-medium truncate">
                                                                                        {memberName}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">Team Member</p>
                                                                                </div>
                                                                            </motion.div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Team Stats Summary */}

                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Copyright Footer */}
            <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs px-4">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}

// Unified Card Component (Design from B, Data from A)
function MemberCard({ member, router, big = false, year, clickable = true }) {
    const useBlackBackground = year === 2023 || year === 2024 || year === 2025;
    const imageSrc = member.image || "https://placehold.co/300x300/111/46b94e?text=" + member.name[0];

    const handleClick = () => {
        if (clickable && year === 2025) {
            router.push(`/pages/team/2025/${member.slug}`);
        }
    };

    const cardSize = big ? "clamp(280px, 80vw, 350px)" : "clamp(250px, 70vw, 300px)";

    return (
        <div
            onClick={handleClick}
            style={{ cursor: clickable ? "pointer" : "default" }}
        >
            <TiltedCard
                imageSrc={imageSrc}
                altText={member.name}
                captionText={member.role}
                containerHeight={cardSize}
                containerWidth={cardSize}
                imageHeight={cardSize}
                imageWidth={cardSize}
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
