import { contentfulClient } from '@/lib/contentful'
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

async function getEvent(id) {
    try {
        const entry = await contentfulClient.getEntry(id)
        return entry
    } catch (error) {
        return null
    }
}

export default async function EditEventPage({ params }) {
    const { id } = await params
    const event = await getEvent(id)

    if (!event) {
        notFound()
    }

    const { title, date, venue, registrationLink, description, galleryImages, coverImage, isRegOpen } = event.fields

    // Extract plain text from RichText fields
    const registrationLinkText = extractTextFromRichText(registrationLink)
    const descriptionText = extractTextFromRichText(description)

    // Format date for input (YYYY-MM-DD)
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : ''

    const initialData = {
        title: title || '',
        date: formattedDate,
        venue: venue || '',
        registrationLink: registrationLinkText,
        description: descriptionText,
        isRegOpen: isRegOpen || false,
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <EditEventClient
                eventId={id}
                initialData={initialData}
                coverImage={coverImage}
                galleryImages={galleryImages || []}
            />
        </div>
    )
}
