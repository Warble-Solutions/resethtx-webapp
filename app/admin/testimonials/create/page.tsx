'use client'

import { createTestimonial } from '../actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState } from 'react'

export default function CreateTestimonialPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Add Testimonial</h1>
            <p className="text-slate-400 text-sm mt-1">Add a new review to the homepage.</p>
        </div>
        <Link href="/admin/testimonials" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form action={createTestimonial} onSubmit={() => setIsSubmitting(true)} className="flex flex-col gap-6">
          
          {/* Author Name */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Author Name</label>
            <input 
                name="author_name" 
                required 
                type="text" 
                placeholder="e.g. Sarah Jenkins" 
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" 
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Role / Title</label>
            <input 
                name="author_role" 
                type="text" 
                placeholder="e.g. Food Critic or Regular" 
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white" 
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">The Quote</label>
            <textarea 
                name="quote" 
                required 
                rows={4} 
                placeholder="The best vibe in Houston..." 
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 bg-linear-to-r from-[#D4AF37] to-[#B3932D] hover:from-white hover:to-slate-200 hover:text-black text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all w-full md:w-auto md:self-end disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {isSubmitting ? 'Saving...' : 'Add Review'}
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}