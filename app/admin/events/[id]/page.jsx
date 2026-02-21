import { contentfulManagementClient, SPACE_ID, ENVIRONMENT_ID } from '@/lib/contentful-admin'
import { notFound } from 'next/navigation'
import EditEventClient from './EditEventClient'

// Disable caching so data is always fresh
export const dynamic = 'force-dynamic'

// Helper function to extract plain text from RichText document
function extractTextFromRichText(richText) {
    if (!richText || typeof richText === 'string') {
        return richText || ''
    }

    if (richText.content && Array.isArray(richText.content)) {
        return richText.content
            .map(node => {
                if (node.content && Array.isArray(node.content)) {
                    return node.content
                        .map(textNode => textNode.value || '')
                        .join('')
                }
                return ''
            })
            .join('\n')
    }

    return ''
}

async function getEventWithAssets(id) {
    try {
        const space = await contentfulManagementClient.getSpace(SPACE_ID)
        const environment = await space.getEnvironment(ENVIRONMENT_ID)
        const entry = await environment.getEntry(id)

        let coverImageAsset = null;
        if (entry.fields.coverImage?.['en-US']?.sys?.id) {
            try {
                const asset = await environment.getAsset(entry.fields.coverImage['en-US'].sys.id)
                coverImageAsset = {
                    sys: asset.sys,
                    fields: {
                        title: asset.fields.title?.['en-US'],
                        file: asset.fields.file?.['en-US']
                    }
                }
            } catch (e) {
                console.error("Cover image fetch error", e)
            }
        }

        let galleryImageAssets = [];
        const galleryLinks = entry.fields.galleryImages?.['en-US'] || [];

        galleryImageAssets = (await Promise.all(
            galleryLinks.map(async (link) => {
                if (link.sys?.id) {
                    try {
                        const asset = await environment.getAsset(link.sys.id)
                        return {
                            sys: asset.sys,
                            fields: {
                                title: asset.fields.title?.['en-US'],
                                file: asset.fields.file?.['en-US']
                            }
                        }
                    } catch (e) {
                        return null
                    }
                }
                return null
            })
        )).filter(Boolean)

        return { entry, coverImageAsset, galleryImageAssets }
    } catch (error) {
        console.error("Error fetching event for edit:", error)
        return null
    }
}

export default async function EditEventPage({ params }) {
    const { id } = await params
    const eventData = await getEventWithAssets(id)

    if (!eventData) {
        notFound()
    }

    const { entry, coverImageAsset, galleryImageAssets } = eventData
    const { title, date, venue, registrationLink, description, isRegOpen, noMembers } = entry.fields

    // Extract plain text from RichText fields
    const registrationLinkText = extractTextFromRichText(registrationLink?.['en-US'])
    const descriptionText = extractTextFromRichText(description?.['en-US'])

    // Format date for input (YYYY-MM-DD)
    const rawDate = date?.['en-US']
    const formattedDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : ''

    const initialData = {
        title: title?.['en-US'] || '',
        date: formattedDate,
        venue: venue?.['en-US'] || '',
        registrationLink: registrationLinkText,
        description: descriptionText,
        isRegOpen: isRegOpen?.['en-US'] || false,
        noMembers: noMembers?.['en-US'] || '',
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <EditEventClient
                eventId={id}
                initialData={initialData}
                coverImage={coverImageAsset}
                galleryImages={galleryImageAssets}
            />
        </div>
    )
}
