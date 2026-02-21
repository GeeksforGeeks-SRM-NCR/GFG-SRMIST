'use client'

import { useState, useTransition } from 'react'
import { unpublishEventAction, deleteEventAction, publishEventAction } from '../actions'
import { ActionModal } from './ActionModal'

export default function EventActions({ eventId, isPublished }) {
    const [isPending, startTransition] = useTransition()

    // Modal states
    const [unpublishModalOpen, setUnpublishModalOpen] = useState(false)
    const [publishModalOpen, setPublishModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const handleUnpublish = () => {
        setUnpublishModalOpen(false)
        startTransition(async () => {
            try {
                await unpublishEventAction(eventId)
            } catch (error) {
                console.error('Failed to unpublish', error)
                alert('Failed to unpublish event')
            }
        })
    }

    const handlePublish = () => {
        setPublishModalOpen(false)
        startTransition(async () => {
            try {
                await publishEventAction(eventId)
            } catch (error) {
                console.error('Failed to publish', error)
                alert('Failed to publish event')
            }
        })
    }

    const handleDelete = () => {
        setDeleteModalOpen(false)
        startTransition(async () => {
            try {
                await deleteEventAction(eventId)
            } catch (error) {
                console.error('Failed to delete', error)
                alert('Failed to delete event')
            }
        })
    }

    return (
        <div
            className="flex gap-2 z-10 w-full justify-end"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            {isPublished ? (
                <button
                    disabled={isPending}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUnpublishModalOpen(true) }}
                    className="p-2 text-yellow-500 hover:text-yellow-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 hover:border-yellow-500/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                </button>
            ) : (
                <button
                    disabled={isPending}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPublishModalOpen(true) }}
                    className="p-2 text-emerald-500 hover:text-emerald-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 hover:border-emerald-500/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            )}

            <button
                disabled={isPending}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteModalOpen(true) }}
                className="p-2 text-red-500 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5 hover:border-red-500/30"
            >
                {isPending ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                )}
            </button>

            {/* Modals */}
            <ActionModal
                isOpen={unpublishModalOpen}
                onClose={() => setUnpublishModalOpen(false)}
                onConfirm={handleUnpublish}
                title="Unpublish Event"
                message="Are you sure you want to unpublish this event? It will no longer be visible to users on the main website."
                confirmText="Yes, Unpublish"
            />

            <ActionModal
                isOpen={publishModalOpen}
                onClose={() => setPublishModalOpen(false)}
                onConfirm={handlePublish}
                title="Publish Event"
                message="Are you sure you want to publish this event? It will become visible to users immediately."
                confirmText="Yes, Publish"
            />

            <ActionModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Event"
                message="Warning: You are about to delete this event. This requires two confirmations to proceed."
                confirmText="Proceed to Delete"
                isDestructive={true}
                requireDoubleConfirm={true}
            />
        </div>
    )
}
