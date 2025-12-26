'use client'

import { updateEvent } from './actions'
import { compressImage } from '@/utils/compress'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface EventData {
  id: string
  title: string
  date: string
  time: string | null
  tickets: number
  description: string
  image_url: string | null
  featured_image_url: string | null
  is_featured: boolean
}

export default function EditEventForm({ event }: { event: EventData }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFeatured, setIsFeatured] = useState(event.is_featured) // <--- NEW STATE

  // --- SAFETY PARSING START ---
  // 1. Fix Date: Ensure strictly YYYY-MM-DD (strips time/timezone info if present)
  let safeDate = ''
  if (event.date) {
    // If it's already YYYY-MM-DD, keep it. If it's ISO, split it.
    safeDate = event.date.includes('T') ? event.date.split('T')[0] : event.date
  }

  // 2. Fix Time: Default to 12:00 if null, handle parsing safely
  const timeString = event.time || '12:00:00'
  const [hStr, mStr] = timeString.split(':')

  // Calculate 12-hour format values
  let rawHour = parseInt(hStr || '12')
  const minute = mStr || '00'
  const ampm = rawHour >= 12 ? 'PM' : 'AM'

  // Convert 24h -> 12h for the dropdown
  let displayHour = rawHour
  if (rawHour > 12) displayHour -= 12
  if (rawHour === 0) displayHour = 12

  // 3. Fix Tickets: Ensure it's not null/undefined
  const safeTickets = event.tickets ?? 0
  // --- SAFETY PARSING END ---

  const executeUpdate = async (formData: FormData) => {
    const imageFile = formData.get('image') as File
    if (imageFile && imageFile.size > 0) {
      try {
        const compressed = await compressImage(imageFile)
        formData.set('image', compressed)
      } catch (err) {
        console.error("Compression failed", err)
      }
    }
    await updateEvent(formData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setIsSubmitting(true)
    const formData = new FormData(formRef.current)
    await executeUpdate(formData)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Event</h1>
          <p className="text-slate-400 text-sm mt-1">Update details for "{event.title}"</p>
        </div>
        <Link href="/admin/events" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={event.id} />

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Event Title</label>
            <input name="title" defaultValue={event.title} required type="text" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Date & Time</label>
              <div className="flex flex-col gap-3">
                {/* Fixed Date Input */}
                <input
                  name="date"
                  defaultValue={safeDate}
                  required
                  type="date"
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white color-scheme-dark"
                />
                <div className="flex gap-2">
                  <select name="time_hour" defaultValue={displayHour} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (<option key={h} value={h}>{h}</option>))}
                  </select>
                  <select name="time_minute" defaultValue={minute} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <select name="time_ampm" defaultValue={ampm} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                    <option value="PM">PM</option>
                    <option value="AM">AM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Total Tickets</label>
              <input
                name="tickets"
                defaultValue={safeTickets}
                required
                type="number"
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea name="description" defaultValue={event.description || ''} rows={4} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"></textarea>
          </div>

          {/* Image */}
          <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <label className="block text-sm font-bold text-slate-300 mb-2">Cover Image</label>
            {event.image_url && (
              <div className="mb-4 relative h-40 w-full rounded-md overflow-hidden border border-slate-700">
                <Image src={event.image_url} alt="Current" fill className="object-cover opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold uppercase tracking-widest">Current Image</div>
              </div>
            )}
            <input name="image" type="file" accept="image/*" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-white hover:file:text-black cursor-pointer transition-colors" />
            <p className="text-xs text-slate-500 mt-2">Leave empty to keep the current image.</p>
          </div>

          {/* FEATURED TOGGLE (Fixed with Label) */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg group hover:border-[#D4AF37]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              </div>
              <div>
                <label htmlFor="featured-toggle" className="block text-sm font-bold text-white cursor-pointer select-none">Feature on Homepage</label>
                <p className="text-xs text-slate-400">Mark this as the main banner event.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="featured-toggle"
                type="checkbox"
                name="is_featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
            </label>
          </div>

          {/* Conditional Banner Input */}
          {isFeatured && (
            <div className="p-4 border border-dashed border-[#D4AF37]/50 rounded-lg bg-[#D4AF37]/5 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🌟</span>
                <label className="block text-sm font-bold text-[#D4AF37]">Hero Banner (Landscape)</label>
              </div>

              {event.featured_image_url && (
                <div className="mb-4 relative h-32 w-full rounded-md overflow-hidden border border-[#D4AF37]/30">
                  <Image src={event.featured_image_url} alt="Current Banner" fill className="object-cover opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold uppercase tracking-widest">Current Banner</div>
                </div>
              )}

              <input name="featured_image" type="file" accept="image/*" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-white hover:file:text-black cursor-pointer transition-colors" />
              <p className="text-xs text-slate-500 mt-2">Recommended size: 1920x1080px for best results.</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-linear-to-r from-[#D4AF37] to-[#B3932D] hover:from-white hover:to-slate-200 hover:text-black text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all w-full md:w-auto md:self-end disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {isSubmitting ? 'Optimizing & Saving...' : 'Update Event'}
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}