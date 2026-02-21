'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, EyeOff, Eye, Save, X } from 'lucide-react'

export function ActionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    isDestructive = false,
    requireDoubleConfirm = false
}) {
    const [step, setStep] = useState(1)

    // Reset step when opened
    if (!isOpen && step !== 1) {
        setStep(1);
    }

    const handleConfirm = () => {
        if (requireDoubleConfirm && step === 1) {
            setStep(2)
        } else {
            onConfirm()
        }
    }

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -inset-6 z-[60] flex flex-col items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md pointer-events-auto"
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded-lg transition-colors hover:bg-white/10"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex flex-col items-center text-center w-full px-2">
                        <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {isDestructive ? <Trash2 size={24} /> : (title.includes('Publish') && !title.includes('Unpublish') ? <Eye size={24} /> : <EyeOff size={24} />)}
                        </div>

                        <h3 className="mb-2 text-lg font-bold text-white leading-tight">
                            {step === 2 ? 'Final Warning' : title}
                        </h3>
                        <p className="mb-5 text-sm text-white/60 leading-snug">
                            {step === 2
                                ? 'Are you absolutely sure? This cannot be undone.'
                                : message}
                        </p>

                        <div className="flex w-full gap-2">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-3 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 px-3 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${isDestructive
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : (title.includes('Publish') && !title.includes('Unpublish')
                                        ? 'bg-emerald-500 hover:bg-emerald-600'
                                        : 'bg-yellow-500 hover:bg-yellow-600')
                                    }`}
                            >
                                {step === 2 ? 'Yes, Delete' : confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
