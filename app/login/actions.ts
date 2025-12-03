'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function sendOtp(previousState: any, formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { success: false, message: 'Email is required' }
    }

    // Security Check: Allowlist
    const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || []
    if (!allowedEmails.includes(email.trim())) {
        return { success: false, message: 'This email is not authorized to access the admin panel.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false,
        },
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return {
        success: true,
        message: 'OTP sent to your email.'
    }
}

export async function verifyOtp(previousState: any, formData: FormData) {
    const email = formData.get('email') as string
    const otp = formData.get('otp') as string

    if (!email || !otp) {
        return { success: false, message: 'Email and OTP are required' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
    })

    if (error) {
        return { success: false, message: error.message }
    }

    redirect('/admin')
}
