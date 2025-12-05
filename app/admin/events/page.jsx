import { contentfulManagementClient, SPACE_ID, ENVIRONMENT_ID } from '@/lib/contentful-admin'
import Link from 'next/link'

async function getEvents() {
    const space = await contentfulManagementClient.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT_ID)
    const entries = await environment.getEntries({
        content_type: 'event',
        order: '-fields.date'
    })
    return entries.items
}

export default async function EventsDashboard() {
    const events = await getEvents()

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Event Management
                    </h1>
                    <Link
                        href="/admin/events/new"
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors"
                    >
                        Create New Event
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const title = event.fields.title?.['en-US'] || 'Untitled Event'
                        const date = event.fields.date?.['en-US']
                        const venue = event.fields.venue?.['en-US']

                        return (
                            <Link
                                key={event.sys.id}
                                href={`/admin/events/${event.sys.id}`}
                                className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300"
                            >
                                <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                                    {title}
                                </h2>
                                <div className="space-y-1 text-sm text-white/60">
                                    <p>📅 {date ? new Date(date).toLocaleDateString() : 'No date'}</p>
                                    <p>📍 {venue || 'No venue'}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
