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
                        <input
                            type="text"
                            name="venue"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Team Size (Members) *</label>
                        <input
                            type="text"
                            name="noMembers"
                            required
                            pattern="^\s*\d+\s*(?:-\s*\d+\s*)?$"
                            placeholder="e.g. 4 or 2-4"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Cover Image</label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        />
                        <p className="text-xs text-white/40 mt-1">Upload a cover image for the event</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Registration Link</label>
                        <input
                            type="url"
                            name="registrationLink"
                            placeholder="https://example.com/register"
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <p className="text-xs text-white/40 mt-1">Leave empty to use internal registration form</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10">
                        <input
                            type="checkbox"
                            name="isRegOpen"
                            id="isRegOpen"
                            value="true"
                            className="w-5 h-5 rounded bg-black/50 border-white/10 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                        />
                        <label htmlFor="isRegOpen" className="text-sm font-medium text-white cursor-pointer">
                            Registration Open
                        </label>
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
