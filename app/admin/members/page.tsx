'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Github, Linkedin, Instagram, Mail, Loader2, ShieldAlert, Search, X, Calendar, User, Plus, Trash2, Edit2, Save, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import gsap from 'gsap';


// --- CONFIGURATION ---

// Using environment variables from .env.local
const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN; //(Read)
const MANAGEMENT_TOKEN = null; // Removed for security, moved to API
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID;
const CONTENT_TYPE_ID = 'memberProfile';



// --- Types ---

interface ContentfulAsset {
    sys: { id: string };
    fields: { file: { url: string } };
}

interface ContentfulEntry {
    sys: { id: string; version: number }; // Added version for optimistic locking
    fields: {
        name?: { 'en-US': string };
        role?: { 'en-US': string };
        email?: { 'en-US': string };
        bio?: { 'en-US': string };
        photo?: { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: string } } };
        team?: { 'en-US': string };
        year?: { 'en-US': number };
        github?: { 'en-US': string };
        linkedin?: { 'en-US': string };
        instagram?: { 'en-US': string };
        order?: { 'en-US': number };
        coLead?: { 'en-US': string };
        generalMembers?: { 'en-US': string };
    };
}

interface ContentfulResponse {
    items: any[];
    includes?: {
        Asset?: ContentfulAsset[];
    };
}

type MemberCategory = 'Faculty' | 'Executive' | 'Lead' | 'CoLead' | 'Member';

interface Member {
    id: string;
    version?: number; // Contentful version
    name: string;
    role: string;
    email: string | null;
    photoUrl: string | null;
    photoId?: string | null; // Keep track of asset ID for updates
    team: string;
    year: number;
    github: string | null;
    linkedin: string | null;
    instagram: string | null;
    bio: string | null;
    order: number;
    category: MemberCategory;
    isDerived: boolean;
    parentId?: string;
    parentVersion?: number;
    rawGeneralMembers?: string;
}

// --- API Helpers ---

// --- API Helpers ---

// Moved to /api/admin/members route for security


// --- Helpers ---

// --- Helpers ---

// createRichText moved to API route


const extractRawText = (richText: any): string => {
    if (typeof richText === 'string') return richText;
    if (!richText || !richText.content) return '';
    return richText.content.map((block: any) => {
        if (block.nodeType === 'paragraph') {
            return block.content.map((text: any) => text.value || '').join('');
        }
        return '';
    }).join('\n\n');
};

const getMemberCategory = (role: string, isMainEntry: boolean, isCoLeadField: boolean): MemberCategory => {
    const r = role.toLowerCase();

    // Explicitly check for Member role first
    if (r === 'member' || r.includes('general member') || r.includes('team member')) return 'Member';

    // ... existing logic ...
    if (r.includes('faculty')) return 'Faculty';
    if (r.includes('chairperson') || (r.includes('vice') && r.includes('chair'))) return 'Executive';

    if (isMainEntry) {
        if (r.includes('co-lead') || r.includes('colead')) return 'CoLead';
        return 'Lead';
    }
    if (isCoLeadField) return 'CoLead';
    return 'Member';
};

const formatGeneratedRole = (team: string, suffix: string) => {
    if (team.toLowerCase() === 'general') return suffix;
    return `${team} ${suffix}`;
};

const getTeamStyle = (team: string, category: MemberCategory) => {
    const t = team.toLowerCase();

    // Default / General
    let style = {
        glow: 'from-gray-500/20',
        ring: 'ring-gray-500/20',
        badge: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
        border: 'hover:border-gray-500/30'
    };

    if (category === 'Faculty') {
        style = {
            glow: 'from-indigo-500/30',
            ring: 'ring-indigo-500/50',
            badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
            border: 'hover:border-indigo-500/50'
        };
    } else if (category === 'Executive') {
        style = {
            glow: 'from-violet-500/30',
            ring: 'ring-violet-500/50',
            badge: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
            border: 'hover:border-violet-500/50'
        };
    } else if (t.includes('technical')) {
        style = {
            glow: 'from-cyan-500/20',
            ring: 'ring-cyan-500/40',
            badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
            border: 'hover:border-cyan-500/50'
        };
    } else if (t.includes('design') || t.includes('creative')) {
        style = {
            glow: 'from-pink-500/20',
            ring: 'ring-pink-500/40',
            badge: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
            border: 'hover:border-pink-500/50'
        };
    } else if (t.includes('corporate') || t.includes('events')) {
        style = {
            glow: 'from-blue-500/20',
            ring: 'ring-blue-500/40',
            badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
            border: 'hover:border-blue-500/50'
        };
    } else if (t.includes('social') || t.includes('editorial')) {
        style = {
            glow: 'from-emerald-500/20',
            ring: 'ring-emerald-500/40',
            badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
            border: 'hover:border-emerald-500/50'
        };
    }

    return style;
};



// ... (skipping down to fetchMembers loop) ...


// --- Double Confirmation Component ---

interface ConfirmationProps {
    actionType: 'save' | 'delete';
    step: 1 | 2;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationProps> = ({ actionType, step, isProcessing, onConfirm, onCancel }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
        );
    }, [step]);

    const isDelete = actionType === 'delete';
    const colorClass = isDelete ? 'red' : 'emerald';

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <div ref={containerRef} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0c] p-6 shadow-2xl ring-1 ring-white/10">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-${colorClass}-500/20 text-${colorClass}-500 mx-auto`}>
                    {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <AlertTriangle className="h-6 w-6" />}
                </div>

                <h3 className="text-center text-lg font-bold text-white mb-2">
                    {step === 1 ? 'Action Required' : 'Final Warning'}
                </h3>

                <p className="text-center text-sm text-gray-400 mb-6 leading-relaxed">
                    {step === 1
                        ? `You are about to ${actionType} this member record on the server. Are you sure?`
                        : <span className="text-red-400 font-medium">This changes the live database directly. Confirm?</span>
                    }
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1 rounded-lg bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-lg bg-${colorClass}-600 py-2.5 text-sm font-semibold text-white hover:bg-${colorClass}-500 shadow-lg shadow-${colorClass}-500/20 transition-all disabled:opacity-50`}
                    >
                        {isProcessing ? 'Processing...' : (step === 1 ? 'Yes, Continue' : `Confirm ${actionType}`)}
                    </button>
                </div>

                <div className="mt-4 flex justify-center gap-1">
                    <div className={`h-1.5 w-1.5 rounded-full ${step >= 1 ? `bg-${colorClass}-500` : 'bg-gray-700'}`} />
                    <div className={`h-1.5 w-1.5 rounded-full ${step >= 2 ? `bg-${colorClass}-500` : 'bg-gray-700'}`} />
                </div>
            </div>
        </div>
    );
};

// --- Member Edit Modal ---

interface MemberModalProps {
    member: Member;
    onClose: () => void;
    onSave: (updatedMember: Member, file?: File | null) => Promise<void>;
    onDelete: (id: string, version: number) => Promise<void>;
    isNew?: boolean;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, onClose, onSave, onDelete, isNew = false }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(isNew);
    const [formData, setFormData] = useState<Member>(member);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(member.photoUrl);
    const [isProcessing, setIsProcessing] = useState(false);

    // 0 = none, 1 = first warning, 2 = final warning
    const [confirmStep, setConfirmStep] = useState<0 | 1 | 2>(0);
    const [actionType, setActionType] = useState<'save' | 'delete'>('save');

    // Recalculate styles when team or category changes
    const styles = useMemo(() => getTeamStyle(formData.team, formData.category), [formData.team, formData.category]);

    // Dropdown Options
    const roleOptions = ["Faculty Coordinator", "Chairperson", "Vice Chairperson", "Lead", "Co-Lead", "Member"];
    const teamOptions = [
        "Technical",
        "Design",
        "P.R. & Outreach",
        "Event",
        "Marketing",
        "Social Media",
        "Photography",
        "Editorial",
        "Corporate",
        "General"
    ];

    useEffect(() => {
        const main = document.querySelector('main');
        if (main) main.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline();
        tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            .fromTo(contentRef.current,
                { scale: 0.9, y: 20, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' },
                "-=0.2"
            );
        return () => {
            if (main) main.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, []);

    const handleClose = () => {
        if (confirmStep > 0 && !isProcessing) {
            setConfirmStep(0);
            return;
        }
        if (isProcessing) return;

        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(contentRef.current, { scale: 0.95, opacity: 0, duration: 0.2 })
            .to(modalRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
    };

    const handleInputChange = (field: keyof Member, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Helper to determine the "Base Role" for the dropdown
    const getBaseRole = (fullRole: string) => {
        if (!fullRole) return 'Member';
        if (roleOptions.includes(fullRole)) return fullRole; // Exact match (e.g. Chairperson)
        if (fullRole.includes('Co-Lead')) return 'Co-Lead';
        if (fullRole.includes('Lead')) return 'Lead';
        return 'Member'; // Fallback
    };

    const handleRoleSelect = (baseRole: string) => {
        let newRole = baseRole;
        // Construct full role if it's a team-based role
        if (baseRole === 'Lead' || baseRole === 'Co-Lead') {
            newRole = `${formData.team} ${baseRole}`;
        }
        handleInputChange('role', newRole);
    };

    const handleTeamSelect = (newTeam: string) => {
        handleInputChange('team', newTeam);
        // If current role is team-dependent, update it
        const currentBase = getBaseRole(formData.role);
        if (currentBase === 'Lead' || currentBase === 'Co-Lead') {
            handleInputChange('role', `${newTeam} ${currentBase}`);
        }
    };

    const initiateAction = (type: 'save' | 'delete') => {
        setActionType(type);
        setConfirmStep(1);
    };

    const advanceConfirmation = async () => {
        if (confirmStep === 1) {
            setConfirmStep(2);
        } else if (confirmStep === 2) {
            setIsProcessing(true);
            try {
                if (actionType === 'save') {
                    // Recalculate category locally for immediate UI update (though API reload will fix it)
                    const updatedCategory = getMemberCategory(formData.role, true, false);
                    await onSave({ ...formData, category: updatedCategory }, selectedFile);
                } else {
                    // Delete - use version if available, otherwise just use id
                    await onDelete(formData.id, formData.version || 1);
                }
                setIsProcessing(false);
                handleClose();
            } catch (err) {
                alert("Operation failed: " + (err as Error).message);
                setIsProcessing(false);
                setConfirmStep(0);
            }
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div ref={modalRef} onClick={handleClose} className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />

            <div ref={contentRef} className="relative w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Colored gradient glow header */}
                <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${styles.glow} to-transparent opacity-50 pointer-events-none z-0`} />

                {/* Double Confirmation Overlay */}
                {confirmStep > 0 && (
                    <ConfirmationModal
                        actionType={actionType}
                        step={confirmStep as 1 | 2}
                        isProcessing={isProcessing}
                        onConfirm={advanceConfirmation}
                        onCancel={() => !isProcessing && setConfirmStep(0)}
                    />
                )}

                {/* Header - Minimal overlay for controls */}
                <div className="relative h-16 flex-shrink-0 z-10">
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all backdrop-blur-sm"
                                title="Edit Member"
                            >
                                <Edit2 className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all backdrop-blur-sm"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-10" data-lenis-prevent>

                    {/* Photo Upload Section */}
                    <div className="relative -mt-7 mb-8 flex flex-col items-center">
                        <div className="group/photo relative h-32 w-32 rounded-full border-4 border-[#0a0a0c] shadow-xl overflow-hidden bg-[#18181b]">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-500">
                                    <User className="h-12 w-12" />
                                </div>
                            )}

                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 z-10 hidden h-full w-full items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all group-hover/photo:flex cursor-pointer"
                                >
                                    <div className="flex flex-col items-center">
                                        <Plus className="h-8 w-8 mb-1" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                                    </div>
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setSelectedFile(file);
                                        setPreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        {/* Editable Name & Role */}
                        {isEditing ? (
                            <div className="w-full space-y-3 mb-6">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center text-xl font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Full Name"
                                />

                                {/* Dropdowns for Role and Team */}
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Role Dropdown */}
                                    <select
                                        value={getBaseRole(formData.role)}
                                        onChange={(e) => handleRoleSelect(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                    >
                                        {roleOptions.map(opt => <option key={opt} value={opt} className="bg-[#121214]">{opt}</option>)}
                                    </select>

                                    {/* Team Dropdown */}
                                    <select
                                        value={teamOptions.find(t => formData.team.includes(t)) || 'General'}
                                        onChange={(e) => handleTeamSelect(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                    >
                                        {teamOptions.map(opt => <option key={opt} value={opt} className="bg-[#121214]">{opt}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-sm text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Year"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.order}
                                        onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-sm text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Order (e.g. 1)"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-2">{formData.name}</h2>
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                                        {formData.role}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-400 border border-white/5">
                                        Class of {formData.year}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Bio Field */}
                        {isEditing ? (
                            <textarea
                                value={formData.bio || ''}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                placeholder="Member biography..."
                            />
                        ) : (
                            formData.bio && (
                                <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                                    <p className="text-sm leading-relaxed text-gray-300">{formData.bio}</p>
                                </div>
                            )
                        )}

                        {/* Contact Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                {isEditing ? (
                                    <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
                                        <Mail className="h-4 w-4 text-emerald-400 ml-2" />
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full bg-transparent border-none text-sm text-white focus:ring-0 outline-none"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                ) : (
                                    formData.email && (
                                        <a href={`mailto:${formData.email}`} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10 group/item">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-medium text-gray-500">Email</p>
                                                <p className="truncate text-sm font-semibold text-white">{formData.email}</p>
                                            </div>
                                        </a>
                                    )
                                )}
                            </div>

                            {/* Social Links Editing */}
                            {isEditing && (
                                <div className="col-span-2 space-y-2">
                                    <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
                                        <Linkedin className="h-4 w-4 text-[#0077b5] ml-2" />
                                        <input
                                            type="text"
                                            value={formData.linkedin || ''}
                                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                            className="w-full bg-transparent border-none text-sm text-white focus:ring-0 outline-none"
                                            placeholder="LinkedIn URL"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
                                        <Github className="h-4 w-4 text-white ml-2" />
                                        <input
                                            type="text"
                                            value={formData.github || ''}
                                            onChange={(e) => handleInputChange('github', e.target.value)}
                                            className="w-full bg-transparent border-none text-sm text-white focus:ring-0 outline-none"
                                            placeholder="GitHub URL"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2 border border-white/10">
                                        <Instagram className="h-4 w-4 text-pink-500 ml-2" />
                                        <input
                                            type="text"
                                            value={formData.instagram || ''}
                                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                                            className="w-full bg-transparent border-none text-sm text-white focus:ring-0 outline-none"
                                            placeholder="Instagram URL"
                                        />
                                    </div>
                                </div>
                            )}

                            {!isEditing && (
                                <div className="col-span-2 flex justify-center gap-4 py-2">
                                    {formData.linkedin && (
                                        <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/20 hover:bg-[#0077b5] hover:text-white transition-all hover:scale-110">
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                    {formData.github && (
                                        <a href={formData.github} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all hover:scale-110">
                                            <Github className="h-5 w-5" />
                                        </a>
                                    )}
                                    {formData.instagram && (
                                        <a href={formData.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 hover:bg-pink-500 hover:text-white transition-all hover:scale-110">
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="pt-4 mt-4 border-t border-white/10 flex gap-3">
                                {!isNew && (
                                    <button
                                        onClick={() => initiateAction('delete')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                )}
                                <div className="flex-1"></div>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => initiateAction('save')}
                                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all font-semibold"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Main Component ---

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            // Fetching from Delivery API (Read)
            const response = await fetch(
                `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?access_token=${ACCESS_TOKEN}&limit=1000`
            );

            if (!response.ok) throw new Error('Failed to fetch data');

            const data: ContentfulResponse = await response.json();

            const assetMap = new Map<string, string>();
            if (data.includes?.Asset) {
                data.includes.Asset.forEach((asset) => {
                    assetMap.set(asset.sys.id, asset.fields.file.url);
                });
            }

            const allProcessedMembers: Member[] = [];
            const currentYear = new Date().getFullYear();

            data.items.forEach((item) => {
                const f = item.fields;
                const mainName = f.name;
                const teamName = f.team || 'General';
                const entryYear = f.year || currentYear;
                const orderVal = f.order || 99;
                const roleVal = f.role || 'Member';

                const bioText = extractRawText(f.bio);

                // 1. Process Main Entry
                if (mainName) {
                    const photoId = f.photo?.sys.id;
                    const photoUrl = photoId ? assetMap.get(photoId) || null : null;
                    const category = getMemberCategory(roleVal, true, false);

                    allProcessedMembers.push({
                        id: item.sys.id,
                        version: item.sys.revision || item.sys.version, // Mapping version for CMA updates
                        name: mainName,
                        role: roleVal,
                        email: f.email || null,
                        photoUrl: photoUrl ? `https:${photoUrl}` : null,
                        photoId: photoId,
                        team: teamName,
                        year: entryYear,
                        github: f.github || null,
                        linkedin: f.linkedin || null,
                        instagram: f.instagram || null,
                        bio: bioText,
                        order: orderVal,
                        category: category,
                        isDerived: false,
                        rawGeneralMembers: f.generalMembers || ''
                    });
                }

                // 2. Process Co-Leads (Derived - Read Only)
                if (f.coLead) {
                    const coLeads = f.coLead.split(',').map((s: string) => s.trim());
                    coLeads.forEach((name: string, idx: number) => {
                        if (!name) return;
                        const formattedRole = formatGeneratedRole(teamName, 'Co-Lead');
                        allProcessedMembers.push({
                            id: `${item.sys.id}-co-${idx}`,
                            name: name,
                            role: formattedRole,
                            email: null,
                            photoUrl: null,
                            team: teamName,
                            year: entryYear,
                            github: null,
                            linkedin: null,
                            instagram: null,
                            bio: null,
                            order: orderVal,
                            category: 'CoLead',
                            isDerived: true,
                            parentId: item.sys.id,
                            parentVersion: item.sys.revision || item.sys.version
                        });
                    });
                }

                // 3. Process General Members (Derived - Read Only)
                const genMembersText = f.generalMembers || f["General Members"];
                if (genMembersText && typeof genMembersText === 'string') {
                    const names = genMembersText.split(/[\n,]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                    names.forEach((name: string, idx: number) => {
                        const formattedRole = formatGeneratedRole(teamName, 'Member');
                        allProcessedMembers.push({
                            id: `${item.sys.id}-gm-${idx}`,
                            name: name,
                            role: formattedRole,
                            email: null,
                            photoUrl: null,
                            team: teamName,
                            year: entryYear,
                            github: null,
                            linkedin: null,
                            instagram: null,
                            bio: null,
                            order: orderVal,
                            category: 'Member',
                            isDerived: true,
                            parentId: item.sys.id,
                            parentVersion: item.sys.revision || item.sys.version
                        });
                    });
                }
            });

            const filteredMembers = allProcessedMembers.filter(m => {
                if (m.category === 'CoLead' && !m.photoUrl) return false;
                return true;
            });

            setMembers(filteredMembers);
            setLoading(false);

        } catch (err) {
            console.error(err);
            setError('Failed to load member directory.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // --- CRUD Operations (Management API) ---

    const handleUpdateMember = async (updatedMember: Member, file?: File | null) => {
        try {
            // Handle Derived Member Updates (General Members in a list)
            if (updatedMember.isDerived && updatedMember.parentId && updatedMember.category === 'Member') {
                const parent = members.find(m => m.id === updatedMember.parentId);
                if (!parent) throw new Error("Parent Lead not found locally");

                // Parse index from ID: parentId-gm-index
                const idParts = updatedMember.id.split('-gm-');
                const index = parseInt(idParts[1]);

                if (isNaN(index)) throw new Error("Could not determine member index");

                const currentList = parent.rawGeneralMembers ? parent.rawGeneralMembers.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0) : [];

                // Update specific index
                if (index >= 0 && index < currentList.length) {
                    currentList[index] = updatedMember.name;
                }

                const updatedListString = currentList.join(', ');

                // Send update for Parent
                const formData = new FormData();
                formData.append('action', 'update');
                const leadUpdatePayload = {
                    ...parent,
                    generalMembers: updatedListString
                };
                formData.append('member', JSON.stringify(leadUpdatePayload));

                const res = await fetch('/api/admin/members', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();
                if (!data.success) throw new Error(data.error);

                await fetchMembers();
                setSelectedMember(null);
                return;
            }

            // Normal Update
            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('member', JSON.stringify(updatedMember));
            if (file) {
                formData.append('file', file);
            }

            const res = await fetch('/api/admin/members', {
                method: 'POST',
                // Content-Type header excluded to let browser set boundary for FormData
                body: formData
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            // Refresh Local Data
            await fetchMembers();
            setSelectedMember(null);
        } catch (err: any) {
            console.error('Update failed:', err);
            alert(`Update failed: ${err.message}`);
        }
    };

    const handleDeleteMember = async (id: string, version: number) => {
        try {
            // Find the member to delete
            const memberToDelete = members.find(m => m.id === id);
            if (!memberToDelete) {
                throw new Error('Member not found');
            }

            // CASE 1: Deleting a Derived General Member (from the UI cards)
            if (memberToDelete.isDerived && memberToDelete.parentId && memberToDelete.category === 'Member') {
                const parent = members.find(m => m.id === memberToDelete.parentId);
                if (!parent) throw new Error("Parent Lead not found locally");

                // Parse current list
                const currentList = parent.rawGeneralMembers ? parent.rawGeneralMembers.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0) : [];

                // Remove by name (more reliable than index)
                const updatedList = currentList.filter(name => name !== memberToDelete.name);

                const updatedListString = updatedList.join(', ');

                // Send update for Parent
                const formData = new FormData();
                formData.append('action', 'update');
                const leadUpdatePayload = {
                    ...parent,
                    generalMembers: updatedListString
                };
                formData.append('member', JSON.stringify(leadUpdatePayload));

                const res = await fetch('/api/admin/members', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();
                if (!data.success) throw new Error(data.error);

                await fetchMembers();
                setSelectedMember(null);
                return;
            }

            // CASE 2: Deleting an actual Contentful entry (Lead, Co-Lead, etc.)
            // But first, check if this member's name appears in ANY Lead's generalMembers list
            // If so, remove them from those lists too

            // Search all Leads for this member's name in their generalMembers
            const leadsWithThisMember = members.filter(m =>
                !m.isDerived &&
                (m.category === 'Lead' || m.category === 'Executive') &&
                m.rawGeneralMembers &&
                m.rawGeneralMembers.split(/[\n,]+/).map(s => s.trim()).includes(memberToDelete.name)
            );

            // Remove from all Lead's general members lists
            for (const lead of leadsWithThisMember) {
                const currentList = lead.rawGeneralMembers!.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
                const updatedList = currentList.filter(name => name !== memberToDelete.name);
                const updatedListString = updatedList.join(', ');

                const formData = new FormData();
                formData.append('action', 'update');
                formData.append('member', JSON.stringify({
                    ...lead,
                    generalMembers: updatedListString
                }));

                const res = await fetch('/api/admin/members', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();
                if (!data.success) {
                    // Silently continue if lead update fails
                }
            }

            // Now delete the actual entry
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('member', JSON.stringify({ id, version }));

            const res = await fetch('/api/admin/members', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            await fetchMembers();
            setSelectedMember(null);
        } catch (err: any) {
            console.error('Delete failed:', err);
            alert(`Delete failed: ${err.message}`);
        }
    };

    const handleCreateMember = async (newMember: Member, file?: File | null) => {
        try {
            // Check for "Member" role - Add to Lead instead of creating new entry
            if (newMember.role === 'Member' || newMember.role.toLowerCase().includes('general member')) {
                const targetTeam = newMember.team;
                const targetYear = newMember.year;

                const definedLeadRoles = [
                    "Technical Lead",
                    "Design Lead",
                    "P.R. & Outreach Lead",
                    "Event Lead",
                    "Marketing Lead",
                    "Social Media Lead",
                    "Photography Lead",
                    "Editorial Lead",
                    "Corporate Lead",
                    "Chairperson",
                    "Vice Chairperson",
                    "President",
                    "Vice President"
                ];

                // Find the Team Lead for this team/year using robust filtering
                const candidates = members.filter(m => {
                    // Flexible team matching: check if either contains the other (handles "Technical Team" vs "Technical")
                    const memberTeam = m.team.trim().toLowerCase();
                    const searchTeam = targetTeam.trim().toLowerCase();
                    const isTeamMatch = memberTeam.includes(searchTeam) || searchTeam.includes(memberTeam);

                    const isYearMatch = Number(m.year) === Number(targetYear);
                    const isNotDerived = !m.isDerived;

                    return isTeamMatch && isYearMatch && isNotDerived;
                });

                let teamLead = candidates.find(m => {
                    // Check if category is Lead/Executive OR if role is explicitly in the allowed list
                    const isCategoryLeader = (m.category === 'Lead' || m.category === 'Executive');
                    const isExplicitLeader = definedLeadRoles.some(r => m.role.trim().toLowerCase() === r.toLowerCase());

                    return isCategoryLeader || isExplicitLeader;
                });

                // Fallback: If no official leader found, assume the first non-derived member in that team is the one we want (User said "ignore the rest")
                if (!teamLead && candidates.length > 0) {
                    teamLead = candidates[0];
                }

                if (!teamLead) {
                    alert(`No Team Lead found for Team: ${targetTeam}, Year: ${targetYear}. Please create a Leader first.`);
                    return;
                }

                // Append new name to existing list
                const currentList = teamLead.rawGeneralMembers ? teamLead.rawGeneralMembers.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0) : [];
                currentList.push(newMember.name);
                const updatedListString = currentList.join(', ');

                // Update the Lead entry
                const formData = new FormData();
                formData.append('action', 'update');
                const leadUpdatePayload = {
                    ...teamLead,
                    generalMembers: updatedListString
                };
                formData.append('member', JSON.stringify(leadUpdatePayload));

                const res = await fetch('/api/admin/members', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();
                if (!data.success) throw new Error(data.error);

                await fetchMembers();
                setIsAddingNew(false);
                setSelectedMember(null);
                return;
            }

            // Normal Creation for other roles
            const formData = new FormData();
            formData.append('action', 'create');
            formData.append('member', JSON.stringify(newMember));
            if (file) {
                formData.append('file', file);
            }

            const res = await fetch('/api/admin/members', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            await fetchMembers();
            setIsAddingNew(false);
            setSelectedMember(null);
        } catch (err: any) {
            console.error('Creation failed:', err);
            alert(`Creation failed: ${err.message}`);
        }
    };

    const startAddNew = () => {
        const emptyMember: Member = {
            id: 'temp',
            name: '',
            role: 'Member',
            team: 'General',
            year: new Date().getFullYear(),
            email: '',
            photoUrl: null,
            bio: '',
            github: '',
            linkedin: '',
            instagram: '',
            order: 100,
            category: 'Member',
            isDerived: false
        };
        setIsAddingNew(true);
        setSelectedMember(emptyMember);
    };

    // --- Filtering & Hierarchy ---

    const isSearching = searchQuery.length > 0;

    const filteredMembers = useMemo(() => {
        if (!isSearching) return members;
        const lowerQuery = searchQuery.toLowerCase();
        return members.filter(m =>
            m.name.toLowerCase().includes(lowerQuery) ||
            m.role.toLowerCase().includes(lowerQuery) ||
            m.team.toLowerCase().includes(lowerQuery)
        );
    }, [members, searchQuery, isSearching]);

    const structuredData = useMemo(() => {
        if (isSearching) return null;

        const faculty = members.filter(m => m.category === 'Faculty').sort((a, b) => a.order - b.order);
        const nonFaculty = members.filter(m => m.category !== 'Faculty');
        const years = Array.from(new Set(nonFaculty.map(m => m.year))).sort((a, b) => b - a);

        const yearGroups = years.map(year => {
            const yearMembers = nonFaculty.filter(m => m.year === year);
            const executive = yearMembers.filter(m => m.category === 'Executive').sort((a, b) => a.order - b.order);

            const leads = yearMembers
                .filter(m => m.category === 'Lead')
                .sort((a, b) => {
                    const teamCompare = a.team.localeCompare(b.team);
                    if (teamCompare !== 0) return teamCompare;
                    return a.name.localeCompare(b.name);
                });

            const coLeads = yearMembers
                .filter(m => m.category === 'CoLead')
                .sort((a, b) => {
                    const teamCompare = a.team.localeCompare(b.team);
                    if (teamCompare !== 0) return teamCompare;
                    return a.name.localeCompare(b.name);
                });

            // Group general members by team
            const generalMembers = yearMembers.filter(m => m.category === 'Member');
            const generalByTeam = Object.entries(
                generalMembers.reduce((acc, member) => {
                    const t = member.team || 'General';
                    if (!acc[t]) acc[t] = [];
                    acc[t].push(member);
                    return acc;
                }, {} as Record<string, Member[]>)
            ).map(([team, members]) => ({ team, members: members.sort((a, b) => a.name.localeCompare(b.name)) }))
                .sort((a, b) => a.team.localeCompare(b.team));

            return { year, executive, leads, coLeads, generalByTeam };
        });

        return { faculty, yearGroups };
    }, [members, isSearching]);

    // --- Animations ---
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                const ctx = gsap.context(() => {
                    gsap.fromTo('.member-card',
                        { y: 20, opacity: 0, scale: 0.95 },
                        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.01, ease: 'back.out(1.1)', clearProps: 'all' }
                    );
                    gsap.fromTo('.fade-in',
                        { x: -20, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 }
                    );
                }, containerRef);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [loading, isSearching]);

    // --- Render Card Helper ---

    const renderCard = (member: Member) => {
        const isBig = member.category === 'Faculty' || member.category === 'Executive' || member.category === 'Lead';
        const isTiny = member.category === 'Member';

        const styles = getTeamStyle(member.team, member.category);
        const borderColor = member.category === 'Member' ? 'border-transparent' : 'border-white/5';
        const cardBg = member.category === 'CoLead' ? 'bg-[#121214]/80' :
            member.category === 'Member' ? 'bg-[#121214]/40' :
                'bg-[#121214]';

        return (
            <div
                key={member.id}
                onClick={() => { setIsAddingNew(false); setSelectedMember(member); }}
                className={`member-card group relative flex flex-col items-center rounded-2xl border ${borderColor} ${cardBg} p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-[#18181b] hover:shadow-xl hover:shadow-black/50 ${styles.border} cursor-pointer`}
            >
                {!isTiny && (
                    <div className={`relative mb-3 ${isBig ? 'h-20 w-20' : 'h-16 w-16'} overflow-hidden rounded-full border-2 border-[#18181b] shadow-lg shadow-black/50 ring-2 ring-white/5 transition-all duration-300 ${styles.ring}`}>
                        {member.photoUrl ? (
                            <img
                                src={member.photoUrl}
                                alt={member.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className={`flex h-full w-full items-center justify-center text-gray-500 ${isBig ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20' : 'bg-white/5'}`}>
                                <span className={`${isBig ? 'text-xl' : 'text-lg'} font-bold select-none`}>{member.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                )}

                <h3 className={`font-bold text-white mb-1 line-clamp-1 w-full px-1 ${isTiny ? 'text-sm text-left' : 'text-base'}`} title={member.name}>
                    {member.name}
                </h3>

                <span className={`mb-2 inline-block rounded py-0.5 px-1.5 text-[10px] font-bold uppercase tracking-wider truncate max-w-full ${styles.badge} ${isTiny ? 'w-full text-left' : ''}`}>
                    {member.role}
                </span>

                <div className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b ${styles.glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none`} />
            </div>
        );
    };

    if (loading) {
        // Replicating loading state but with Sidebar wrap
        return (
            <div className="flex-1 h-screen flex items-center justify-center relative">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error) {
        // Replicating error state but with Sidebar wrap
        return (
            <div className="flex-1 h-screen flex flex-col items-center justify-center text-red-400 relative">
                <ShieldAlert className="mb-2 h-10 w-10" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <div ref={containerRef} className="pb-20 min-h-[80vh] w-full">
                {/* Header & Search */}
                <div className="sticky top-0 z-40 mb-10 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 -mx-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Team Directory</h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-full md:w-64 rounded-full border border-white/10 bg-[#121214] pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            <button
                                onClick={startAddNew}
                                className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Member</span>
                            </button>
                        </div>
                    </div>
                </div>

                {isSearching ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMembers.map(renderCard)}
                    </div>
                ) : (
                    <div className="space-y-16">

                        {/* GLOBAL FACULTY SECTION */}
                        {structuredData!.faculty.length > 0 && (
                            <section>
                                <div className="fade-in mb-6 flex items-center gap-2">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                                    <h3 className="text-xl font-bold text-white tracking-tight">Faculty Coordinators</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {structuredData!.faculty.map(renderCard)}
                                </div>
                            </section>
                        )}

                        {/* YEAR GROUPS */}
                        {structuredData!.yearGroups.map((group) => (
                            <div key={group.year} className="relative pt-8 border-t border-white/5">

                                {/* Year Header */}
                                <div className="fade-in mb-10">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white/20 tracking-tighter">
                                        {group.year}
                                    </h2>
                                </div>

                                <div className="space-y-12 pl-0 md:pl-4">

                                    {/* 1. Executive */}
                                    {group.executive.length > 0 && (
                                        <section>
                                            <h4 className="fade-in text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 opacity-80">Executive Board</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {group.executive.map(renderCard)}
                                            </div>
                                        </section>
                                    )}

                                    {/* 2. Leads */}
                                    {group.leads.length > 0 && (
                                        <section>
                                            <h4 className="fade-in text-xs font-bold uppercase tracking-widest text-white/60 mb-4 opacity-80">Leads</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {group.leads.map(renderCard)}
                                            </div>
                                        </section>
                                    )}

                                    {/* 3. Co-Leads */}
                                    {group.coLeads.length > 0 && (
                                        <section>
                                            <h4 className="fade-in text-xs font-bold uppercase tracking-widest text-white/50 mb-4 opacity-80">Co-Leads</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {group.coLeads.map(renderCard)}
                                            </div>
                                        </section>
                                    )}

                                    {/* 4. General Members (Grouped by Team) */}
                                    {group.generalByTeam.length > 0 && (
                                        <section>
                                            <h4 className="fade-in text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 opacity-80">General Members</h4>

                                            <div className="space-y-8">
                                                {group.generalByTeam.map((teamGroup) => (
                                                    <div key={teamGroup.team} className="fade-in">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="h-px w-4 bg-white/10"></div>
                                                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400/80">
                                                                {teamGroup.team.replace(/ Team$/i, '')} Team
                                                            </h5>
                                                            <div className="h-px flex-1 bg-white/5"></div>
                                                        </div>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                            {teamGroup.members.map(renderCard)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {selectedMember && (
                <MemberModal
                    member={selectedMember}
                    isNew={isAddingNew}
                    onClose={() => { setSelectedMember(null); setIsAddingNew(false); }}
                    onSave={isAddingNew ? handleCreateMember : handleUpdateMember}
                    onDelete={handleDeleteMember}
                />
            )}
        </>
    );
};
