"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function RecruitmentForm() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const selectedTeam = watch("team_preference");

    const onSubmit = async (data) => {
        setSubmitted(true);
        try {
            //Format data to match supabase schema
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
                technical_skills: data.technical_skills || [],
                design_skills: data.design_skills || [],
                resume_link: data.resume_link,
                description: data.description
            };

            const { err } = await supabase.from('recruitments').insert([payload]);
            if (err) throw err;
            setSubmitted(true);
        } catch (err) {
            console.error('Error Submitting:', err);
            alert('Something went wrong. Please try again');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center p-10 bg-green-900/20 border border-green-500 rounded-xl text-green-400">
                <h2 className="text-2xl font-bold mb-2">Application Recieved!</h2>
                <p>Sit tight, we will review you application and get back to you soon.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-white">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#46b94e]">Join the Team</h2>

            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register("name", { required: true })} placeholder="Full Name" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />
                <input {...register("reg_no", { required: true })} placeholder="Registration No. (RA...)" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />
                <input {...register("email_college", { required: true })} placeholder="SRM Email ID" type="email" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />
                <input {...register("email_personal", { required: true })} placeholder="Personal Email ID" type="email" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <input {...register("phone", { required: true })} placeholder="Phone Number" type="tel" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />
                <select {...register("year", { required: true })} className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none">
                    <option value="" className="text-black">Year</option>
                    <option value="1" className="text-black">1st Year</option>
                    <option value="2" className="text-black">2nd Year</option>
                    <option value="3" className="text-black">3rd Year</option>
                </select>
                <input {...register("section", { required: true })} placeholder="Section" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />
            </div>

            <input {...register("branch", { required: true })} placeholder="Branch (e.g. CSE Core)" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />

            {/* Team Preference */}
            <label className="mt-4 text-sm font-semibold text-gray-400">Preferred Domain</label>
            <select {...register("team_preference", { required: true })} className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none">
                <option value="" className="text-black">Select a Team</option>
                <option value="Technical" className="text-black">Technical</option>
                <option value="Events" className="text-black">Events</option>
                <option value="Corporate" className="text-black">Corporate / PR</option>
                <option value="Creatives" className="text-black">Creatives / Design</option>
            </select>

            {/* Conditional Skills */}
            {selectedTeam === 'Technical' && (
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Technical Skills</label>
                    <div className="flex flex-wrap gap-3">
                        {['React', 'Node.js', 'Python', 'App Dev', 'AI/ML'].map(skill => (
                            <label key={skill} className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded cursor-pointer">
                                <input type="checkbox" value={skill} {...register("technical_skills")} /> {skill}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <input {...register("resume_link", { required: true })} placeholder="Google Drive Resume Link (Public)" type="url" className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />

            <textarea {...register("description", { required: true })} placeholder="Why should we hire you? (100 words)" rows={4} className="p-3 bg-white/10 rounded-lg border border-white/20 focus:border-[#46b94e] outline-none" />

            <button disabled={submitting} type="submit" className="mt-4 p-3 bg-[#46b94e] text-black font-bold rounded-lg hover:bg-[#3da544] transition flex justify-center items-center">
                {submitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
            </button>
        </form>
    );
}