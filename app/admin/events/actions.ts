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

export async function createEvent(formData: FormData) {
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const venue = formData.get('venue') as string
    const registrationLink = formData.get('registrationLink') as string
    const description = formData.get('description') as string

    if (!title || !date) {
        throw new Error('Title and Date are required')
    }

    // Auto-generate slug from title
    const slug = generateSlug(title)

    const environment = await getEnvironment()

    const entry = await environment.createEntry('event', {
        fields: {
            title: { 'en-US': title },
            slug: { 'en-US': slug },
            date: { 'en-US': date },
            venue: { 'en-US': venue },
            registrationLink: { 'en-US': createRichTextDocument(registrationLink) },
            description: { 'en-US': createRichTextDocument(description) },
            galleryImages: { 'en-US': [] }
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

    if (!eventId) throw new Error('Event ID is required')

    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)

    entry.fields.title['en-US'] = title
    entry.fields.date['en-US'] = date
    entry.fields.venue['en-US'] = venue
    entry.fields.registrationLink['en-US'] = createRichTextDocument(registrationLink)
    entry.fields.description['en-US'] = createRichTextDocument(description)

    const updatedEntry = await entry.update()
    await updatedEntry.publish()

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
    await updatedEntry.publish()

    revalidatePath(`/admin/events/${eventId}`)
}

export async function deleteEventImage(eventId: string, imageId: string) {
    const environment = await getEnvironment()
    const entry = await environment.getEntry(eventId)

    if (entry.fields.galleryImages && entry.fields.galleryImages['en-US']) {
        entry.fields.galleryImages['en-US'] = entry.fields.galleryImages['en-US'].filter(
            (link: any) => link.sys.id !== imageId
        )

        const updatedEntry = await entry.update()
        await updatedEntry.publish()
    }

    // Optionally delete the asset itself? The prompt says "unlink it".
    // "Delete Feature: Click an image to remove it from the gallery (unlink it)."
    // So I will just unlink.

    revalidatePath(`/admin/events/${eventId}`)
}
