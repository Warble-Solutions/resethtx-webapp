'use client'

import { createEvent, checkEventConflict } from './actions'
import { compressImage } from '@/utils/compress'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState, useRef } from 'react'

export default function CreateEventPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [conflict, setConflict] = useState<{ title: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper to handle compression and creation
  const executeCreate = async (formData: FormData) => {
    // 1. Compression Magic
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
        try {
            const compressed = await compressImage(imageFile)
            formData.set('image', compressed)
            console.log(`Compressed: ${(imageFile.size/1024).toFixed(0)}kb -> ${(compressed.size/1024).toFixed(0)}kb`)
        } catch (err) {
            console.error("Compression failed, using original.", err)
        }
    }
    
    // 2. Send to server
    await createEvent(formData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setIsSubmitting(true)
    const formData = new FormData(formRef.current)

    // Check for conflict
    const result = await checkEventConflict(formData)

    if (result.conflict) {
      setConflict({ title: result.title || 'Another Event' })
      setIsSubmitting(false)
    } else {
      await executeCreate(formData)
    }
  }

  const handleForceCreate = async () => {
    if (!formRef.current) return
    setIsSubmitting(true)
    const formData = new FormData(formRef.current)
    await executeCreate(formData)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Add New Event</h1>
            <p className="text-slate-400 text-sm mt-1">Create a new party or gathering.</p>
        </div>
        <Link href="/admin/events" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Event Title</label>
            <input name="title" required type="text" placeholder="e.g. Jazz Night" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Date & Time</label>
              <div className="flex flex-col gap-3">
                <input name="date" required type="date" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white color-scheme-dark" />
                <div className="flex gap-2">
                  <select name="time_hour" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">{Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (<option key={h} value={h}>{h}</option>))}</select>
                  <select name="time_minute" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"><option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option></select>
                  <select name="time_ampm" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"><option value="PM">PM</option><option value="AM">AM</option></select>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Total Tickets</label>
              <input name="tickets" required type="number" placeholder="100" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea name="description" rows={4} placeholder="What is this event about?" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"></textarea>
          </div>

          {/* Image */}
          <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <label className="block text-sm font-bold text-slate-300 mb-2">Cover Image</label>
            <input name="image" type="file" accept="image/*" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-white hover:file:text-black cursor-pointer transition-colors" />
          </div>

          {/* --- NEW FEATURED TOGGLE --- */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg group hover:border-[#D4AF37]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <label htmlFor="featured-toggle" className="block text-sm font-bold text-white cursor-pointer select-none">Feature on Homepage</label>
                <p className="text-xs text-slate-400">This event will be the main banner on the website.</p>
              </div>
            </div>
            
            {/* CHANGED FROM DIV TO LABEL */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                id="featured-toggle" 
                type="checkbox" 
                name="is_featured" 
                className="peer sr-only" 
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>
          {/* --------------------------- */}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 bg-linear-to-r from-[#D4AF37] to-[#B3932D] hover:from-white hover:to-slate-200 hover:text-black text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all w-full md:w-auto md:self-end disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {isSubmitting ? 'Optimizing & Saving...' : 'Create Event'}
          </button>
        </form>
      </SpotlightCard>

      {/* --- CONFLICT MODAL --- */}
      {conflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/50 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-2xl">⚠️</div>
                <h3 className="text-xl font-bold text-white">Scheduling Conflict</h3>
              </div>
              <p className="text-slate-300 mb-4">You already have an event scheduled for this exact time:</p>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white font-bold text-center mb-6">"{conflict.title}"</div>
              <p className="text-slate-400 text-sm">Do you want to create this event anyway?</p>
            </div>
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setConflict(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium">Cancel</button>
              <button onClick={handleForceCreate} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-lg shadow-red-900/20 flex items-center gap-2">
                {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}