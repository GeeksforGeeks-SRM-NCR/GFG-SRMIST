'use client'

import { createEvent } from '../actions'

export default function NewEventPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Create New Event
                </h1>

                <form action={createEvent} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Venue</label>
                        <input
                            type="text"
                            name="venue"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Registration Link</label>
                        <input
                            type="url"
                            name="registrationLink"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors"
                    >
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    )
}
