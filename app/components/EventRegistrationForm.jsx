"use client";
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import CustomSelect, { yearOptions, branchOptions, sectionOptions } from "@/app/components/CustomSelect";

export default function EventRegistrationForm({ eventName, noMembers = "4" }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Parse noMembers string into min and max
    const parts = String(noMembers).split('-').map(s => parseInt(s.trim(), 10));
    const minMembers = !isNaN(parts[0]) && parts[0] > 0 ? parts[0] : 1;
    const maxMembers = parts.length > 1 && !isNaN(parts[1]) ? parts[1] : minMembers;

    // Initial members array dynamically set to the minimum number of required members
    const initialMembers = Array.from({ length: minMembers }, () => ({
        name: '', year: '', section: '', branch: '', email: '', regNumber: '', phone: ''
    }));

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            members: initialMembers
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
                members: data.members
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
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#46b94e]">Register for {eventName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input {...register("team_name", { required: true })} placeholder="Team Name" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
                <input {...register("college_name", { required: true })} placeholder="College Name" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none" />
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
                    <div key={field.id} className="p-4 bg-white/5 border border-white/5 rounded-xl transition-all duration-300 relative" style={{ zIndex: 50 - index }}>
                        <div className="mb-4 text-[#46b94e] font-semibold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#46b94e]/20 text-xs text-white">
                                    {index + 1}
                                </span>
                                {index === 0 ? 'Team Leader' : `Member ${index + 1}`}
                            </div>

                            {index >= minMembers && (
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
                            <input {...register(`members.${index}.name`, { required: true })} placeholder="Full Name *" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500" />
                            <div className="flex flex-col">
                                <input {...register(`members.${index}.regNumber`, {
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
                                    className={`p-3 w-full bg-white/10 rounded-lg border outline-none placeholder:text-gray-500 ${errors?.members?.[index]?.regNumber ? 'border-red-500' : 'border-white/20'}`}
                                />
                                {errors?.members?.[index]?.regNumber && (
                                    <span className="text-red-500 text-xs mt-1 ml-1">{errors.members[index].regNumber.message}</span>
                                )}
                            </div>
                            <input {...register(`members.${index}.email`, { required: true })} placeholder="Email Address *" type="email" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500" />

                            <input {...register(`members.${index}.phone`, { required: true })} placeholder="Phone Number *" className="p-3 bg-white/10 rounded-lg border border-white/20 outline-none placeholder:text-gray-500" />
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

            {fields.length < maxMembers && (
                <button
                    type="button"
                    onClick={() => append({ name: '', year: '', section: '', branch: '', email: '', regNumber: '', phone: '' })}
                    className="w-full flex justify-center items-center gap-2 text-[#46b94e] hover:bg-[#46b94e]/10 py-3 rounded-xl transition-colors mb-6 font-semibold border border-[#46b94e]/30 border-dashed"
                >
                    <Plus size={20} /> Add Next Member ({fields.length + 1})
                </button>
            )}

            <button disabled={submitting} type="submit" className="w-full p-4 bg-[#46b94e] text-black text-lg font-bold rounded-xl hover:bg-[#3da544] transition flex justify-center items-center shadow-lg shadow-green-500/20 active:scale-[0.98]">
                {submitting ? <Loader2 className="animate-spin mr-2" /> : "Complete Registration"}
            </button>
        </form>
    );
}