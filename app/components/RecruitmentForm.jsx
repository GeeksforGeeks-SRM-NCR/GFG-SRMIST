"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { submitRecruitment } from "@/app/admin/recruitment/actions";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Logo2 } from "@/app/logo/logo2";

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function RecruitmentForm() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const selectedTeam = watch("team_preference");

    // Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);

    function handleMouse(e) {
        if (window.innerWidth < 768) return; // Disable tilt on mobile

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotateAmplitude = 5; // Reduced amplitude for form usability
        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    }

    function handleMouseEnter() {
        scale.set(1.01);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
    }

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const payload = {
                name: data.name,
                email_college: data.email_college,
                email_personal: data.email_personal,
                phone: data.phone,
                reg_no: data.reg_no,
                year: parseInt(data.year),
                section: data.section,
                branch: data.branch,
                team_preference: data.team_preference,
                resume_link: data.resume_link,
                technical_skills: data.technical_skills || null,
                design_skills: data.design_skills || null,
                description: data.description
            };

            console.log('Submitting payload:', payload);

            await submitRecruitment(payload);

            console.log('Successfully submitted application');
            setSubmitted(true);
        } catch (err) {
            console.error('Error Submitting:', err);
            console.error('Error message:', err.message);
            alert(`Something went wrong: ${err.message || 'Please try again'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 bg-green-900/20 border border-[#46b94e]/50 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(70,185,78,0.2)] max-w-lg mx-auto mt-10"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-[#46b94e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(70,185,78,0.6)]"
                >
                    <Check size={40} className="text-black" strokeWidth={3} />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-white font-sans">Application Received!</h2>
                <p className="text-gray-300 text-lg">Sit tight! We will review your application and get back to you soon.</p>
            </motion.div>
        );
    }

    const inputClasses = "w-full p-4 bg-white/5 rounded-xl border border-white/10 focus:border-[#46b94e] focus:bg-white/10 outline-none transition-all duration-300 text-white placeholder-gray-500 focus:shadow-[0_0_20px_rgba(70,185,78,0.2)]";
    const labelClasses = "block text-sm font-medium text-gray-400 mb-2 ml-1";

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div
            className="perspective-1000 w-full max-w-3xl mx-auto"
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1000px" }}
        >
            <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: "preserve-3d"
                }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 p-6 md:p-10 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#46b94e] to-transparent opacity-50"></div>
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#46b94e]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#46b94e]/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                    <Link href="/pages/about">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#46b94e] hover:border-[#46b94e]/50 transition-colors backdrop-blur-md"
                        >
                            <ChevronDown className="rotate-90" size={24} />
                        </motion.button>
                    </Link>
                </div>

                {/* Logo2 at top middle */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center mb-6"
                >
                    <div className="w-32 md:w-40">
                        <Logo2 />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center mb-4 transform-gpu translate-z-10" style={{ transform: "translateZ(20px)" }}>
                    <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#46b94e] to-white animate-gradient-x">Join the Team</h2>
                    <p className="text-gray-400">Be part of something extraordinary.</p>
                </motion.div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                        <label className={labelClasses}>Full Name</label>
                        <input {...register("name", { required: true })} placeholder="Enter your name" className={inputClasses} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className={labelClasses}>Registration No.</label>
                        <input {...register("reg_no", { required: true })} placeholder="Enter your Registration Number" className={inputClasses} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className={labelClasses}>College ID</label>
                        <input {...register("email_college", { required: true })} placeholder="Enter your College ID" type="email" className={inputClasses} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className={labelClasses}>Personal Email ID</label>
                        <input {...register("email_personal", { required: true })} placeholder="Enter your Personal Email ID" type="email" className={inputClasses} />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants}>
                        <label className={labelClasses}>Phone Number</label>
                        <input {...register("phone", { required: true })} placeholder="+91 " type="tel" className={inputClasses} />
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative">
                        <label className={labelClasses}>Year</label>
                        <div className="relative">
                            <select {...register("year", { required: true })} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" className="text-black">Select Year</option>
                                <option value="1" className="text-black">1st Year</option>
                                <option value="2" className="text-black">2nd Year</option>
                                <option value="3" className="text-black">3rd Year</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className={labelClasses}>Section</label>
                        <input {...register("section", { required: true })} placeholder="A,B,C,D.." className={inputClasses} />
                    </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                    <label className={labelClasses}>Branch</label>
                    <input {...register("branch", { required: true })} placeholder=" Core, ECE, AIML..." className={inputClasses} />
                </motion.div>

                {/* Team Preference */}
                <motion.div variants={itemVariants}>
                    <label className="block text-lg font-semibold text-[#46b94e] mb-3">Preferred Domain</label>
                    <div className="relative">
                        <select {...register("team_preference", { required: true })} className={`${inputClasses} appearance-none cursor-pointer text-lg`}>
                            <option value="" className="text-black">Select a Team</option>
                            <option value="Technical" className="text-black">Technical Team</option>
                            <option value="Events" className="text-black">Events Mangement Team</option>
                            <option value="Corporate" className="text-black">PR Team</option>
                            <option value="Creatives" className="text-black">Design & Branding Team</option>
                            <option value="Marketing" className="text-black">Marketing Team</option>
                            <option value="Social Media" className="text-black">Social Media Team</option>
                            <option value="Photography" className="text-black">Photography Team</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#46b94e] pointer-events-none" size={24} />
                    </div>
                </motion.div>

                {/* Conditional Skills */}
                <AnimatePresence>
                    {selectedTeam === 'Technical' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <label className={labelClasses}>Technical Skills</label>
                            <div className="flex flex-wrap gap-3 p-2">
                                {['React', 'Node.js', 'Python', 'App Dev', 'AI/ML', 'Cloud', 'Blockchain', 'Cybersecurity'].map(skill => (
                                    <label key={skill} className="relative group cursor-pointer">
                                        <input type="checkbox" value={skill} {...register("technical_skills")} className="peer sr-only" />
                                        <span className="block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 transition-all duration-300 peer-checked:bg-[#46b94e] peer-checked:text-black peer-checked:font-bold peer-checked:shadow-[0_0_15px_rgba(70,185,78,0.5)] group-hover:border-[#46b94e]/50">
                                            {skill}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                    <label className={labelClasses}>Resume Link (Public)</label>
                    <input {...register("resume_link", { required: true })} placeholder="Google Drive / LinkedIn / Portfolio" type="url" className={inputClasses} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <label className={labelClasses}>Why should we hire you?</label>
                    <textarea {...register("description", { required: true })} placeholder="Tell us about yourself and why you'd be a great fit... (Max 100 words)" rows={5} className={`${inputClasses} resize-none`} />
                </motion.div>

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(70,185,78,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    type="submit"
                    className="mt-6 p-4 bg-gradient-to-r from-[#46b94e] to-[#3da544] text-black font-bold text-lg rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(70,185,78,0.2)] flex justify-center items-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                </motion.button>
            </motion.form>
        </div>
    );
}