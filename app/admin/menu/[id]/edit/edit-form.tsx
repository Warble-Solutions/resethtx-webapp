'use client'

import { updateMenuItem } from '../../create/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SpotlightCard from '@/app/components/SpotlightCard'
import Image from 'next/image'
import { useState } from 'react'

const CATEGORIES = [
    'Signatures',
    'Happy Hour',
    'Spirits & Bottles',
    'Exotic & Daily',
    'Bar Bites',
    'Hookah'
]

const SPIRIT_SUBCATEGORIES = [
    'Vodka',
    'Tequila',
    'Whiskey',
    'Cognac',
    'Scotch',
    'Champagne',
    'Package'
]

export default function EditMenuForm({ item }: { item: any }) {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState(item.category)
    const [isSubmitting, setIsSubmitting] = useState(false)

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Item</h1>
                    <p className="text-slate-400 text-sm mt-1">Update details for <span className="text-[#D4AF37]">{item.name}</span></p>
                </div>
                <Link href="/admin/menu" className="text-slate-400 hover:text-white hover:underline">
                    Cancel
                </Link>
            </div>

            <SpotlightCard className="p-8">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setIsSubmitting(true)
                        try {
                            const formData = new FormData(e.currentTarget)

                            // Clean up empty file inputs
                            const file = formData.get('image') as File
                            if (file && file.size === 0) {
                                formData.delete('image')
                            }

                            const result = await updateMenuItem(formData)
                            if (result && result.success) {
                                router.refresh()
                                router.push('/admin/menu')
                            } else {
                                throw new Error('Failed to update item')
                            }
                        } catch (error) {
                            console.error("Submission Error:", error)
                            alert("Failed to update item.")
                        } finally {
                            setIsSubmitting(false)
                        }
                    }}
                    className="flex flex-col gap-6"
                >

                    {/* Hidden ID Field (Crucial) */}
                    <input type="hidden" name="id" value={item.id} />

                    {/* Category Select */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Category</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-white appearance-none cursor-pointer"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-slate-500">▼</div>
                        </div>
                    </div>

                    {/* Subcategory Select (Conditional) */}
                    {selectedCategory === 'Spirits & Bottles' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Spirit Type</label>
                            <div className="relative">
                                <select
                                    name="subcategory"
                                    defaultValue={item.subcategory || ''}
                                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-white appearance-none cursor-pointer"
                                >
                                    {/* Option for empty if not set previously? Maybe defaults to first one. */}
                                    {SPIRIT_SUBCATEGORIES.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                </select>
                                <div className="absolute right-4 top-4 pointer-events-none text-slate-500">▼</div>
                            </div>
                        </div>
                    )}

                    {/* Name & Price Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Item Name</label>
                            <input
                                name="name"
                                defaultValue={item.name}
                                required
                                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Price</label>
                            <input
                                name="price"
                                defaultValue={item.price}
                                required
                                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Description</label>
                        <textarea
                            name="description"
                            defaultValue={item.description}
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
                        ></textarea>
                    </div>

                    {/* Current Image Preview */}
                    {item.image_url && (
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                            <div className="w-16 h-16 relative rounded overflow-hidden">
                                <Image src={item.image_url} alt="Current" fill className="object-cover" />
                            </div>
                            <div className="text-xs text-slate-400">
                                <p className="font-bold text-white">Current Image</p>
                                <p>Upload a new file below only if you want to replace this.</p>
                            </div>
                        </div>
                    )}

                    {/* Image Upload */}
                    {selectedCategory !== 'Hookah' ? (
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">New Photo (Optional)</label>
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-white transition-all cursor-pointer"
                            />
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-400">
                            <span className="text-[#D4AF37] font-bold">NOTE:</span> Images are disabled for Hookah items. They will be displayed as a text list.
                        </div>
                    )}

                    {/* Availability Toggle */}
                    <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                        <input
                            type="checkbox"
                            name="is_available"
                            id="is_available"
                            defaultChecked={item.is_available}
                            className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
                        />
                        <label htmlFor="is_available" className="text-white text-sm cursor-pointer select-none">
                            Mark as Available (Uncheck if Sold Out)
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 bg-[#D4AF37] hover:bg-white text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all w-full flex items-center justify-center gap-2"
                    >
                        {isSubmitting && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                        {isSubmitting ? 'Saving Changes' : 'Save Changes'}
                    </button>
                </form>
            </SpotlightCard>
        </div >
    )
}
