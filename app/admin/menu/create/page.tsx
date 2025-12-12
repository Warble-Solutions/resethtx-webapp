'use client'

import { createMenuItem, checkMenuConflict } from './actions'
import { compressImage } from '@/utils/compress'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState, useRef } from 'react'

export default function CreateMenuPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [conflict, setConflict] = useState<{ name: string, category: string } | null>(null)

  const categories = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Sides']

  const executeCreate = async (formData: FormData) => {
    // 1. Compression Magic
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
        try {
            const compressed = await compressImage(imageFile)
            formData.set('image', compressed)
            console.log(`Compressed: ${(imageFile.size/1024).toFixed(0)}kb -> ${(compressed.size/1024).toFixed(0)}kb`)
        } catch (err) {
            console.error("Compression failed", err)
        }
    }

    // 2. Send to server
    await createMenuItem(formData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setIsLoading(true)
    const formData = new FormData(formRef.current)

    // Check for duplicates
    const result = await checkMenuConflict(formData)

    if (result.conflict && result.existingItem) {
      setConflict(result.existingItem)
      setIsLoading(false) 
    } else {
      await executeCreate(formData)
    }
  }

  const handleForceCreate = async () => {
    if (!formRef.current) return
    setIsLoading(true)
    const formData = new FormData(formRef.current)
    await executeCreate(formData)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Add Menu Item</h1>
            <p className="text-slate-400 text-sm mt-1">Add a new dish to the menu.</p>
        </div>
        <Link href="/admin/menu" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Item Name</label>
            <input name="name" required type="text" placeholder="e.g. Wagyu Steak" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Price ($)</label>
              <input name="price" required type="number" step="0.01" placeholder="12.50" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
              <select name="category" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none">
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea name="description" rows={3} placeholder="Ingredients, allergies, etc." className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600"></textarea>
          </div>

          {/* Image */}
          <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <label className="block text-sm font-bold text-slate-300 mb-2">Photo</label>
            <input name="image" type="file" accept="image/*" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <input type="checkbox" name="is_available" defaultChecked className="w-5 h-5 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-blue-500 focus:ring-offset-slate-900" />
            <div>
              <label className="block text-sm font-bold text-white">Available to Order</label>
              <p className="text-xs text-slate-400">Uncheck to mark as "Sold Out".</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all md:self-end w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isLoading ? 'Optimizing & Saving...' : 'Save Item'}
          </button>
        </form>
      </SpotlightCard>

      {/* --- DUPLICATE ITEM MODAL --- */}
      {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/50 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-2xl">⚠️</div>
                <h3 className="text-xl font-bold text-white">Duplicate Item</h3>
              </div>
              <p className="text-slate-300 mb-4">An item with this name already exists in your menu:</p>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
                <div className="text-white font-bold text-lg text-center mb-1">"{conflict.name}"</div>
                <div className="text-slate-400 text-xs text-center uppercase tracking-wider">Found in Category: <span className="text-blue-400 font-bold">{conflict.category}</span></div>
              </div>
              <p className="text-slate-400 text-sm">Do you want to create it anyway?</p>
            </div>
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => { setConflict(null); setIsLoading(false) }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium">Cancel</button>
              <button onClick={handleForceCreate} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-lg shadow-red-900/20 flex items-center gap-2">
                {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}