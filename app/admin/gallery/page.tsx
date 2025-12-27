'use client'

import { useState, useEffect } from 'react'
import SpotlightCard from '@/app/components/SpotlightCard'
import { uploadImage, deleteImage, getGalleryImages } from '@/app/actions/gallery'
import Image from 'next/image'

interface GalleryImage {
    id: string
    image_url: string
    created_at: string
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Fetch images on mount
    useEffect(() => {
        loadImages()
    }, [])

    async function loadImages() {
        const data = await getGalleryImages()
        setImages(data || [])
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadImage(formData)
        if (res.success) {
            await loadImages() // Refresh list
            // Reset input
            e.target.value = ''
        } else {
            alert('Upload Failed: ' + res.error)
        }
        setIsUploading(false)
    }

    async function handleDelete(id: string, url: string) {
        if (!confirm('Are you sure you want to delete this photo?')) return

        setIsDeleting(id)
        const res = await deleteImage(id, url)
        if (res.success) {
            setImages(prev => prev.filter(img => img.id !== id))
        } else {
            alert('Delete Failed ' + res.error)
        }
        setIsDeleting(null)
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gallery Manager</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage photos displayed on the main Gallery page.</p>
                </div>

                {/* Upload Button */}
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button className="bg-[#D4AF37] text-black font-bold py-2 px-6 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                Add Photo
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            <SpotlightCard className="p-8">
                {images.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p>No images uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                                <Image
                                    src={img.image_url}
                                    alt="Gallery Image"
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                                    <button
                                        onClick={() => handleDelete(img.id, img.image_url)}
                                        disabled={isDeleting === img.id}
                                        className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                                    >
                                        {isDeleting === img.id ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SpotlightCard>
        </div>
    )
}
