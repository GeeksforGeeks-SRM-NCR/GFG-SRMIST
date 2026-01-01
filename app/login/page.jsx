'use client'

import { useActionState, useState, useEffect } from 'react'
import { sendOtp, verifyOtp } from './actions'
import { Mail, Loader2, ArrowRight, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { vibrateLightClick } from '@/lib/vibration'

const initialSendState = {
    success: false,
    message: '',
}

const initialVerifyState = {
    success: false,
    message: '',
}

export default function LoginPage() {
    const [step, setStep] = useState('email') // 'email' | 'otp'
    const [email, setEmail] = useState('')

    const [sendState, sendAction, isSending] = useActionState(sendOtp, initialSendState)
    const [verifyState, verifyAction, isVerifying] = useActionState(verifyOtp, initialVerifyState)

    useEffect(() => {
        if (sendState.success) {
            setStep('otp')
        }
    }, [sendState])

    const handleSendOtp = (e) => {
        vibrateLightClick();
    }

    const handleVerifyOtp = (e) => {
        vibrateLightClick();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Admin Access
                        </h1>
                        <p className="text-white/40 mt-2 text-sm">
                            {step === 'email'
                                ? 'Enter your authorized email to receive a secure code.'
                                : `Enter the code sent to ${email}`
                            }
                        </p>
                    </div>

                    {step === 'email' ? (
                        <form action={sendAction} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            {sendState.message && !sendState.success && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {sendState.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSending}
                                onClick={handleSendOtp}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSending ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Send Code <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form action={verifyAction} className="space-y-6">
                            <input type="hidden" name="email" value={email} />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">One-Time Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="otp"
                                        required
                                        maxLength={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all tracking-widest"
                                        placeholder="123456"
                                    />
                                </div>
                            </div>

                            {verifyState.message && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {verifyState.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isVerifying}
                                onClick={handleVerifyOtp}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isVerifying ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Verify & Login <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    vibrateLightClick();
                                    setStep('email');
                                }}
                                className="w-full text-sm text-white/40 hover:text-white transition-colors"
                            >
                                Change Email
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link href="/" onClick={() => vibrateLightClick()} className="text-xs text-white/20 hover:text-white/60 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
