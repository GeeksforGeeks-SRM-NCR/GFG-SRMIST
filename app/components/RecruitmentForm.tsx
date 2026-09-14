"use client";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
} from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitRecruitment } from "@/app/admin/recruitment/actions";
import CustomSelect, {
	branchOptions,
	sectionOptions,
	yearOptions,
} from "@/app/components/CustomSelect";
import { Logo2 } from "@/app/logo/logo2";

type RecruitmentFormValues = {
	name: string;
	email_college: string;
	email_personal: string;
	phone: string;
	reg_no: string;
	year: string;
	section: string;
	branch: string;
	team_preference: string;
	resume_link: string;
	technical_skills?: string;
	design_skills?: string;
	description: string;
};

const springValues = {
	damping: 30,
	stiffness: 100,
	mass: 2,
};

export default function RecruitmentForm() {
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		control,
	} = useForm<RecruitmentFormValues>();
	const selectedTeam = watch("team_preference");

	// Tilt Effect Logic
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useSpring(useMotionValue(0), springValues);
	const rotateY = useSpring(useMotionValue(0), springValues);
	const scale = useSpring(1, springValues);
	const opacity = useSpring(0);

	function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
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

	const cleanPhone = (phone?: string) => {
		if (!phone) return "";
		let digits = phone.replace(/[^0-9]/g, "");
		if (digits.length > 10 && digits.startsWith("91")) {
			digits = digits.slice(2);
		}
		return digits.slice(0, 10);
	};

	const cleanRegNo = (reg?: string) => {
		if (!reg) return "";
		const digits = reg
			.toUpperCase()
			.replace(/^RA/i, "")
			.replace(/[^0-9]/g, "")
			.slice(0, 13);
		return digits ? `RA${digits}` : "";
	};

	const onSubmit = async (data: RecruitmentFormValues) => {
		setSubmitting(true);
		try {
			const payload = {
				name: data.name,
				email_college: data.email_college,
				email_personal: data.email_personal,
				phone: cleanPhone(data.phone),
				reg_no: cleanRegNo(data.reg_no),
				year: parseInt(data.year),
				section: data.section,
				branch: data.branch,
				team_preference: data.team_preference,
				resume_link: data.resume_link,
				technical_skills: data.technical_skills || null,
				design_skills: data.design_skills || null,
				description: data.description,
			};

			console.log("Submitting payload:", payload);

			await submitRecruitment(payload);

			console.log("Successfully submitted application");
			setSubmitted(true);
		} catch (err: unknown) {
			console.error("Error Submitting:", err);
			const message = err instanceof Error ? err.message : "Please try again";
			console.error("Error message:", message);
			alert(`Something went wrong: ${message}`);
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
				<h2 className="text-3xl font-bold mb-4 text-white font-sans">
					Application Received!
				</h2>
				<p className="text-gray-300 text-lg">
					Sit tight! We will review your application and get back to you soon.
				</p>
			</motion.div>
		);
	}

	const inputClasses =
		"w-full p-4 bg-white/5 rounded-xl border border-white/10 focus:border-[#46b94e] focus:bg-white/10 outline-none transition-all duration-300 text-white placeholder-gray-500 focus:shadow-[0_0_20px_rgba(70,185,78,0.2)]";
	const labelClasses = "block text-sm font-medium text-gray-400 mb-2 ml-1";

	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
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
					transformStyle: "preserve-3d",
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

				<motion.div
					variants={itemVariants}
					className="text-center mb-4 transform-gpu translate-z-10"
					style={{ transform: "translateZ(20px)" }}
				>
					<h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#46b94e] to-white animate-gradient-x">
						Join the Team
					</h2>
					<p className="text-gray-400">Be part of something extraordinary.</p>
				</motion.div>

				{/* Basic Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<motion.div variants={itemVariants}>
						<label className={labelClasses}>Full Name</label>
						<input
							{...register("name", { required: true })}
							placeholder="Enter your name"
							className={inputClasses}
						/>
					</motion.div>
					<motion.div variants={itemVariants}>
						<label className={labelClasses}>Registration No.</label>
						<div
							className={`flex items-center w-full bg-white/5 rounded-xl border ${
								errors.reg_no ? "!border-red-500" : "border-white/10"
							} focus-within:border-[#46b94e] focus-within:bg-white/10 transition-all duration-300 focus-within:shadow-[0_0_20px_rgba(70,185,78,0.2)] overflow-hidden`}
						>
							<span className="px-4 py-4 text-white/70 font-semibold text-sm select-none border-r border-white/15 flex-shrink-0">
								RA
							</span>
							<input
								{...register("reg_no", {
									required: "Registration number is required",
									pattern: {
										value: /^[0-9]{13}$/,
										message: "Registration number must be exactly 13 digits",
									},
									minLength: {
										value: 13,
										message: "Registration number must be exactly 13 digits",
									},
									maxLength: {
										value: 13,
										message: "Registration number must be exactly 13 digits",
									},
								})}
								placeholder="2311003010123"
								type="text"
								inputMode="numeric"
								maxLength={13}
								onInput={(e) => {
									const target = e.target as HTMLInputElement;
									let val = target.value.toUpperCase();
									if (val.startsWith("RA")) {
										val = val.replace(/^RA/i, "");
									}
									const numbers = val.replace(/[^0-9]/g, "");
									target.value = numbers.slice(0, 13);
								}}
								className="w-full p-4 bg-transparent outline-none text-white placeholder-gray-500"
							/>
						</div>
						{errors.reg_no && (
							<p className="text-red-500 text-xs mt-1 ml-1">
								{errors.reg_no.message as string}
							</p>
						)}
					</motion.div>
					<motion.div variants={itemVariants}>
						<label className={labelClasses}>College ID</label>
						<input
							{...register("email_college", { required: true })}
							placeholder="Enter your College ID"
							type="email"
							className={inputClasses}
						/>
					</motion.div>
					<motion.div variants={itemVariants}>
						<label className={labelClasses}>Personal Email ID</label>
						<input
							{...register("email_personal", { required: true })}
							placeholder="Enter your Personal Email ID"
							type="email"
							className={inputClasses}
						/>
					</motion.div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<motion.div variants={itemVariants}>
						<label className={labelClasses}>Phone Number</label>
						<div
							className={`flex items-center w-full bg-white/5 rounded-xl border ${
								errors.phone ? "!border-red-500" : "border-white/10"
							} focus-within:border-[#46b94e] focus-within:bg-white/10 transition-all duration-300 focus-within:shadow-[0_0_20px_rgba(70,185,78,0.2)] overflow-hidden`}
						>
							<span className="px-4 py-4 text-white/70 font-semibold text-sm select-none border-r border-white/15 flex-shrink-0">
								+91
							</span>
							<input
								{...register("phone", {
									required: "Phone number is required",
									pattern: {
										value: /^[0-9]{10}$/,
										message: "Phone number must be exactly 10 digits",
									},
									minLength: {
										value: 10,
										message: "Phone number must be exactly 10 digits",
									},
									maxLength: {
										value: 10,
										message: "Phone number must be exactly 10 digits",
									},
								})}
								placeholder="9876543210"
								type="tel"
								inputMode="numeric"
								maxLength={10}
								onInput={(e) => {
									const target = e.target as HTMLInputElement;
									let val = target.value.replace(/[^0-9]/g, "");
									if (val.length > 10 && val.startsWith("91")) {
										val = val.slice(2);
									}
									target.value = val.slice(0, 10);
								}}
								className="w-full p-4 bg-transparent outline-none text-white placeholder-gray-500"
							/>
						</div>
						{errors.phone && (
							<p className="text-red-500 text-xs mt-1 ml-1">
								{errors.phone.message as string}
							</p>
						)}
					</motion.div>
					<motion.div variants={itemVariants} className="relative z-30">
						<label className={labelClasses}>Year</label>
						<CustomSelect
							control={control}
							name="year"
							rules={{ required: "Required" }}
							options={yearOptions}
							placeholder="Select Year"
							className={inputClasses}
						/>
					</motion.div>
					<motion.div variants={itemVariants} className="relative z-30">
						<label className={labelClasses}>Section</label>
						<CustomSelect
							control={control}
							name="section"
							rules={{ required: "Required" }}
							options={sectionOptions}
							placeholder="Select Section"
							className={inputClasses}
						/>
					</motion.div>
				</div>

				<motion.div variants={itemVariants} className="relative z-20">
					<label className={labelClasses}>Branch</label>
					<CustomSelect
						control={control}
						name="branch"
						rules={{ required: "Required" }}
						options={branchOptions}
						placeholder="Select Branch"
						className={inputClasses}
					/>
				</motion.div>

				{/* Team Preference */}
				<motion.div variants={itemVariants} className="relative z-10">
					<label className="block text-lg font-semibold text-[#46b94e] mb-3">
						Preferred Domain
					</label>
					<CustomSelect
						control={control}
						name="team_preference"
						rules={{ required: "Required" }}
						options={[
							{ value: "Technical", label: "Technical Team" },
							{ value: "Events", label: "Events Management Team" },
							{ value: "Corporate", label: "PR Team" },
							{ value: "Creatives", label: "Design & Branding Team" },
							{ value: "Marketing", label: "Marketing Team" },
							{ value: "Social Media", label: "Social Media Team" },
							{ value: "Photography", label: "Photography Team" },
						]}
						placeholder="Select a Team"
						className={`${inputClasses} text-lg`}
					/>
				</motion.div>

				{/* Conditional Skills */}
				<AnimatePresence>
					{selectedTeam === "Technical" && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="overflow-hidden"
						>
							<label className={labelClasses}>Technical Skills</label>
							<div className="flex flex-wrap gap-3 p-2">
								{[
									"React",
									"Node.js",
									"Python",
									"App Dev",
									"AI/ML",
									"Cloud",
									"Blockchain",
									"Cybersecurity",
								].map((skill) => (
									<label key={skill} className="relative group cursor-pointer">
										<input
											type="checkbox"
											value={skill}
											{...register("technical_skills")}
											className="peer sr-only"
										/>
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
					<input
						{...register("resume_link", { required: true })}
						placeholder="Google Drive / LinkedIn / Portfolio"
						type="url"
						className={inputClasses}
					/>
				</motion.div>

				<motion.div variants={itemVariants}>
					<label className={labelClasses}>Why should we hire you?</label>
					<textarea
						{...register("description", { required: true })}
						placeholder="Tell us about yourself and why you'd be a great fit... (Max 100 words)"
						rows={5}
						className={`${inputClasses} resize-none`}
					/>
				</motion.div>

				<motion.button
					variants={itemVariants}
					whileHover={{
						scale: 1.02,
						boxShadow: "0 0 30px rgba(70,185,78,0.4)",
					}}
					whileTap={{ scale: 0.98 }}
					disabled={submitting}
					type="submit"
					className="mt-6 p-4 bg-gradient-to-r from-[#46b94e] to-[#3da544] text-black font-bold text-lg rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(70,185,78,0.2)] flex justify-center items-center gap-2"
				>
					{submitting ? (
						<Loader2 className="animate-spin" />
					) : (
						"Submit Application"
					)}
				</motion.button>
			</motion.form>
		</div>
	);
}
