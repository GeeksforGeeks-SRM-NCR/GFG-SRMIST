'use client'

import { useRouter } from 'next/navigation'
import { EditEvent } from '@/app/admin/components/EditEvent'
import { updateEventDetails } from '../actions'

export default function EditEventClient({ eventId, initialData, coverImage, galleryImages }) {
    const router = useRouter()

    const handleBack = () => {
        router.push('/admin/events')
    }

    const handleSave = async (formData) => {
        await updateEventDetails(formData)
        router.refresh()
    }

    return (
        <EditEvent
            eventId={eventId}
            initialData={initialData}
            coverImage={coverImage}
            galleryImages={galleryImages}
            onBack={handleBack}
            onSave={handleSave}
        />
    )
}
