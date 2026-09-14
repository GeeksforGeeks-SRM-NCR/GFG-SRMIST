"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Code2,
	Copy,
	ExternalLink,
	FileDown,
	FileText,
	GraduationCap,
	Mail,
	MessageSquare,
	Phone,
	Search,
	User,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { fetchRecruitments, toggleRecruitmentStatus } from "./actions";

interface Recruitment {
	name?: string;
	reg_no?: string;
	email_personal?: string;
	email_college?: string;
	phone?: string;
	year?: number;
	branch?: string;
	section?: string;
	team_preference?: string;
	techincal_skills?: string;
	design_skills?: string;
	description?: string;
	resume_link?: string;
	created_at?: string;
}

interface RecruitmentManagerProps {
	initialRecruitmentStatus: boolean;
	initialData?: Recruitment[];
}

export default function RecruitmentManager({
	initialRecruitmentStatus,
	initialData = [],
}: RecruitmentManagerProps) {
	const [isRecruitmentOpen, setIsRecruitmentOpen] = useState<boolean>(
		initialRecruitmentStatus,
	);
	const [isPending, startTransition] = useTransition();

	const [recruitments, setRecruitments] = useState<Recruitment[]>(initialData);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [activeDomain, setActiveDomain] = useState<string>("All Domains");
	const [selectedModalList, setSelectedModalList] = useState<Recruitment[]>([]);
	const [selectedApplicantIndex, setSelectedApplicantIndex] = useState<
		number | null
	>(null);
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const [mounted, setMounted] = useState<boolean>(false);

	const selectedApplicant =
		selectedApplicantIndex !== null && selectedModalList[selectedApplicantIndex]
			? selectedModalList[selectedApplicantIndex]
			: null;

	const openApplicantModal = (index: number, list: Recruitment[]) => {
		setSelectedModalList(list);
		setSelectedApplicantIndex(index);
	};

	const closeApplicantModal = () => {
		setSelectedApplicantIndex(null);
	};

	const handlePrevApplicant = () => {
		setSelectedApplicantIndex((prev) =>
			prev !== null && prev > 0 ? prev - 1 : prev,
		);
	};

	const handleNextApplicant = () => {
		setSelectedApplicantIndex((prev) =>
			prev !== null && prev < selectedModalList.length - 1 ? prev + 1 : prev,
		);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	// Lock body scroll and listen for Escape / Arrow keys when modal is open
	useEffect(() => {
		if (selectedApplicantIndex !== null) {
			document.body.style.overflow = "hidden";
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					setSelectedApplicantIndex(null);
				} else if (e.key === "ArrowLeft") {
					setSelectedApplicantIndex((prev) =>
						prev !== null && prev > 0 ? prev - 1 : prev,
					);
				} else if (e.key === "ArrowRight") {
					setSelectedApplicantIndex((prev) =>
						prev !== null && prev < selectedModalList.length - 1
							? prev + 1
							: prev,
					);
				}
			};
			window.addEventListener("keydown", handleKeyDown);
			return () => {
				document.body.style.overflow = "";
				window.removeEventListener("keydown", handleKeyDown);
			};
		} else {
			document.body.style.overflow = "";
		}
	}, [selectedApplicantIndex, selectedModalList.length]);

	const handleCopy = (text: string, fieldName: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(fieldName);
		setTimeout(() => setCopiedField(null), 2000);
	};

	const handleToggle = async () => {
		const newState = !isRecruitmentOpen;
		setIsRecruitmentOpen(newState);

		startTransition(async () => {
			try {
				await toggleRecruitmentStatus(newState);
			} catch (error: unknown) {
				console.error("Failed to toggle status:", error);
				setIsRecruitmentOpen(!newState);
				alert("Failed to update recruitment status");
			}
		});
	};

	const DOMAIN_MAP: Record<string, string[]> = {
		Creative: ["Creative", "Creatives", "Photography"],
		"Event Management": ["Events", "Event Management"],
		"PR & Marketing": ["Corporate", "PR", "Marketing", "PR & Marketing"],
		"Social Media": ["Social Media"],
		Technical: ["Technical"],
	};

	const getMappedDomain = (preference: string | undefined): string => {
		if (!preference) return "Other";
		const pref = preference.toLowerCase();
		for (const [domain, aliases] of Object.entries(DOMAIN_MAP)) {
			if (aliases.some((alias) => pref.includes(alias.toLowerCase()))) {
				return domain;
			}
		}
		return "Other";
	};

	const getDomainStyle = (preference: string | undefined) => {
		const domain = getMappedDomain(preference);
		switch (domain) {
			case "Technical":
				return {
					badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
					glow: "from-emerald-500/20",
					accent: "text-emerald-400",
					border: "border-emerald-500/30",
				};
			case "Creative":
				return {
					badge: "bg-pink-500/20 text-pink-300 border-pink-500/30",
					glow: "from-pink-500/20",
					accent: "text-pink-400",
					border: "border-pink-500/30",
				};
			case "Event Management":
				return {
					badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
					glow: "from-blue-500/20",
					accent: "text-blue-400",
					border: "border-blue-500/30",
				};
			case "PR & Marketing":
				return {
					badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
					glow: "from-amber-500/20",
					accent: "text-amber-400",
					border: "border-amber-500/30",
				};
			case "Social Media":
				return {
					badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
					glow: "from-purple-500/20",
					accent: "text-purple-400",
					border: "border-purple-500/30",
				};
			default:
				return {
					badge: "bg-green-500/20 text-green-300 border-green-500/30",
					glow: "from-green-500/20",
					accent: "text-green-400",
					border: "border-green-500/30",
				};
		}
	};

	const parseSkills = (skills?: unknown): string[] => {
		if (!skills) return [];
		if (Array.isArray(skills)) {
			return skills.map((s) => String(s).trim()).filter(Boolean);
		}
		if (typeof skills === "string") {
			return skills
				.split(/[,;\n]/)
				.map((s) => s.trim())
				.filter(Boolean);
		}
		if (typeof skills === "object") {
			return Object.values(skills as Record<string, unknown>)
				.map((s) => String(s).trim())
				.filter(Boolean);
		}
		return [String(skills).trim()].filter(Boolean);
	};

	const getInitials = (name?: string) => {
		if (!name) return "U";
		const parts = name.trim().split(" ");
		if (parts.length >= 2) {
			return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	};

	const truncateName = (name?: string, maxLength = 11) => {
		if (!name) return "Untitled Applicant";
		if (name.length <= maxLength) return name;
		return `${name.slice(0, maxLength)}...`;
	};

	// eslint-disable-next-line react-hooks/preserve-manual-memoization
	const stats = useMemo((): Record<string, number> => {
		const counts: Record<string, number> = {
			"All Domains": recruitments.length,
		};

		Object.keys(DOMAIN_MAP).forEach((domain) => {
			counts[domain] = recruitments.filter(
				(r) => getMappedDomain(r.team_preference) === domain,
			).length;
		});

		counts["Other"] = recruitments.filter(
			(r) => getMappedDomain(r.team_preference) === "Other",
		).length;

		return counts;
	}, [recruitments]);

	// eslint-disable-next-line react-hooks/preserve-manual-memoization
	const filteredRecruitments = useMemo(() => {
		return recruitments.filter((r) => {
			const matchesSearch =
				r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.email_personal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.email_college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.reg_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.team_preference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.branch?.toLowerCase().includes(searchTerm.toLowerCase());

			const mappedDomain = getMappedDomain(r.team_preference);
			const matchesDomain =
				activeDomain === "All Domains" || mappedDomain === activeDomain;

			return matchesSearch && matchesDomain;
		});
	}, [recruitments, searchTerm, activeDomain]);

	const handleExportPDF = () => {
		if (filteredRecruitments.length === 0) {
			alert("No data to export");
			return;
		}

		const doc = new jsPDF();
		doc.setFontSize(20);
		doc.text("Recruitment Applications Report", 14, 20);
		doc.setFontSize(10);
		doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
		doc.text(`Total Applications: ${filteredRecruitments.length}`, 14, 34);

		const tableData = filteredRecruitments.map((row) => [
			row.name || "N/A",
			row.reg_no || "N/A",
			row.email_personal || "N/A",
			row.phone || "N/A",
			row.year || "N/A",
			row.branch || "N/A",
			row.team_preference || "N/A",
			row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A",
		]);

		autoTable(doc, {
			startY: 40,
			head: [
				[
					"Name",
					"Reg No",
					"Email",
					"Phone",
					"Year",
					"Branch",
					"Domain",
					"Date",
				],
			],
			body: tableData,
			theme: "grid",
			headStyles: { fillColor: [34, 197, 94] },
			styles: { fontSize: 8 },
		});

		doc.save(
			`recruitment-export-${activeDomain}-${new Date().toISOString().split("T")[0]}.pdf`,
		);
	};

	const exportSinglePDF = (applicant: Recruitment) => {
		const doc = new jsPDF();
		doc.setFontSize(20);
		doc.text("Applicant Details", 14, 20);

		const details = [
			["Name", applicant.name || "N/A"],
			["Registration Number", applicant.reg_no || "N/A"],
			["Email (Personal)", applicant.email_personal || "N/A"],
			["Email (College)", applicant.email_college || "N/A"],
			["Phone", applicant.phone || "N/A"],
			["Year", applicant.year ? `${applicant.year}` : "N/A"],
			["Branch", applicant.branch || "N/A"],
			["Section", applicant.section || "N/A"],
			["Domain Preference", applicant.team_preference || "N/A"],
			["Technical Skills", applicant.techincal_skills || "N/A"],
			["Design Skills", applicant.design_skills || "N/A"],
			["Description", applicant.description || "N/A"],
			["Resume Link", applicant.resume_link || "N/A"],
			[
				"Applied Date",
				applicant.created_at
					? new Date(applicant.created_at).toLocaleString()
					: "N/A",
			],
		];

		autoTable(doc, {
			startY: 30,
			body: details as unknown as import("jspdf-autotable").RowInput[],
			theme: "plain",
			styles: { fontSize: 10, cellPadding: 2 },
		});

		doc.save(
			`${(applicant.name || "applicant").replace(/\s+/g, "_")}_application.pdf`,
		);
	};

	const availableDomains = useMemo(() => {
		const base = ["All Domains", ...Object.keys(DOMAIN_MAP)];
		if ((stats["Other"] ?? 0) > 0) base.push("Other");
		return base;
	}, [stats]);

	return (
		<div className="space-y-8">
			{/* Top Bar: Search and Actions */}
			<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
				<div className="relative w-full md:w-96 group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<Search className="w-5 h-5 text-white/30 group-focus-within:text-white/50 transition-colors" />
					</div>
					<input
						type="text"
						placeholder="Search by name, email, reg no, branch..."
						value={searchTerm}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchTerm(e.target.value)
						}
						className="w-full bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-[#111111] transition-all"
					/>
				</div>

				<div className="flex items-center gap-4 w-full md:w-auto">
					<div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3.5 flex items-center gap-2">
						<span className="text-white/40 text-sm font-medium">Total:</span>
						<span className="text-white font-bold text-lg">
							{stats["All Domains"]}
						</span>
					</div>
					<button
						onClick={handleExportPDF}
						className="flex-1 md:flex-none bg-white text-black font-bold py-3.5 px-8 rounded-2xl border border-white/10 hover:bg-white/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
					>
						<FileDown className="w-4 h-4" />
						Export All to PDF
					</button>
				</div>
			</div>

			{/* Domain Filters */}
			<div className="flex flex-wrap gap-3">
				{availableDomains.map((domain) => (
					<button
						key={domain}
						onClick={() => setActiveDomain(domain)}
						className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border flex items-center gap-2 ${activeDomain === domain
							? "bg-white text-black border-white shadow-lg"
							: "bg-[#111111]/80 text-white/60 border-white/5 hover:border-white/20 hover:bg-[#111111]"
							}`}
					>
						{domain}
						<span
							className={`text-xs ml-1 ${activeDomain === domain ? "text-black/60" : "text-white/30"}`}
						>
							({stats[domain] || 0})
						</span>
					</button>
				))}
			</div>

			{/* Applications Table */}
			<div className="space-y-8">
				{(activeDomain === "All Domains"
					? availableDomains.filter((d) => d !== "All Domains")
					: [activeDomain]
				).map((domain) => {
					const domainApps = filteredRecruitments.filter(
						(r) => getMappedDomain(r.team_preference) === domain,
					);
					if (domainApps.length === 0 && activeDomain !== "All Domains")
						return null;
					if (domainApps.length === 0 && activeDomain !== "All Domains")
						return (
							<div
								key={domain}
								className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 text-center"
							>
								<p className="text-white/40">
									No applicants found for this domain.
								</p>
							</div>
						);
					if (domainApps.length === 0) return null;

					return (
						<div
							key={domain}
							className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden"
						>
							<div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
								<h3 className="text-2xl font-bold text-white">{domain}</h3>
								<span className="bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-white/60">
									{domainApps.length} applicants
								</span>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full text-left">
									<thead>
										<tr className="text-white/40 text-[0.8rem] border-b border-white/5 uppercase tracking-wider">
											<th className="px-4 py-3.5 font-bold">Name</th>
											<th className="px-3 py-3.5 font-bold">Reg. No.</th>
											<th className="px-3 py-3.5 font-bold">Email</th>
											<th className="px-3 py-3.5 font-bold">Phone</th>
											<th className="px-3 py-3.5 font-bold">Year</th>
											<th className="px-3 py-3.5 font-bold">Branch & Sec</th>
											<th className="px-3 py-3.5 font-bold">Date</th>
											<th className="px-4 py-3.5 font-bold text-right">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="text-white/80">
										{domainApps.map((row, idx) => (
											<tr
												key={idx}
												onClick={() => openApplicantModal(idx, domainApps)}
												className="border-b border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group"
											>
												<td className="px-4 py-3.5 font-medium text-white text-sm whitespace-nowrap">
													<div className="flex items-center gap-3">
														<div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:scale-105 group-hover:border-green-500/50 group-hover:bg-green-500/20 transition-all flex-shrink-0">
															{getInitials(row.name)}
														</div>
														<div className="min-w-0">
															<p
																className="font-semibold text-white group-hover:text-green-400 transition-colors"
																title={row.name}
															>
																{truncateName(row.name, 11)}
															</p>
															<p className="text-[11px] text-white/40 md:hidden font-mono truncate">
																{row.reg_no}
															</p>
														</div>
													</div>
												</td>
												<td className="px-3 py-3.5 font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
													{row.reg_no || "N/A"}
												</td>
												<td className="px-3 py-3.5 text-xs opacity-60 group-hover:opacity-100 transition-opacity truncate max-w-[170px]">
													{row.email_personal || "N/A"}
												</td>
												<td className="px-3 py-3.5 text-xs opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
													{row.phone || "N/A"}
												</td>
												<td className="px-3 py-3.5 text-xs whitespace-nowrap">
													<span className="text-white/80 font-medium">
														{row.year
															? `${row.year}${row.year === 1
																? "st"
																: row.year === 2
																	? "nd"
																	: row.year === 3
																		? "rd"
																		: "th"
															}`
															: "N/A"}
													</span>
												</td>
												<td className="px-3 py-3.5 text-xs opacity-80 whitespace-nowrap">
													{row.branch ? (
														<>
															<span>{row.branch}</span>
															{row.section && (
																<span className="text-white/40 ml-1">
																	({row.section})
																</span>
															)}
														</>
													) : (
														row.section || "N/A"
													)}
												</td>
												<td className="px-3 py-3.5 text-xs opacity-60 whitespace-nowrap">
													{row.created_at
														? new Date(row.created_at).toLocaleDateString(
															"en-GB",
															{
																day: "numeric",
																month: "short",
															},
														)
														: "N/A"}
												</td>
												<td className="px-4 py-3.5 text-right whitespace-nowrap">
													<div
														className="flex gap-2 justify-end items-center"
														onClick={(e) => e.stopPropagation()}
													>
														<button
															onClick={(e) => {
																e.stopPropagation();
																exportSinglePDF(row);
															}}
															className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-semibold hover:bg-white/10 hover:text-white transition-all"
															title="Download PDF"
														>
															PDF
														</button>
														{row.resume_link && (
															<a
																href={row.resume_link}
																target="_blank"
																rel="noopener noreferrer"
																onClick={(e) => e.stopPropagation()}
																className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
																title="Open Resume"
															>
																Resume
																<ExternalLink className="w-3 h-3 opacity-60" />
															</a>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					);
				})}
			</div>

			{/* Recruitment Status Control */}
			<div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mt-12">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div>
						<h4 className="text-xl font-bold text-white mb-2">
							Recruitment Toggle
						</h4>
						<p className="text-white/40 text-sm">
							Control the visibility of the recruitment form for students.
						</p>
					</div>
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-3">
							<div
								className={`w-2.5 h-2.5 rounded-full ${isRecruitmentOpen
									? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
									: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
									} animate-pulse`}
							/>
							<span
								className={`font-bold tracking-widest ${isRecruitmentOpen ? "text-green-500" : "text-red-500"
									}`}
							>
								{isRecruitmentOpen ? "OPEN" : "CLOSED"}
							</span>
						</div>
						<button
							onClick={handleToggle}
							disabled={isPending}
							className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 ${isRecruitmentOpen
								? "bg-green-500/20 border border-green-500/50"
								: "bg-white/5 border border-white/10"
								}`}
						>
							<span
								className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-xl transition-transform duration-300 ${isRecruitmentOpen ? "translate-x-11" : "translate-x-1.5"
									}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Applicant Details Modal */}
			{mounted &&
				selectedApplicant &&
				createPortal(
					<div className="fixed inset-0 z-[999] overflow-y-auto bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-10 flex justify-center items-start animate-fadeIn">
						{/* Backdrop click listener */}
						<div
							onClick={closeApplicantModal}
							className="fixed inset-0 -z-10 cursor-pointer"
						/>

						{/* Modal Card - Solid High-Contrast Background */}
						<div
							onClick={(e) => e.stopPropagation()}
							className="relative w-full max-w-3xl bg-[#13131a] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden mx-auto my-2 md:my-6 z-10 animate-scaleUp text-white"
						>
							{/* Top Accent Gradient */}
							<div
								className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${getDomainStyle(selectedApplicant.team_preference).glow
									} opacity-100`}
							/>

							{/* Header Section - Solid Background */}
							<div className="relative p-6 md:p-8 bg-[#181822] border-b border-white/10">
								{/* Top Domain Badge and Close/Nav Controls */}
								<div className="flex items-center justify-between gap-3 mb-4">
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDomainStyle(selectedApplicant.team_preference).badge
											}`}
									>
										{selectedApplicant.team_preference || "General Domain"}
									</span>

									<div className="flex items-center gap-2">
										{selectedModalList.length > 1 && (
											<div className="flex items-center gap-1 bg-[#22222e] rounded-xl border border-white/10 p-1">
												<button
													onClick={handlePrevApplicant}
													disabled={
														selectedApplicantIndex === null ||
														selectedApplicantIndex <= 0
													}
													className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white/70 hover:text-white transition-all"
													title="Previous Applicant (Left Arrow)"
												>
													<ChevronLeft className="w-4 h-4" />
												</button>
												<span className="text-[11px] font-mono px-2 text-white/60 font-semibold">
													{(selectedApplicantIndex ?? 0) + 1} /{" "}
													{selectedModalList.length}
												</span>
												<button
													onClick={handleNextApplicant}
													disabled={
														selectedApplicantIndex === null ||
														selectedApplicantIndex >=
														selectedModalList.length - 1
													}
													className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white/70 hover:text-white transition-all"
													title="Next Applicant (Right Arrow)"
												>
													<ChevronRight className="w-4 h-4" />
												</button>
											</div>
										)}

										<button
											onClick={closeApplicantModal}
											className="p-2 rounded-full bg-[#22222e] hover:bg-[#2c2c3c] border border-white/15 text-white/80 hover:text-white transition-all shadow-md"
											title="Close (Esc)"
										>
											<X className="w-5 h-5" />
										</button>
									</div>
								</div>

								{/* Applicant Name & Avatar */}
								<div className="flex items-start gap-4">
									<div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#252533] border border-white/20 flex items-center justify-center text-xl md:text-2xl font-bold text-white shadow-xl flex-shrink-0">
										{getInitials(selectedApplicant.name)}
									</div>

									<div className="min-w-0 flex-1">
										<h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5 break-words">
											{selectedApplicant.name || "Untitled Applicant"}
										</h2>

										<div className="flex flex-wrap items-center gap-2.5 text-xs text-white/60">
											<span className="font-mono bg-[#252533] px-2.5 py-1 rounded-md border border-white/15 text-white font-semibold">
												{selectedApplicant.reg_no || "No Reg No"}
											</span>
											<span>•</span>
											<span>
												Applied on{" "}
												{selectedApplicant.created_at
													? new Date(
														selectedApplicant.created_at,
													).toLocaleString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})
													: "N/A"}
											</span>
										</div>
									</div>
								</div>

								{/* Action Buttons Bar */}
								<div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-white/10">
									{selectedApplicant.resume_link && (
										<a
											href={selectedApplicant.resume_link}
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-green-500/20 transition-all"
										>
											<ExternalLink className="w-3.5 h-3.5" />
											Open Resume
										</a>
									)}

									<button
										onClick={() => exportSinglePDF(selectedApplicant)}
										className="px-4 py-2 rounded-xl bg-[#252533] hover:bg-[#2e2e40] border border-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
									>
										<FileDown className="w-3.5 h-3.5 text-green-400" />
										Export PDF
									</button>

									{selectedApplicant.email_personal && (
										<a
											href={`mailto:${selectedApplicant.email_personal}`}
											className="px-4 py-2 rounded-xl bg-[#252533] hover:bg-[#2e2e40] border border-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
										>
											<Mail className="w-3.5 h-3.5 text-blue-400" />
											Send Email
										</a>
									)}

									{selectedApplicant.phone && (
										<a
											href={`tel:${selectedApplicant.phone}`}
											className="px-4 py-2 rounded-xl bg-[#252533] hover:bg-[#2e2e40] border border-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
										>
											<Phone className="w-3.5 h-3.5 text-emerald-400" />
											Call
										</a>
									)}
								</div>
							</div>

							{/* Full Content Body - Solid High-Contrast Cards */}
							<div className="p-6 md:p-8 space-y-6 bg-[#13131a]">
								{/* Academic & Contact Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Academic Info Box */}
									<div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-5 space-y-3 shadow-md">
										<div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
											<GraduationCap className="w-4 h-4 text-green-400" />
											<span>Academic Details</span>
										</div>

										<div className="grid grid-cols-2 gap-4 text-xs">
											<div>
												<p className="text-white/50 mb-1">Registration No.</p>
												<p className="font-mono text-white font-bold text-sm">
													{selectedApplicant.reg_no || "N/A"}
												</p>
											</div>

											<div>
												<p className="text-white/50 mb-1">Year of Study</p>
												<p className="text-white font-bold text-sm">
													{selectedApplicant.year
														? `${selectedApplicant.year}${selectedApplicant.year === 1
															? "st"
															: selectedApplicant.year === 2
																? "nd"
																: selectedApplicant.year === 3
																	? "rd"
																	: "th"
														} Year`
														: "N/A"}
												</p>
											</div>

											<div>
												<p className="text-white/50 mb-1">Branch</p>
												<p className="text-white font-bold text-sm">
													{selectedApplicant.branch || "N/A"}
												</p>
											</div>

											<div>
												<p className="text-white/50 mb-1">Section</p>
												<p className="text-white font-bold text-sm">
													{selectedApplicant.section || "N/A"}
												</p>
											</div>
										</div>
									</div>

									{/* Contact Info Box */}
									<div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-5 space-y-3 shadow-md">
										<div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
											<User className="w-4 h-4 text-blue-400" />
											<span>Contact Information</span>
										</div>

										<div className="space-y-3 text-xs">
											<div className="flex items-center justify-between gap-2">
												<div className="min-w-0">
													<p className="text-white/50 mb-0.5">Personal Email</p>
													<a
														href={`mailto:${selectedApplicant.email_personal}`}
														className="text-white font-bold text-sm hover:text-green-400 transition-colors truncate block"
													>
														{selectedApplicant.email_personal || "N/A"}
													</a>
												</div>
												{selectedApplicant.email_personal && (
													<button
														onClick={() =>
															handleCopy(
																selectedApplicant.email_personal!,
																"email_personal",
															)
														}
														className="p-1.5 rounded-lg bg-[#252533] hover:bg-[#2f2f42] text-white/70 hover:text-white transition-all flex-shrink-0 border border-white/10"
														title="Copy Personal Email"
													>
														{copiedField === "email_personal" ? (
															<Check className="w-4 h-4 text-green-400" />
														) : (
															<Copy className="w-4 h-4" />
														)}
													</button>
												)}
											</div>

											<div className="flex items-center justify-between gap-2">
												<div className="min-w-0">
													<p className="text-white/50 mb-0.5">College Email</p>
													<a
														href={`mailto:${selectedApplicant.email_college}`}
														className="text-white font-bold text-sm hover:text-green-400 transition-colors truncate block"
													>
														{selectedApplicant.email_college || "N/A"}
													</a>
												</div>
												{selectedApplicant.email_college && (
													<button
														onClick={() =>
															handleCopy(
																selectedApplicant.email_college!,
																"email_college",
															)
														}
														className="p-1.5 rounded-lg bg-[#252533] hover:bg-[#2f2f42] text-white/70 hover:text-white transition-all flex-shrink-0 border border-white/10"
														title="Copy College Email"
													>
														{copiedField === "email_college" ? (
															<Check className="w-4 h-4 text-green-400" />
														) : (
															<Copy className="w-4 h-4" />
														)}
													</button>
												)}
											</div>

											<div className="flex items-center justify-between gap-2">
												<div className="min-w-0">
													<p className="text-white/50 mb-0.5">Phone Number</p>
													<a
														href={`tel:${selectedApplicant.phone}`}
														className="text-white font-bold text-sm hover:text-green-400 transition-colors truncate block"
													>
														{selectedApplicant.phone || "N/A"}
													</a>
												</div>
												{selectedApplicant.phone && (
													<button
														onClick={() =>
															handleCopy(selectedApplicant.phone!, "phone")
														}
														className="p-1.5 rounded-lg bg-[#252533] hover:bg-[#2f2f42] text-white/70 hover:text-white transition-all flex-shrink-0 border border-white/10"
														title="Copy Phone"
													>
														{copiedField === "phone" ? (
															<Check className="w-4 h-4 text-green-400" />
														) : (
															<Copy className="w-4 h-4" />
														)}
													</button>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Skills Section */}
								{(Boolean(selectedApplicant.techincal_skills) ||
									Boolean(selectedApplicant.design_skills)) && (
										<div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
											<div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
												<Code2 className="w-4 h-4 text-purple-400" />
												<span>Skills & Technologies</span>
											</div>

											{Boolean(selectedApplicant.techincal_skills) && (
												<div>
													<p className="text-xs text-white/50 mb-2 font-medium">
														Technical Skills:
													</p>
													<div className="flex flex-wrap gap-2">
														{parseSkills(selectedApplicant.techincal_skills).map(
															(skill, i) => (
																<span
																	key={i}
																	className="px-3 py-1.5 rounded-xl bg-[#222230] border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm"
																>
																	{skill}
																</span>
															),
														)}
													</div>
												</div>
											)}

											{Boolean(selectedApplicant.design_skills) && (
												<div>
													<p className="text-xs text-white/50 mb-2 font-medium">
														Design Skills:
													</p>
													<div className="flex flex-wrap gap-2">
														{parseSkills(selectedApplicant.design_skills).map(
															(skill, i) => (
																<span
																	key={i}
																	className="px-3 py-1.5 rounded-xl bg-[#222230] border border-pink-500/40 text-pink-300 text-xs font-semibold shadow-sm"
																>
																	{skill}
																</span>
															),
														)}
													</div>
												</div>
											)}
										</div>
									)}

								{/* Description Box (Full text, natural expansion) */}
								<div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-5 md:p-6 space-y-3 shadow-md">
									<div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2.5">
										<MessageSquare className="w-4 h-4 text-amber-400" />
										<span>Why should we hire you? / Description</span>
									</div>

									{selectedApplicant.description ? (
										<div className="bg-[#121218] p-4 md:p-5 rounded-xl border border-white/10 shadow-inner">
											<p className="text-sm md:text-base text-white/90 leading-relaxed whitespace-pre-wrap">
												{selectedApplicant.description}
											</p>
										</div>
									) : (
										<p className="text-sm text-white/40 italic">
											No description provided.
										</p>
									)}
								</div>

								{/* Resume Link Box */}
								{selectedApplicant.resume_link && (
									<div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-5 space-y-3 shadow-md">
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-2 text-white font-bold text-sm">
												<FileText className="w-4 h-4 text-green-400" />
												<span>Resume / Portfolio Link</span>
											</div>
											<a
												href={selectedApplicant.resume_link}
												target="_blank"
												rel="noopener noreferrer"
												className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 text-xs font-semibold text-green-300 hover:bg-green-500/30 transition-all flex items-center gap-1.5"
											>
												Open in New Tab
												<ExternalLink className="w-3 h-3" />
											</a>
										</div>
										<p className="font-mono text-xs text-white/80 bg-[#121218] p-3.5 rounded-xl border border-white/10 break-all">
											{selectedApplicant.resume_link}
										</p>
									</div>
								)}
							</div>

							{/* Footer - Solid Background */}
							<div className="p-4 md:p-6 border-t border-white/10 bg-[#181822] flex items-center justify-end">
								<button
									onClick={closeApplicantModal}
									className="px-6 py-2.5 rounded-xl bg-[#252533] hover:bg-[#2e2e40] border border-white/15 text-white font-semibold text-xs transition-all shadow-md"
								>
									Close
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}


