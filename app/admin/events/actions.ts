'use server'

import { contentfulManagementClient, SPACE_ID, ENVIRONMENT_ID } from '@/lib/contentful-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Helper function to convert plain text to RichText format
function createRichTextDocument(text: string) {
    if (!text || text.trim() === '') {
        return {
            nodeType: 'document',
            data: {},
            content: []
        }
    }

    return {
        nodeType: 'document',
        data: {},
        content: [
            {
                nodeType: 'paragraph',
                data: {},
                content: [
                    {
                        nodeType: 'text',
                        value: text,
                        marks: [],
                        data: {}
                    }
                ]
            }
        ]
    }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

async function getEnvironment() {
    const space = await contentfulManagementClient.getSpace(SPACE_ID)
    return space.getEnvironment(ENVIRONMENT_ID)
}

// Helper function to upload an asset to Contentful
async function uploadAsset(environment: any, file: File) {
    const arrayBuffer = await file.arrayBuffer()

    const upload = await environment.createUpload({ file: arrayBuffer })

    let asset = await environment.createAsset({
        fields: {
            title: { 'en-US': file.name },
            file: {
                'en-US': {
                    fileName: file.name,
                    contentType: file.type,
                    uploadFrom: {
                        sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id }
                    }
                }
            }
        }
    })

    asset = await asset.processForAllLocales()

    const MAX_RETRIES = 10
    for (let i = 0; i < MAX_RETRIES; i++) {
        await new Promise(r => setTimeout(r, 1000))
        asset = await environment.getAsset(asset.sys.id)
        if (asset.fields.file['en-US'].url) break
    }

    asset = await asset.publish()
    return asset
}

export async function createEvent(formData: FormData) {
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const venue = formData.get('venue') as string
    const registrationLink = formData.get('registrationLink') as string
    const description = formData.get('description') as string
    const isRegOpenStr = formData.get('isRegOpen') as string
    const isRegOpen = isRegOpenStr === 'true' || isRegOpenStr === 'on'
    const noMembers = formData.get('noMembers') as string
    const coverImageFile = formData.get('coverImage') as File | null

    if (!title || !date) {
        throw new Error('Title and Date are required')
    }

    if (!noMembers || !/^\s*\d+\s*(?:-\s*\d+\s*)?$/.test(noMembers)) {
        throw new Error('Team member value must be a number or a range (e.g. "4" or "2-4")')
    }

    const slug = generateSlug(title)
    const environment = await getEnvironment()

    let coverImageLink = null
    if (coverImageFile && coverImageFile.size > 0) {
        const asset = await uploadAsset(environment, coverImageFile)
        coverImageLink = { sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id } }
    }

    const entry = await environment.createEntry('event', {
        fields: {
            title: { 'en-US': title },
            slug: { 'en-US': slug },
            date: { 'en-US': date },
            venue: { 'en-US': venue },
            isRegOpen: { 'en-US': isRegOpen },
            noMembers: { 'en-US': noMembers },
            registrationLink: { 'en-US': createRichTextDocument(registrationLink) },
            description: { 'en-US': createRichTextDocument(description) },
            galleryImages: { 'en-US': [] },
            ...(coverImageLink && { coverImage: { 'en-US': coverImageLink } })
        }
    })

    await entry.publish()
    revalidatePath('/admin/events')
    redirect(`/admin/events/${entry.sys.id}`)
}

export async function updateEventDetails(formData: FormData) {
    const eventId = formData.get('eventId') as string
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const venue = formData.get('venue') as string
    const registrationLink = formData.get('registrationLink') as string
    const description = formData.get('description') as string
    const isRegOpenStr = formData.get('isRegOpen') as string
    const isRegOpen = isRegOpenStr === 'true' || isRegOpenStr === 'on'
    const noMembers = formData.get('noMembers') as string
    const coverImageFile = formData.get('coverImage') as File | null

    if (!eventId) throw new Error('Event ID is required')
    if (!noMembers || !/^\s*\d+\s*(?:-\s*\d+\s*)?$/.test(noMembers)) {
        throw new Error('Team member value must be a number or a range (e.g. "4" or "2-4")')
    }

    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)

    const isPublished = !!entry.sys.publishedVersion

    // Handle Title, Date, Venue
    entry.fields.title['en-US'] = title
    entry.fields.date['en-US'] = date
    entry.fields.venue['en-US'] = venue

    // Handle Registration Status
    if (!entry.fields.isRegOpen) entry.fields.isRegOpen = {}
    entry.fields.isRegOpen['en-US'] = isRegOpen

    // Handle No. of Members
    if (!entry.fields.noMembers) entry.fields.noMembers = {}
    entry.fields.noMembers['en-US'] = noMembers

    // Handle Rich Text Fields
    entry.fields.registrationLink['en-US'] = createRichTextDocument(registrationLink)
    entry.fields.description['en-US'] = createRichTextDocument(description)

    // Handle Cover Image Upload
    if (coverImageFile && coverImageFile.size > 0) {
        // Upload the new asset
        const asset = await uploadAsset(environment, coverImageFile)

        // Link it to the entry
        if (!entry.fields.coverImage) entry.fields.coverImage = {}
        entry.fields.coverImage['en-US'] = {
            sys: {
                type: 'Link',
                linkType: 'Asset',
                id: asset.sys.id
            }
        }
    }

    const updatedEntry = await entry.update()
    if (isPublished) {
        await updatedEntry.publish()
    }

    revalidatePath(`/admin/events/${eventId}`)
    revalidatePath('/admin/events')
}

export async function uploadEventImage(eventId: string, formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const arrayBuffer = await file.arrayBuffer()

    const environment = await getEnvironment()

    // Step 1: Upload file
    const upload = await environment.createUpload({
        file: arrayBuffer
    })

    // Step 2: Create Asset
    let asset = await environment.createAsset({
        fields: {
            title: { 'en-US': file.name },
            file: {
                'en-US': {
                    fileName: file.name,
                    contentType: file.type,
                    uploadFrom: {
                        sys: {
                            type: 'Link',
                            linkType: 'Upload',
                            id: upload.sys.id
                        }
                    }
                }
            }
        }
    })

    // Step 3: Process Asset
    asset = await asset.processForAllLocales()

    // Wait for processing to complete (simple polling)
    // In a real app, might want robust polling, but for now we assume it's quick or we wait a bit
    // Actually, processForAllLocales returns the asset but processing happens async on Contentful side usually.
    // However, the JS SDK processForAllLocales might wait? No, it triggers it.
    // We need to publish it. Publishing requires it to be processed.
    // Let's try to publish. If it fails, we might need to wait.
    // For simplicity in this turn, I'll just try to publish.

    // A small delay might be needed or polling. 
    // Let's implement a simple poll.
    const MAX_RETRIES = 10
    for (let i = 0; i < MAX_RETRIES; i++) {
        await new Promise(r => setTimeout(r, 1000))
        asset = await environment.getAsset(asset.sys.id)
        if (asset.fields.file['en-US'].url) {
            break
        }
    }

    // Step 4: Publish Asset
    try {
        asset = await asset.publish()
    } catch (e) {
        console.error('Failed to publish asset', e)
        throw new Error('Failed to publish asset, likely processing not finished')
    }

    // Step 5: Link to Event
    const entry = await environment.getEntry(eventId)
    const isPublished = !!entry.sys.publishedVersion

    if (!entry.fields.galleryImages) {
        entry.fields.galleryImages = { 'en-US': [] }
    }
    if (!entry.fields.galleryImages['en-US']) {
        entry.fields.galleryImages['en-US'] = []
    }

    entry.fields.galleryImages['en-US'].push({
        sys: {
            type: 'Link',
            linkType: 'Asset',
            id: asset.sys.id
        }
    })

    const updatedEntry = await entry.update()
    if (isPublished) {
        await updatedEntry.publish()
    }

    revalidatePath(`/admin/events/${eventId}`)
}

export async function deleteEventImage(eventId: string, imageId: string) {
    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)
    const isPublished = !!entry.sys.publishedVersion

    if (entry.fields.galleryImages && entry.fields.galleryImages['en-US']) {
        entry.fields.galleryImages['en-US'] = entry.fields.galleryImages['en-US'].filter(
            (link: any) => link.sys.id !== imageId
        )

        const updatedEntry = await entry.update()
        if (isPublished) {
            await updatedEntry.publish()
        }
    }

    // Optionally delete the asset itself? The prompt says "unlink it".
    // "Delete Feature: Click an image to remove it from the gallery (unlink it)."
    // So I will just unlink.

    revalidatePath(`/admin/events/${eventId}`)
}

export async function uploadCoverImage(eventId: string, formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const environment = await getEnvironment()
    const asset = await uploadAsset(environment, file)

    const entry = await environment.getEntry(eventId)
    const isPublished = !!entry.sys.publishedVersion

    if (!entry.fields.coverImage) {
        entry.fields.coverImage = {}
    }
    entry.fields.coverImage['en-US'] = {
        sys: {
            type: 'Link',
            linkType: 'Asset',
            id: asset.sys.id
        }
    }

    const updatedEntry = await entry.update()
    if (isPublished) {
        await updatedEntry.publish()
    }

    revalidatePath(`/admin/events/${eventId}`)
}

export async function deleteCoverImage(eventId: string) {
    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)
    const isPublished = !!entry.sys.publishedVersion

    const updatedEntry = await entry.update()
    if (isPublished) {
        await updatedEntry.publish()
    }

    revalidatePath(`/admin/events/${eventId}`)
}

export async function publishEventAction(eventId: string) {
    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)

    // Check if the entry is unpublished/draft
    await entry.publish()

    revalidatePath('/admin/events')
}

export async function unpublishEventAction(eventId: string) {
    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)

    // Check if the entry is published
    if (entry.sys.publishedVersion) {
        await entry.unpublish()
    }

    revalidatePath('/admin/events')
}

export async function deleteEventAction(eventId: string) {
    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)

    // Check if the entry is published, it needs to be unpublished before deleting
    if (entry.sys.publishedVersion) {
        await entry.unpublish()
    }

    await entry.delete()
    revalidatePath('/admin/events')
}
