"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Check, ChevronDown, Plus, Minus, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Logo2 } from "@/app/logo/logo2";
import { submitTeamRegistration } from "@/app/actions/team-registration";
import CustomSelect, { yearOptions, branchOptions, sectionOptions } from "@/app/components/CustomSelect";

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TeamRegistrationForm({ eventName: propEventName, noMembers = "4" }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const errorScrollRef = useRef(null);

    // Parse noMembers string into min and max
    const parts = String(noMembers || "4").split('-').map(s => parseInt(s.trim(), 10));
    const minMembers = (!isNaN(parts[0]) && parts[0] > 0) ? parts[0] : 1;
    const maxMembers = (parts.length > 1 && !isNaN(parts[1])) ? parts[1] : minMembers;

    // Remove the Team Leader from the count of "Additional Members"
    // So if the form takes 2-4 total members, additional members are 1-3
    const minAdditional = Math.max(0, minMembers - 1);
    const maxAdditional = Math.max(0, maxMembers - 1);

    const [teamMemberCount, setTeamMemberCount] = useState(minAdditional);
    const searchParams = useSearchParams();
    const eventName = propEventName || searchParams.get('event') || 'General Event Registration';
    const eventSlug = searchParams.get('slug') || '';

    const { register, handleSubmit, watch, formState: { errors }, setValue, control } = useForm({
        defaultValues: {
            event_name: eventName
        }
    });

    useEffect(() => {
        setValue('event_name', eventName);
    }, [eventName, setValue]);

    const onSubmit = async (data) => {
        setSubmitting(true);
        setErrorMessage("");
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
                    email_id: data[`member${i}_email_id`],
                    phone_number: data[`member${i}_phone_number`]
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
                    section: data.section,
                    email_id: data.email_id,
                    phone_number: data.phone_number
                },
                teamMembers
            };

            console.log('Submitting payload:', payload);

            const result = await submitTeamRegistration(payload);

            if (result.success) {
                console.log('Successfully submitted registration:', result.data);
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error(result.message || 'Failed to submit registration');
            }
        } catch (err) {
            console.error('Error Submitting:', err);
            setErrorMessage(err.message || 'Please try again');
            if (errorScrollRef.current) {
                errorScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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

    const inputClasses = "w-full p-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-[#46b94e] focus:bg-[#46b94e]/5 outline-none transition-all duration-300 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#46b94e]/20 focus:shadow-[0_0_20px_rgba(70,185,78,0.15)]";
    const labelClasses = "block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1";

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
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="border border-white/5 rounded-3xl p-6 md:p-8 bg-gradient-to-b from-white/5 to-transparent relative group hover:border-white/10 transition-colors"
                style={{ zIndex: 50 - memberNumber }}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-transparent opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-sm border border-white/20">{memberNumber + 1}</span>
                        Team Member {memberNumber + 1}
                    </h3>
                    {memberNumber > minAdditional && memberNumber === teamMemberCount && (
                        <button
                            type="button"
                            onClick={() => setTeamMemberCount(prev => prev - 1)}
                            className="text-red-400 hover:text-white hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                        >
                            <Minus size={14} /> Remove
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Name</label>
                        <input {...register(`member${memberNumber}_name`, { required: true })} placeholder="Enter name" className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Registration No.</label>
                        <input {...register(`member${memberNumber}_reg_no`, {
                            required: "Required",
                            pattern: {
                                value: /^RA\d{13}$/i,
                                message: "Must start with RA and exactly 13 digits"
                            }
                        })}
                            placeholder="RAxxxxxxxxxxxxx"
                            maxLength={15}
                            onInput={(e) => {
                                let val = e.target.value.toUpperCase();
                                if (!val.startsWith('RA')) {
                                    val = 'RA' + val.replace(/^RA/i, '');
                                }
                                const numbers = val.substring(2).replace(/[^0-9]/g, '');
                                e.target.value = 'RA' + numbers.substring(0, 13);
                            }}
                            className={`${inputClasses} ${errors[`member${memberNumber}_reg_no`] ? '!border-red-500' : ''}`}
                        />
                        {errors[`member${memberNumber}_reg_no`] && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors[`member${memberNumber}_reg_no`].message}</p>
                        )}
                    </div>
                    <div className="relative z-[50]">
                        <label className={labelClasses}>Year</label>
                        <CustomSelect
                            control={control}
                            name={`member${memberNumber}_year`}
                            rules={{ required: "Required" }}
                            options={yearOptions}
                            placeholder="Select Year"
                            className={inputClasses}
                        />
                    </div>
                    <div className="relative z-[40]">
                        <label className={labelClasses}>Branch</label>
                        <CustomSelect
                            control={control}
                            name={`member${memberNumber}_branch`}
                            rules={{ required: "Required" }}
                            options={branchOptions}
                            placeholder="Select Branch"
                            className={inputClasses}
                        />
                    </div>
                    <div className="relative z-[30]">
                        <label className={labelClasses}>Section</label>
                        <CustomSelect
                            control={control}
                            name={`member${memberNumber}_section`}
                            rules={{ required: "Required" }}
                            options={sectionOptions}
                            placeholder="Select Section"
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Email ID</label>
                        <input {...register(`member${memberNumber}_email_id`, { required: true })} placeholder="email@example.com" type="email" className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Phone Number</label>
                        <input
                            {...register(`member${memberNumber}_phone_number`, {
                                required: true,
                                pattern: { value: /^[0-9]{10}$/, message: "Invalid Phone Number" },
                                minLength: 10,
                                maxLength: 10
                            })}
                            placeholder="Enter Your Mobile No."
                            type="tel"
                            maxLength={10}
                            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); }}
                            className={inputClasses}
                        />
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 p-6 md:p-10 bg-[#0a0a0a]/90 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden"
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

                <motion.div variants={itemVariants} className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#46b94e]/10 border border-[#46b94e]/20 text-[#46b94e] text-sm font-semibold mb-4 tracking-wide uppercase">
                        Registration Form
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                        Secure Your Spot
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto">Fill in the details below to register your team for this event and secure your participation.</p>
                </motion.div>

                {/* Error Message Popup */}
                <AnimatePresence>
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 md:p-5 flex items-start gap-4 backdrop-blur-md relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <div className="bg-red-500/20 p-2 rounded-full shrink-0">
                                <AlertCircle size={24} className="text-red-400" />
                            </div>
                            <div className="flex-1 pr-6">
                                <h4 className="text-red-400 font-bold mb-1">Registration Error</h4>
                                <p className="text-red-200/80 text-sm leading-relaxed">{errorMessage}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setErrorMessage("")}
                                className="absolute right-4 top-4 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Event Name */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#46b94e]/20 to-transparent p-6 rounded-2xl border-l-4 border-[#46b94e] backdrop-blur-sm">
                    <label className="block text-sm font-bold text-[#46b94e] uppercase tracking-wider mb-2">Selected Event</label>
                    <div className="text-2xl font-bold text-white">
                        {eventName}
                    </div>
                    <input type="hidden" {...register("event_name")} value={eventName} />
                </motion.div>

                {/* Team Name */}
                <motion.div variants={itemVariants} ref={errorScrollRef}>
                    <label className={labelClasses}>Team Name</label>
                    <input {...register("team_name", { required: true })} placeholder="Enter your team name (e.g., Code Warriors)" className={inputClasses} />
                </motion.div>

                {/* College Name */}
                <motion.div variants={itemVariants}>
                    <label className={labelClasses}>College / Institution Name</label>
                    <input
                        {...register("college_name", { required: true })}
                        defaultValue="SRM Institute of Science and Technology"
                        placeholder="Edit if from different college"
                        className={inputClasses}
                    />
                    <p className="text-[11px] text-gray-500 mt-2 ml-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#46b94e]/50"></span>
                        Defaults to SRM Institute of Science and Technology
                    </p>
                </motion.div>

                {/* Team Leader Details */}
                <motion.div variants={itemVariants} className="border border-white/5 rounded-3xl p-6 md:p-8 bg-gradient-to-b from-white/5 to-transparent relative group hover:border-white/10 transition-colors" style={{ zIndex: 60 }}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#46b94e] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#46b94e] text-black text-sm">1</span>
                        Team Leader Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Name</label>
                            <input {...register("name", { required: true })} placeholder="Enter your name" className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Registration No.</label>
                            <input {...register("reg_no", {
                                required: "Required",
                                pattern: {
                                    value: /^RA\d{13}$/i,
                                    message: "Must start with RA and exactly 13 digits"
                                }
                            })}
                                placeholder="RAxxxxxxxxxxxxx"
                                maxLength={15}
                                onInput={(e) => {
                                    let val = e.target.value.toUpperCase();
                                    if (!val.startsWith('RA')) {
                                        val = 'RA' + val.replace(/^RA/i, '');
                                    }
                                    const numbers = val.substring(2).replace(/[^0-9]/g, '');
                                    e.target.value = 'RA' + numbers.substring(0, 13);
                                }}
                                className={`${inputClasses} ${errors.reg_no ? '!border-red-500' : ''}`}
                            />
                            {errors.reg_no && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.reg_no.message}</p>
                            )}
                        </div>
                        <div className="relative z-[50]">
                            <label className={labelClasses}>Year</label>
                            <CustomSelect
                                control={control}
                                name="year"
                                rules={{ required: "Required" }}
                                options={yearOptions}
                                placeholder="Select Year"
                                className={inputClasses}
                            />
                        </div>
                        <div className="relative z-[40]">
                            <label className={labelClasses}>Branch</label>
                            <CustomSelect
                                control={control}
                                name="branch"
                                rules={{ required: "Required" }}
                                options={branchOptions}
                                placeholder="Select Branch"
                                className={inputClasses}
                            />
                        </div>
                        <div className="relative z-[30]">
                            <label className={labelClasses}>Section</label>
                            <CustomSelect
                                control={control}
                                name="section"
                                rules={{ required: "Required" }}
                                options={sectionOptions}
                                placeholder="Select Section"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Email ID</label>
                            <input {...register("email_id", { required: true })} placeholder="email@example.com" type="email" className={inputClasses} />
                        </div>
                        <div>
                            <label className={labelClasses}>Phone Number</label>
                            <input
                                {...register("phone_number", {
                                    required: true,
                                    pattern: { value: /^[0-9]{10}$/, message: "Invalid Phone Number" },
                                    minLength: 10,
                                    maxLength: 10
                                })}
                                placeholder="10-digit Mobile No."
                                type="tel"
                                maxLength={10}
                                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); }}
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Team Members Section */}
                {maxAdditional > 0 && (
                    <motion.div variants={itemVariants} className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <label className="block text-lg font-bold text-white mb-1">Additional Team Members</label>
                            <p className="text-gray-400 text-sm">Add up to {maxAdditional} additional members (Currently: {teamMemberCount}).</p>
                        </div>
                        {teamMemberCount < maxAdditional && (
                            <button
                                type="button"
                                onClick={() => setTeamMemberCount(prev => prev + 1)}
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-5 py-3 font-semibold transition-all flex items-center justify-center gap-2 group shrink-0"
                            >
                                <Plus size={18} className="text-[#46b94e] group-hover:scale-110 transition-transform" /> Add Member
                            </button>
                        )}
                    </motion.div>
                )}

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
                    className="mt-6 p-4 bg-gradient-to-r from-[#46b94e] to-[#3da544] text-black font-bold text-lg rounded-2xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(70,185,78,0.2)] flex justify-center items-center gap-2 tracking-wide"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : "Submit Registration"}
                </motion.button>
            </motion.form>
        </div>
    );
}
