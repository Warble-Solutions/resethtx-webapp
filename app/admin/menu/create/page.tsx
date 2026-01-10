'use client'

import { createMenuItem } from './actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SpotlightCard from '@/app/components/SpotlightCard'
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

export default function CreateMenuPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Add Menu Item</h1>
          <p className="text-slate-400 text-sm mt-1">Add a new dish or drink to the list.</p>
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

              // Clean up empty file inputs to prevent parsing errors
              const file = formData.get('image') as File
              if (file && file.size === 0) {
                formData.delete('image')
              }

              const form = e.currentTarget
              const result = await createMenuItem(formData)

              if (result && result.success) {
                // Reset form immediately
                form.reset()
                setSelectedCategory(CATEGORIES[0])

                // Navigate back
                router.refresh()
                router.push('/admin/menu')
              } else {
                throw new Error('Failed to create item')
              }
            } catch (error) {
              console.error("Submission Error:", error)
              alert("Failed to save item. Please try again.")
            } finally {
              setIsSubmitting(false)
            }
          }}
          className="flex flex-col gap-6"
        >

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
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none text-white appearance-none cursor-pointer"
                >
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
                required
                placeholder="e.g. Lamb Chops"
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Price</label>
              <input
                name="price"
                required
                placeholder="e.g. $35 or $15 / $250"
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Details about ingredients or portion size..."
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
            ></textarea>
          </div>

          {/* Image Upload */}
          {selectedCategory !== 'Hookah' ? (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 uppercase">Photo (Optional)</label>
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
              defaultChecked
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
            {isSubmitting ? 'Saving...' : 'Add to Menu'}
          </button>
        </form>
      </SpotlightCard>
    </div >
  )
}