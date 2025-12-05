import { contentfulClient } from '@/lib/contentful'
import { updateEventDetails } from '../actions'
import GalleryManager from './GalleryManager'
import { notFound } from 'next/navigation'

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

    const { title, date, venue, registrationLink, description, galleryImages } = event.fields

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Edit Event
                    </h1>
                    <a href="/admin/events" className="text-white/60 hover:text-white transition-colors">
                        ← Back to Events
                    </a>
                </div>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-6">Event Details</h3>
                    <form action={updateEventDetails} className="space-y-6">
                        <input type="hidden" name="eventId" value={id} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={title}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    defaultValue={date}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    defaultValue={venue}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Registration Link</label>
                                <input
                                    type="url"
                                    name="registrationLink"
                                    defaultValue={registrationLink}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                defaultValue={description}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <GalleryManager eventId={id} images={galleryImages} />
                </div>
            </div>
        </div>
    )
}
