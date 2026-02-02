'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, Image as ImageIcon, Save, Calendar, MapPin, Link as LinkIcon, Type, Plus } from 'lucide-react';
import gsap from 'gsap';
import CoverImageManager from '../events/[id]/CoverImageManager';
import GalleryManager from '../events/[id]/GalleryManager';

interface EditEventProps {
    eventId: string;
    initialData: {
        title: string;
        date: string;
        venue: string;
        registrationLink: string;
        description: string;
        isRegOpen: boolean;
    };
    coverImage: any;
    galleryImages: any[];
    onBack: () => void;
    onSave: (formData: FormData) => Promise<void>;
}

export const EditEvent: React.FC<EditEventProps> = ({
    eventId,
    initialData,
    coverImage,
    galleryImages,
    onBack,
    onSave
}) => {
    // Cast JS components to any to avoid TypeScript inference issues (implicit never[] on empty default props)
    const CoverImageManagerAny = CoverImageManager as any;
    const GalleryManagerAny = GalleryManager as any;

    const containerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState(initialData);
    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.anim-in', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const btn = document.getElementById('save-btn');
        if (btn) {
            gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
        }

        try {
            const formDataObj = new FormData(e.currentTarget);
            formDataObj.append('eventId', eventId);

            // Append the new cover image file if one was selected
            if (newCoverImage) {
                formDataObj.append('coverImage', newCoverImage);
            }

            await onSave(formDataObj);

            // Clear the "new" file state on success, as it will be part of the refreshed data
            setNewCoverImage(null);

            if (btn) btn.innerText = 'Changes Saved!';
            setTimeout(() => {
                if (btn) btn.innerText = 'Save Changes';
                setIsSaving(false);
            }, 2000);
        } catch (error) {
            console.error('Save failed:', error);
            if (btn) btn.innerText = 'Save Failed';
            setTimeout(() => {
                if (btn) btn.innerText = 'Save Changes';
                setIsSaving(false);
            }, 2000);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen text-white pb-20">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="anim-in flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                            Edit Event
                        </h1>
                        <p className="text-sm text-gray-500">Manage details, media and registrations for this event.</p>
                    </div>
                    <button
                        onClick={onBack}
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Events
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Form Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Details Card */}
                        <div className="anim-in bg-[#121214] p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Type className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Event Details</h3>
                            </div>

                            <form id="event-form" onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <input type="hidden" name="eventId" value={eventId} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Title</label>
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all pl-10"
                                            />
                                            <Type className="absolute left-3 top-3.5 h-4 w-4 text-gray-600 group-focus-within/input:text-purple-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                                        <div className="relative group/input">
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all pl-10"
                                            />
                                            <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-600 group-focus-within/input:text-purple-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</label>
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all pl-10"
                                            />
                                            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-600 group-focus-within/input:text-purple-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Link</label>
                                        <div className="relative group/input">
                                            <input
                                                type="url"
                                                name="registrationLink"
                                                value={formData.registrationLink}
                                                onChange={handleChange}
                                                placeholder="https://"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all pl-10"
                                            />
                                            <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-600 group-focus-within/input:text-purple-500 transition-colors" />
                                        </div>
                                        <p className="text-[10px] text-gray-500 text-right">Leave empty for internal form</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="isRegOpen"
                                            id="isRegOpen"
                                            checked={formData.isRegOpen}
                                            onChange={(e) => setFormData(p => ({ ...p, isRegOpen: e.target.checked }))}
                                            className="hidden"
                                        />
                                        <div
                                            className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.isRegOpen ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                            onClick={() => setFormData(p => ({ ...p, isRegOpen: !p.isRegOpen }))}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isRegOpen ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-sm font-medium text-white">Registration Open</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded border ${formData.isRegOpen ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-gray-500 border-gray-700 bg-gray-800'}`}>
                                        {formData.isRegOpen ? 'ACTIVE' : 'CLOSED'}
                                    </span>
                                </div>

                                <div className="lg:hidden pt-4">
                                    <button
                                        id="save-btn-mobile"
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="h-5 w-5" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Column (Media) */}
                    <div className="space-y-8">
                        {/* Cover Image */}
                        <div className="anim-in bg-[#121214] p-6 rounded-3xl border border-white/5 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <ImageIcon className="h-4 w-4" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Cover Image</h3>
                            </div>
                            <CoverImageManagerAny
                                eventId={eventId}
                                coverImage={coverImage}
                                onImageSelect={setNewCoverImage}
                                selectedFile={newCoverImage}
                            />
                        </div>

                        {/* Gallery */}
                        <div className="anim-in bg-[#121214] p-6 rounded-3xl border border-white/5 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                        <ImageIcon className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Gallery</h3>
                                </div>
                                <span className="text-xs text-gray-500">{galleryImages?.length || 0} images</span>
                            </div>
                            <GalleryManagerAny eventId={eventId} images={galleryImages || []} />
                        </div>

                        {/* Actions - Desktop Only */}
                        <div className="anim-in pt-4 hidden lg:block">
                            <button
                                id="save-btn"
                                type="submit"
                                form="event-form"
                                disabled={isSaving}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save className="h-5 w-5" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
