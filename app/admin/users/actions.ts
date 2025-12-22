'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getWhitelist() {
    const supabase = await createAdminClient()

    const { data, error } = await supabase
        .from('challenge_whitelist')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching whitelist:', error)
        return []
    }

    return data
}

export async function addToWhitelist(email: string) {
    if (!email) return { error: 'Email is required' }

    const supabase = await createAdminClient()

    // Check if exists
    const { data: existing } = await supabase
        .from('challenge_whitelist')
        .select('email')
        .eq('email', email)
        .single()

    if (existing) {
        return { error: 'Email already whitelisted' }
    }

    const { error } = await supabase
        .from('challenge_whitelist')
        .insert([{ email }])

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function removeFromWhitelist(email: string) {
    const supabase = await createAdminClient()

    const { error } = await supabase
        .from('challenge_whitelist')
        .delete()
        .eq('email', email)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}
