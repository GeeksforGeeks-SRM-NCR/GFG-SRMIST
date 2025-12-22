'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return { error: 'Failed to fetch profile' }
    }

    return { data }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const username = formData.get('username') as string
    const fullName = formData.get('fullName') as string

    // Check uniqueness if username changed
    if (username) {
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .neq('id', user.id)
            .single()

        if (existing) {
            return { error: 'Username already taken' }
        }
    }

    const updates: any = {
        updated_at: new Date().toISOString(),
    }
    if (username) updates.username = username
    if (fullName) updates.full_name = fullName

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/practice/profile')
    return { success: 'Profile updated successfully' }
}

// Separate action for avatar to keep it clean, though could be combined
// Note: File upload via Server Actions is supported.
// But typically for Supabase Storage, we might need to upload to bucket.
// Let's assume there's a bucket named 'avatars'.
export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const file = formData.get('avatar') as File
    if (!file) return { error: 'No file uploaded' }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        return { error: 'File size too large (max 2MB)' }
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

    if (uploadError) {
        return { error: uploadError.message }
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    // Update profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

    if (updateError) {
        return { error: 'Failed to update profile picture' }
    }

    revalidatePath('/practice/profile')
    return { success: 'Avatar updated', publicUrl }
}
