"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Controller } from "react-hook-form";

export default function CustomSelect({ control, name, options, placeholder, className, rules }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selectedOption = options.find(opt => opt.value === value);
                return (
                    <div className="w-full">
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className={`${className} flex items-center justify-between cursor-pointer ${error ? '!border-red-500' : ''}`}
                                onClick={() => setIsOpen(!isOpen)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setIsOpen(!isOpen);
                                    }
                                }}
                            >
                                <span className={value ? "text-white" : "text-gray-500"}>
                                    {selectedOption ? selectedOption.label : placeholder}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute z-[60] w-full mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
                                    >
                                        <div
                                            className="max-h-60 overflow-y-auto custom-scrollbar pointer-events-auto rounded-xl shadow-inner scroll-smooth"
                                            onWheel={(e) => e.stopPropagation()}
                                            onTouchMove={(e) => e.stopPropagation()}
                                        >
                                            {options.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`px-4 py-3 cursor-pointer text-sm transition-colors ${value === opt.value ? 'bg-[#46b94e]/20 text-[#46b94e] font-medium border-l-2 border-[#46b94e]' : 'text-gray-300 hover:bg-white/10 hover:text-white border-l-2 border-transparent'}`}
                                                    onClick={() => {
                                                        onChange(opt.value);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}

export const yearOptions = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" }
];

export const branchOptions = [
    { value: "CORE", label: "CORE" },
    { value: "AIML", label: "AIML" },
    { value: "DS", label: "DS" },
    { value: "CLOUD", label: "CLOUD" },
    { value: "ECE", label: "ECE" },
    { value: "CYBER", label: "CYBER" },
    { value: "CSBS", label: "CSBS" }
];

export const sectionOptions = Array.from({ length: 11 }, (_, i) => ({
    value: String.fromCharCode(65 + i),
    label: String.fromCharCode(65 + i)
}));
