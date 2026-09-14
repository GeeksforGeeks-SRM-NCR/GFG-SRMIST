"use client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { type FieldError, useFieldArray, useForm } from "react-hook-form";
import CustomSelect, {
	branchOptions,
	sectionOptions,
	yearOptions,
} from "@/app/components/CustomSelect";
import { supabase } from "@/lib/supabase";

type MemberFields = {
	name: string;
	year: string;
	section: string;
	branch: string;
	email: string;
	regNumber: string;
	phone: string;
};

type RegistrationFormValues = {
	team_name: string;
	college_name: string;
	members: MemberFields[];
};

export default function EventRegistrationForm({
	eventName,
	noMembers = "4",
}: {
	eventName: string;
	noMembers?: string;
}) {
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	// Parse noMembers string into min and max
	const parts = String(noMembers)
		.split("-")
		.map((s) => parseInt(s.trim(), 10));
	const minMembers = !isNaN(parts[0]!) && parts[0]! > 0 ? parts[0]! : 1;
	const maxMembers =
		parts.length > 1 && !isNaN(parts[1]!) ? parts[1]! : minMembers;

	// Initial members array dynamically set to the minimum number of required members
	const initialMembers = Array.from({ length: minMembers! }, () => ({
		name: "",
		year: "",
		section: "",
		branch: "",
		email: "",
		regNumber: "",
		phone: "",
	}));

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<RegistrationFormValues>({
		defaultValues: {
			members: initialMembers,
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "members",
	});

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

	const onSubmit = async (data: RegistrationFormValues) => {
		setSubmitting(true);
		try {
			const payload = {
				event_name: eventName || "General Event",
				team_name: data.team_name,
				college_name: data.college_name,
				members: data.members.map((m) => ({
					...m,
					phone: cleanPhone(m.phone),
					regNumber: cleanRegNo(m.regNumber),
				})),
			};

			const { error } = await supabase.from("registrations").insert([payload]);
			if (error) throw error;
			setSubmitted(true);
		} catch (error) {
			console.error(error);
			alert("Error registering team.");
		} finally {
			setSubmitting(false);
		}
	};

	if (submitted)
		return (
			<div className="text-center text-[#46b94e] text-2xl font-bold p-10">
				Registration Successful! 🎉
			</div>
		);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-4xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-white"
		>
			<h2 className="text-2xl font-bold mb-6 text-center text-[#46b94e]">
				Register for {eventName}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<input
					{...register("team_name", { required: true })}
					placeholder="Team Name"
					className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none"
				/>
				<input
					{...register("college_name", { required: true })}
					placeholder="College Name"
					className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none"
				/>
			</div>

			<div className="space-y-6 mb-8">
				<label className="text-lg font-semibold border-b border-gray-700 pb-2 flex justify-between items-center">
					<span>Team Members</span>
					<span className="text-sm font-normal text-gray-400">
						{minMembers === maxMembers
							? `Total Members Required: ${minMembers}`
							: `Members: ${minMembers} to ${maxMembers}`}
					</span>
				</label>

				{fields.map((field, index) => (
					<div
						key={field.id}
						className="p-4 bg-white/5 border border-white/5 rounded-xl transition-all duration-300 relative"
						style={{ zIndex: 50 - index }}
					>
						<div className="mb-4 text-[#46b94e] font-semibold flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#46b94e]/20 text-xs text-white">
									{index + 1}
								</span>
								{index === 0 ? "Team Leader" : `Member ${index + 1}`}
							</div>

							{index >= minMembers! && (
								<button
									type="button"
									onClick={() => remove(index)}
									className="text-red-400 hover:text-white hover:bg-red-500/20 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
								>
									<Trash2 size={16} /> Remove
								</button>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<input
								{...register(`members.${index}.name`, { required: true })}
								placeholder="Full Name *"
								className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500"
							/>
							<div className="flex flex-col">
								<div
									className={`flex items-center w-full bg-white/10 rounded-lg border ${
										(
											errors.members?.[index] as {
												regNumber?: import("react-hook-form").FieldError;
											}
										)?.regNumber
											? "border-red-500"
											: "border-white/20"
									} focus-within:border-[#46b94e] transition-all overflow-hidden`}
								>
									<span className="px-3.5 py-3 text-white/70 font-semibold text-sm select-none border-r border-white/20 flex-shrink-0">
										RA
									</span>
									<input
										{...register(`members.${index}.regNumber`, {
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
										className="w-full p-3 bg-transparent outline-none text-white placeholder:text-gray-500"
									/>
								</div>
								{(
									errors.members?.[index] as {
										regNumber?: import("react-hook-form").FieldError;
									}
								)?.regNumber && (
									<span className="text-red-500 text-xs mt-1 ml-1">
										{
											(
												errors.members?.[index] as {
													regNumber?: import("react-hook-form").FieldError;
												}
											)?.regNumber?.message
										}
									</span>
								)}
							</div>
							<input
								{...register(`members.${index}.email`, { required: true })}
								placeholder="Email Address *"
								type="email"
								className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500"
							/>

							<div
								className={`flex items-center w-full bg-white/10 rounded-lg border ${
									(
										errors.members?.[index] as {
											phone?: import("react-hook-form").FieldError;
										}
									)?.phone
										? "border-red-500"
										: "border-white/20"
								} focus-within:border-[#46b94e] transition-all overflow-hidden`}
							>
								<span className="px-3.5 py-3 text-white/70 font-semibold text-sm select-none border-r border-white/20 flex-shrink-0">
									+91
								</span>
								<input
									{...register(`members.${index}.phone`, {
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
									className="w-full p-3 bg-transparent outline-none text-white placeholder:text-gray-500"
								/>
							</div>
							{(
								errors.members?.[index] as {
									phone?: import("react-hook-form").FieldError;
								}
							)?.phone && (
								<p className="text-red-500 text-xs mt-1 ml-1">
									{
										(
											errors.members?.[index] as {
												phone?: import("react-hook-form").FieldError;
											}
										)?.phone?.message
									}
								</p>
							)}
							<div className="relative z-30">
								<CustomSelect
									control={control}
									name={`members.${index}.year`}
									rules={{ required: "Required" }}
									options={yearOptions}
									placeholder="Year *"
									className="p-3 w-full bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500"
								/>
							</div>

							<div className="grid grid-cols-2 gap-2 relative z-20">
								<CustomSelect
									control={control}
									name={`members.${index}.branch`}
									rules={{ required: "Required" }}
									options={branchOptions}
									placeholder="Branch *"
									className="p-3 w-full bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500"
								/>
								<CustomSelect
									control={control}
									name={`members.${index}.section`}
									rules={{ required: "Required" }}
									options={sectionOptions}
									placeholder="Section *"
									className="p-3 w-full bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500"
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{fields.length < maxMembers! && (
				<button
					type="button"
					onClick={() =>
						append({
							name: "",
							year: "",
							section: "",
							branch: "",
							email: "",
							regNumber: "",
							phone: "",
						})
					}
					className="w-full flex justify-center items-center gap-2 text-[#46b94e] hover:bg-[#46b94e]/10 py-3 rounded-xl transition-colors mb-6 font-semibold border border-[#46b94e]/30 border-dashed"
				>
					<Plus size={20} /> Add Next Member ({fields.length + 1})
				</button>
			)}

			<button
				disabled={submitting}
				type="submit"
				className="w-full p-4 bg-[#46b94e] text-black text-lg font-bold rounded-xl hover:bg-[#3da544] transition flex justify-center items-center shadow-lg shadow-green-500/20 active:scale-[0.98]"
			>
				{submitting ? (
					<Loader2 className="animate-spin mr-2" />
				) : (
					"Complete Registration"
				)}
			</button>
		</form>
	);
}
