'use client'

import { useState, useTransition } from 'react'
import { uploadEventImage, deleteEventImage } from '../actions'
import Image from 'next/image'

export default function GalleryManager({ eventId, images = [] }) {
    const [isPending, startTransition] = useTransition()
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0])
        }
    }

    const handleUpload = (file) => {
        const formData = new FormData()
        formData.append('file', file)

        startTransition(async () => {
            try {
                await uploadEventImage(eventId, formData)
            } catch (error) {
                console.error('Upload failed:', error)
                alert('Upload failed. Please try again.')
            }
        })
    }

    const handleDelete = (imageId) => {
        if (!confirm('Are you sure you want to remove this image?')) return

        startTransition(async () => {
            try {
                await deleteEventImage(eventId, imageId)
            } catch (error) {
                console.error('Delete failed:', error)
                alert('Delete failed. Please try again.')
            }
        })
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Gallery</h3>

            <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="gallery-upload"
                    disabled={isPending}
                />
                <label
                    htmlFor="gallery-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                        {isPending ? '⏳' : '📤'}
                    </div>
                    <p className="text-white/60">
                        {isPending ? 'Processing...' : 'Drag & drop or click to upload'}
                    </p>
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.sys.id} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5">
                        {image.fields?.file?.url && (
                            <Image
                                src={`https:${image.fields.file.url}`}
                                alt={image.fields.title || 'Gallery Image'}
                                fill
                                className="object-cover"
                            />
                        )}
                        <button
                            onClick={() => handleDelete(image.sys.id)}
                            disabled={isPending}
                            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
