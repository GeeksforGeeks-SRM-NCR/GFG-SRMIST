"use client";

import { useState, useEffect } from "react";
import { Mail, Linkedin, Github, MapPin, Calendar, Award, Code, Sparkles, ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Squares from "../../../../components/Squares";
import LightRays from "../../../../components/LightRays";
import { contentfulClient } from '@/lib/contentful';
import { Logo2 } from "../../../../logo/logo2";
import { Logo } from "../../../../logo/logo";

export default function PranatiVermaProfile() {
    const [profileData, setProfileData] = useState({
        name: "Pranati Verma",
        role: "Member",
        memberId: "GFG-2024-1150",
        location: "SRM Institute of Science and Technology",
        email: "member@srmist.edu.in",
        linkedin: "#",
        github: "#",
        about: "Loading profile information...",
        profileImage: "/placeholder.png",
        skills: [
            { name: "React", level: "Advanced", color: "#61DAFB" },
            { name: "Next.js", level: "Advanced", color: "#000000" },
            { name: "Node.js", level: "Intermediate", color: "#339933" },
            { name: "TypeScript", level: "Advanced", color: "#3178C6" },
            { name: "Python", level: "Intermediate", color: "#3776AB" },
            { name: "MongoDB", level: "Intermediate", color: "#47A248" },
            { name: "Git", level: "Advanced", color: "#F05032" },
            { name: "Docker", level: "Beginner", color: "#2496ED" },
        ],
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'memberProfile',
                    'fields.name': 'Pranati Verma',
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
                        profileImage: member.photo?.fields?.file?.url ? (member.photo.fields.file.url.startsWith('//') ? `https:${member.photo.fields.file.url}` : member.photo.fields.file.url) : prev.profileImage,
                        skills: member.skills || prev.skills,
                    }));
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#333"
                    hoverFillColor="#222"
                />
            </div>

            <div className="fixed inset-0 z-0 pointer-events-none">
                <LightRays
                    raysColor="#46b94e"
                    raysOrigin="top-center"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                />
            </div>

            {/* Ambient Glow */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[128px] z-0 animate-pulse" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] z-0 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative z-10">

                <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ y: 30 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col lg:flex-row gap-12 mb-16"
                    >
                        {/* Profile Image Card */}
                        <motion.div
                            initial={{ x: -30 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="lg:w-80 shrink-0"
                        >
                            <div className="relative">
                                {/* Decorative Background - Reduced greenish tint */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-gray-500/10 to-gray-600/10 rounded-3xl blur-2xl" />
                                
                                <div className="relative bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden">
                                    {/* Logo2 at Top */}
                                    <div className="w-32 mx-auto mb-4">
                                        <Logo2 />
                                    </div>

                                    {/* Profile Image */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-2xl blur-xl opacity-30" />
                                        <img
                                            src={profileData.profileImage}
                                            alt={profileData.name}
                                            className="relative w-full aspect-square object-cover rounded-2xl border-2 border-white/20"
                                        />
                                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border-4 border-black shadow-xl p-3 overflow-hidden">
                                            <Award className="text-black" size={32} />
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <div className="text-center mb-6">
                                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            {profileData.name}
                                        </h1>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                                            <Sparkles size={14} className="text-green-400" />
                                            <span className="text-green-400 font-semibold text-sm">{profileData.role}</span>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <MapPin size={16} className="text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Location</p>
                                                <p className="text-sm text-gray-300">{profileData.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                <Mail size={16} className="text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm text-gray-300 truncate">{profileData.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                <Calendar size={16} className="text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Member Since</p>
                                                <p className="text-sm text-gray-300">2024</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="mt-6 flex gap-3">
                                        <a
                                            href={profileData.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all group"
                                        >
                                            <Linkedin size={18} />
                                            <span className="text-sm font-medium">LinkedIn</span>
                                        </a>

                                        <a
                                            href={profileData.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all group"
                                        >
                                            <Github size={18} />
                                            <span className="text-sm font-medium">GitHub</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-8">
                            {/* About Section */}
                            <motion.div
                                initial={{ y: 30 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full" />
                                        <h2 className="text-2xl font-bold text-white">About Me</h2>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-justify">
                                        {profileData.about}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Skills Section */}
                            <motion.div
                                initial={{ y: 30 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Code size={24} />
                                            Technical Skills
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {profileData.skills.map((skill, index) => (
                                            <motion.div
                                                key={skill.name}
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                className="relative group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 rounded-xl blur-lg transition-opacity duration-300" style={{ backgroundColor: `${skill.color}40` }} />
                                                <div
                                                    className="relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${skill.color}15, ${skill.color}05)`,
                                                        borderColor: `${skill.color}30`
                                                    }}
                                                >
                                                    <div className="text-center">
                                                        <p className="font-semibold text-white mb-1">{skill.name}</p>
                                                        <p className="text-xs text-gray-400">{skill.level}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Copyright Footer */}
            <div className="relative z-20 w-full text-center py-6 text-white/60 text-xs">
                <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
            </div>
        </div>
    );
}
