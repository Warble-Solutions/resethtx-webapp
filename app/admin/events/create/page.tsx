'use client'

import { createEvent, checkEventConflict } from './actions'
import { compressImage } from '@/utils/compress'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState, useRef } from 'react'

import ImageUploadWithCrop from '@/app/components/admin/ImageUploadWithCrop'
import WordCountTextarea from '@/app/components/admin/WordCountTextarea'
import { EVENT_CATEGORIES } from '@/app/constants'

export default function CreateEventPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [conflict, setConflict] = useState<{ title: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isExternal, setIsExternal] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [imageFile, setImageFile] = useState<Blob | null>(null)
  const [featuredImageFile, setFeaturedImageFile] = useState<Blob | null>(null)

  // Helper to handle compression and creation
  const executeCreate = async (formData: FormData) => {
    // 1. Compression Magic / Blob Handling
    // If we have a cropped blob, use it.
    if (imageFile) {
      formData.set('image', imageFile, 'image.jpg')
    }
    if (featuredImageFile) {
      formData.set('featured_image', featuredImageFile, 'featured_image.jpg')
    }

    const imageInput = formData.get('image') as File | Blob
    // We can still try to compress if it's a File, but if it's a Blob directly from canvas it might be optimized enough or we compress it too.
    // existing compressImage utils might expect a File.
    // For now let's assume the crop output is fine or rely on existing logic if it operates on Blobs.

    // 2. Send to server
    await createEvent(formData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setIsSubmitting(true)
    const formData = new FormData(formRef.current)

    // Check for conflict
    // Start Word Count Check
    const description = formData.get('description') as string
    const wordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length
    if (wordCount > 50) {
      alert("Please shorten the description to 50 words or less.")
      setIsSubmitting(false)
      return
    }

    // Featured Description Check
    if (isFeatured) {
      const featuredDesc = formData.get('featured_description') as string
      const featuredWordCount = featuredDesc.trim().split(/\s+/).filter(w => w.length > 0).length
      if (featuredWordCount > 15) {
        alert("Featured description must be 15 words or less.")
        setIsSubmitting(false)
        return
      }
      if (!featuredDesc || featuredDesc.trim() === '') {
        alert("Featured events must have a Featured Description.")
        setIsSubmitting(false)
        return
      }
      if (!featuredImageFile) {
        alert("Featured events must have a Featured Banner Image.")
        setIsSubmitting(false)
        return
      }
    }
    // End Word Count Check

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

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
            <select name="category" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white">
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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

            {/* End Time (Optional) */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">End Time (Optional)</label>
              <div className="flex gap-2">
                <select name="end_time_hour" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                  <option value="">--</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (<option key={h} value={h}>{h}</option>))}
                </select>
                <select name="end_time_minute" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                <select name="end_time_ampm" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recurrence Settings */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label htmlFor="recurrence-toggle" className="block text-sm font-bold text-slate-300 cursor-pointer select-none">Weekly Recurrence</label>
                <p className="text-xs text-slate-500">Repeat this event every week?</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="recurrence-toggle"
                  type="checkbox"
                  name="is_recurring" // Form data key
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            {isRecurring && (
              <div className="mt-3 pt-3 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">Repeat Until</label>
                <input
                  name="recurrence_end_date"
                  type="date"
                  required={isRecurring}
                  defaultValue={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]}
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">Events will be created weekly starting from the selected Date & Time above.</p>
              </div>
            )}
          </div>

          {/* Event Type Toggle */}
          <div className="md:col-span-2 bg-slate-800 p-4 rounded-lg flex items-center justify-between">
            <span className="font-bold text-white">Event Type</span>
            <div className="flex bg-slate-950 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIsExternal(false)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!isExternal ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'}`}
              >
                Internal Event
              </button>
              <button
                type="button"
                onClick={() => setIsExternal(true)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${isExternal ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'}`}
              >
                External Link
              </button>
            </div>
            <input type="hidden" name="is_external_event" value={isExternal ? 'on' : 'off'} />
          </div>

          {/* Conditional Fields */}
          {isExternal ? (
            <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-slate-300 mb-2">External Ticket URL</label>
              <input name="external_url" required type="url" placeholder="https://ticketmaster.com/..." className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
            </div>
          ) : (
            <>
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-slate-300 mb-2">Ticket Price ($)</label>
                <input name="ticket_price" type="number" placeholder="0 = Free" defaultValue="0" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
                <p className="text-xs text-slate-500 mt-1">Leave 0 for free RSVP.</p>
              </div>
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-slate-300 mb-2">Table Reservation Price ($)</label>
                <input name="table_price" type="number" placeholder="0 = Free/Inquiry" defaultValue="0" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
                <p className="text-xs text-slate-500 mt-1">If &gt; 0, booking a table requires payment (VIP).</p>
              </div>
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-slate-300 mb-2">Total Capacity</label>
                <input name="ticket_capacity" required type="number" placeholder="100" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
              </div>
              {/* Maintain backward compatibility for 'tickets' field in DB if needed, or map it */}
              <input type="hidden" name="tickets" value="0" />
            </>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <WordCountTextarea name="description" rows={4} placeholder="What is this event about?" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" />
          </div>

          {/* Image */}
          <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <label className="block text-sm font-bold text-slate-300 mb-2">Cover Image (1:1)</label>
            <ImageUploadWithCrop
              onImageSelected={setImageFile}
              aspectRatio={1}
              name="image_ignore" // We handle submission manually, but keep a name to avoid form errors if any
            />
          </div>

          {/* --- NEW SOLD OUT TOGGLE --- */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg group hover:border-red-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <div>
                <label htmlFor="sold-out-toggle" className="block text-sm font-bold text-white cursor-pointer select-none">Mark as Sold Out</label>
                <p className="text-xs text-slate-400">Instantly stop all purchases and RSVPs for this event.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="sold-out-toggle"
                type="checkbox"
                name="is_sold_out"
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          {/* --- NEW FEATURED TOGGLE --- */}
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-lg group hover:border-[#D4AF37]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
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
              {/* --- FEATURED DESCRIPTION --- */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#D4AF37] mb-2">Featured Banner Copy (Max 15 words)</label>
                <WordCountTextarea
                  name="featured_description"
                  limit={15}
                  rows={2}
                  placeholder="Short & punchy text for user slider..."
                  className="w-full bg-slate-900 border border-[#D4AF37]/30 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600"
                />
              </div>

              {/* --- FEATURED IMAGE --- */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🌟</span>
                <label className="block text-sm font-bold text-[#D4AF37]">Hero Banner (16:9)</label>
              </div>
              <ImageUploadWithCrop
                onImageSelected={setFeaturedImageFile}
                aspectRatio={16 / 9}
                name="featured_image_ignore"
              />
              <p className="text-xs text-slate-500 mt-2">Recommended: High resolution landscape.</p>
            </div>
          )}
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