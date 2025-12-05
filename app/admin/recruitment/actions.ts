'use server'

import { contentfulManagementClient, SPACE_ID, ENVIRONMENT_ID } from '@/lib/contentful-admin'
import { revalidatePath } from 'next/cache'

async function getEnvironment() {
    const space = await contentfulManagementClient.getSpace(SPACE_ID)
    return space.getEnvironment(ENVIRONMENT_ID)
}

import { createAdminClient } from '@/lib/supabase-server'

export async function toggleRecruitmentStatus(isOpen: boolean) {
    try {
        const environment = await getEnvironment()

        // Find the globalSettings entry
        const entries = await environment.getEntries({
            content_type: 'globalSettings',
            limit: 1
        })

        if (entries.items.length === 0) {
            console.error('Global Settings entry not found')
            throw new Error('Global Settings entry not found')
        }

        const entry = entries.items[0]

        entry.fields.isRecruitmentOpen = {
            'en-US': isOpen
        }

        const updatedEntry = await entry.update()
        await updatedEntry.publish()

        revalidatePath('/admin/recruitment')
    } catch (error) {
        console.error('Error toggling recruitment status:', error)
        throw error
    }
}

export async function fetchRecruitments(startDate?: string, endDate?: string) {
    const supabase = await createAdminClient()

    let query = supabase
        .from('recruitments')
        .select('*')
        .order('created_at', { ascending: false })

    if (startDate) {
        query = query.gte('created_at', startDate)
    }
    if (endDate) {
        // Add one day to include the end date fully
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        query = query.lt('created_at', end.toISOString())
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching recruitments:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to fetch recruitment data: ${error.message || 'Unknown error'}`)
    }

    return data || []
}
