"use client";
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function EventRegistrationForm({ eventName }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            members: [{ name: '', email: '', phone: '' }] // Start with 1 member
        }
    });
    const { fields, append, remove } = useFieldArray({ control, name: "members" });

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const payload = {
                event_name: eventName || "General Event",
                team_name: data.team_name,
                college_name: data.college_name,
                members: data.members // Stores the array of member objects directly as JSONB
            };

            const { error } = await supabase.from('registrations').insert([payload]);
            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Error registering team.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) return <div className="text-center text-[#46b94e] text-2xl font-bold p-10">Registration Successful! 🎉</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#46b94e]">Register for {eventName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input {...register("team_name", { required: true })} placeholder="Team Name" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
                <input {...register("college_name", { required: true })} placeholder="College Name" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
            </div>

            <div className="space-y-4 mb-6">
                <label className="text-lg font-semibold border-b border-gray-700 pb-2 block">Team Members</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start">
                        <span className="py-3 px-2 text-gray-400 font-mono">0{index + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                            <input {...register(`members.${index}.name`, { required: true })} placeholder="Name" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
                            <input {...register(`members.${index}.email`, { required: true })} placeholder="Email" type="email" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
                            <input {...register(`members.${index}.phone`, { required: true })} placeholder="Phone" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
                        </div>
                        {index > 0 && (
                            <button type="button" onClick={() => remove(index)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {fields.length < 4 && (
                <button type="button" onClick={() => append({ name: '', email: '', phone: '' })} className="flex items-center gap-2 text-[#46b94e] hover:underline mb-6 mx-auto">
                    <Plus size={18} /> Add Member
                </button>
            )}

            <button disabled={submitting} type="submit" className="w-full p-3 bg-[#46b94e] text-black font-bold rounded-lg hover:bg-[#3da544] transition flex justify-center">
                {submitting ? <Loader2 className="animate-spin" /> : "Register Team"}
            </button>
        </form>
    );
}