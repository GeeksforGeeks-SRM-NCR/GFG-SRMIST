"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Check, ChevronDown, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Logo2 } from "@/app/logo/logo2";
import { submitTeamRegistration } from "@/app/actions/team-registration";

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TeamRegistrationForm() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [teamMemberCount, setTeamMemberCount] = useState(0);
    const searchParams = useSearchParams();
    const eventName = searchParams.get('event') || 'General Event Registration';
    const eventSlug = searchParams.get('slug') || '';
    
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        defaultValues: {
            event_name: eventName
        }
    });

    useEffect(() => {
        setValue('event_name', eventName);
    }, [eventName, setValue]);

    // Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);

    function handleMouse(e) {
        if (window.innerWidth < 768) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotateAmplitude = 5;
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
            // Prepare team members data
            const teamMembers = [];
            for (let i = 1; i <= teamMemberCount; i++) {
                teamMembers.push({
                    name: data[`member${i}_name`],
                    reg_no: data[`member${i}_reg_no`],
                    year: data[`member${i}_year`],
                    branch: data[`member${i}_branch`],
                    section: data[`member${i}_section`],
                    email_id: data[`member${i}_email_id`]
                });
            }

            const payload = {
                event_name: eventName,
                team_name: data.team_name,
                college_name: data.college_name,
                leader: {
                    name: data.name,
                    reg_no: data.reg_no,
                    year: data.year,
                    branch: data.branch,
                    section: data.section,
                    email_id: data.email_id
                },
                teamMembers
            };

            console.log('Submitting payload:', payload);

            const result = await submitTeamRegistration(payload);

            if (result.success) {
                console.log('Successfully submitted registration:', result.data);
                setSubmitted(true);
            } else {
                throw new Error(result.message || 'Failed to submit registration');
            }
        } catch (err) {
            console.error('Error Submitting:', err);
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
                <h2 className="text-3xl font-bold mb-4 text-white font-sans">Registration Received!</h2>
                <p className="text-gray-300 text-lg">Your team has been registered successfully. We'll contact you soon with further details!</p>
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

    const renderTeamMemberFields = (memberNumber) => {
        return (
            <motion.div
                key={memberNumber}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-sm"
            >
                <h3 className="text-xl font-bold text-[#46b94e] mb-4">Team Member {memberNumber}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Name</label>
                        <input {...register(`member${memberNumber}_name`, { required: true })} placeholder="Enter name" className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Registration No.</label>
                        <input {...register(`member${memberNumber}_reg_no`, { required: true })} placeholder="Enter Reg No" className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Year</label>
                        <div className="relative">
                            <select {...register(`member${memberNumber}_year`, { required: true })} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" className="text-black">Select Year</option>
                                <option value="1" className="text-black">1st Year</option>
                                <option value="2" className="text-black">2nd Year</option>
                                <option value="3" className="text-black">3rd Year</option>
                                <option value="4" className="text-black">4th Year</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Branch</label>
                        <input {...register(`member${memberNumber}_branch`, { required: true })} placeholder="CSE, ECE, etc." className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Section</label>
                        <input {...register(`member${memberNumber}_section`, { required: true })} placeholder="A, B, C..." className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Email ID</label>
                        <input {...register(`member${memberNumber}_email_id`, { required: true })} placeholder="email@example.com" type="email" className={inputClasses} />
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div
            className="perspective-1000 w-full max-w-4xl mx-auto"
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
                    <Link href={eventSlug ? `/pages/events/${eventSlug}` : "/pages/events"}>
                        <motion.button
                            whileHover={{ scale: 1.1, x: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#46b94e] hover:border-[#46b94e]/50 transition-colors backdrop-blur-md"
                            type="button"
                        >
                            <ChevronDown className="rotate-90" size={24} />
                        </motion.button>
                    </Link>
                </div>

                {/* Logo */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center mb-6"
                >
                    <div className="w-32 md:w-40">
                        <Logo2 />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center mb-4">
                    <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#46b94e] to-white">Team Registration</h2>
                    <p className="text-gray-400">Register your team for the event</p>
                </motion.div>

                {/* Event Name */}
                <motion.div variants={itemVariants}>
                    <label className="block text-lg font-semibold text-[#46b94e] mb-3">Event Name</label>
                    <div className="w-full p-4 bg-[#46b94e]/10 rounded-xl border border-[#46b94e]/30 text-white font-medium">
                        {eventName}
                    </div>
                    <input type="hidden" {...register("event_name")} value={eventName} />
                </motion.div>

                {/* Team Name */}
                <motion.div variants={itemVariants}>
                    <label className={labelClasses}>Team Name</label>
                    <input {...register("team_name", { required: true })} placeholder="Enter your team name (e.g., Code Warriors)" className={inputClasses} />
                </motion.div>

                {/* College Name */}
                <motion.div variants={itemVariants}>
                    <label className={labelClasses}>College Name</label>
                    <input 
                        {...register("college_name", { required: true })} 
                        defaultValue="SRM Institute of Science and Technology"
                        placeholder="Edit if from different college" 
                        className={inputClasses} 
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">Default: SRM Institute of Science and Technology (Edit if different)</p>
                </motion.div>

                {/* Team Leader Details */}
                <motion.div variants={itemVariants} className="border border-[#46b94e]/30 rounded-2xl p-6 bg-[#46b94e]/5">
                    <h3 className="text-2xl font-bold text-[#46b94e] mb-4">Team Leader Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Name</label>
                            <input {...register("name", { required: true })} placeholder="Enter your name" className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Registration No.</label>
                            <input {...register("reg_no", { required: true })} placeholder="Enter your Reg No" className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Year</label>
                            <div className="relative">
                                <select {...register("year", { required: true })} className={`${inputClasses} appearance-none cursor-pointer`}>
                                    <option value="" className="text-black">Select Year</option>
                                    <option value="1" className="text-black">1st Year</option>
                                    <option value="2" className="text-black">2nd Year</option>
                                    <option value="3" className="text-black">3rd Year</option>
                                    <option value="4" className="text-black">4th Year</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Branch</label>
                            <input {...register("branch", { required: true })} placeholder="CSE, ECE, etc." className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Section</label>
                            <input {...register("section", { required: true })} placeholder="A, B, C..." className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Email ID</label>
                            <input {...register("email_id", { required: true })} placeholder="email@example.com" type="email" className={inputClasses} />
                        </div>
                    </div>
                </motion.div>

                {/* Team Members Section */}
                <motion.div variants={itemVariants}>
                    <label className="block text-lg font-semibold text-[#46b94e] mb-3">Number of Team Members</label>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <select 
                                value={teamMemberCount}
                                onChange={(e) => setTeamMemberCount(parseInt(e.target.value))}
                                className={`${inputClasses} appearance-none cursor-pointer text-lg`}
                            >
                                <option value="0" className="text-black">Select team size</option>
                                {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num} className="text-black">{num} Member{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#46b94e] pointer-events-none" size={24} />
                        </div>
                    </div>
                </motion.div>

                {/* Dynamic Team Member Forms */}
                <AnimatePresence>
                    {teamMemberCount > 0 && (
                        <motion.div className="space-y-4">
                            {Array.from({ length: teamMemberCount }, (_, i) => renderTeamMemberFields(i + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>



                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(70,185,78,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    type="submit"
                    className="mt-6 p-4 bg-gradient-to-r from-[#46b94e] to-[#3da544] text-black font-bold text-lg rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(70,185,78,0.2)] flex justify-center items-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : "Submit Registration"}
                </motion.button>
            </motion.form>
        </div>
    );
}
