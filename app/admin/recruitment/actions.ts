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

        let entry

        if (entries.items.length === 0) {
            console.log('Global Settings entry not found, attempting to create one...')

            try {
                // Try to create a new globalSettings entry with all fields
                entry = await environment.createEntry('globalSettings', {
                    fields: {
                        eventName: { 'en-US': 'Default Event' },
                        isRegOpen: { 'en-US': false },
                        bannerText: { 'en-US': '' },
                        isRecruitmentOpen: { 'en-US': isOpen }
                    }
                })

                await entry.publish()
                console.log('Successfully created globalSettings entry')
            } catch (createError: unknown) {
                console.error('Failed to create globalSettings entry:', createError)
                const errorMessage = createError instanceof Error ? createError.message : 'Unknown error'
                throw new Error(`Global Settings entry not found and could not be created: ${errorMessage}. Please create a globalSettings entry manually in Contentful.`)
            }
        } else {
            entry = entries.items[0]

            entry.fields.isRecruitmentOpen = {
                'en-US': isOpen
            }

            const updatedEntry = await entry.update()
            await updatedEntry.publish()
        }

        revalidatePath('/admin/recruitment')
        revalidatePath('/pages/recruitment')
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

interface RecruitmentFormData {
    name: string
    email_college: string
    email_personal: string
    phone: string
    reg_no: string
    year: number
    section: string
    branch: string
    team_preference: string
    resume_link: string
    technical_skills?: string | null
    design_skills?: string | null
    description: string
}

export async function submitRecruitment(formData: RecruitmentFormData) {
    const supabase = await createAdminClient()

    const { data, error } = await supabase
        .from('recruitments')
        .insert([{
            name: formData.name,
            email_college: formData.email_college,
            email_personal: formData.email_personal,
            phone: formData.phone,
            reg_no: formData.reg_no,
            year: formData.year,
            section: formData.section,
            branch: formData.branch,
            team_preference: formData.team_preference,
            resume_link: formData.resume_link,
            techincal_skills: formData.technical_skills || null,
            design_skills: formData.design_skills || null,
            description: formData.description
        }])
        .select()

    if (error) {
        console.error('Error submitting recruitment:', JSON.stringify(error, null, 2))
        throw new Error(`Failed to submit application: ${error.message || 'Unknown error'}`)
    }

    return data
}
