'use client'

import { createPromo } from './actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState } from 'react'

export default function CreatePromoPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">New Promo Code</h1>
            <p className="text-slate-400 text-sm mt-1">Create a discount for your customers.</p>
        </div>
        <Link href="/admin/promos" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form 
            action={createPromo} 
            onSubmit={() => setIsLoading(true)}
            className="flex flex-col gap-6"
        >
          {/* Code */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Promo Code</label>
            <input 
              name="code" 
              required 
              type="text" 
              placeholder="e.g. SUMMER2024"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600 uppercase font-mono tracking-wider" 
            />
            <p className="text-xs text-slate-500 mt-2">Will be saved in UPPERCASE automatically.</p>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Discount Percentage (%)</label>
            <div className="relative">
                <input 
                name="discount" 
                required 
                type="number" 
                min="1" 
                max="100"
                placeholder="15"
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600 pl-4 pr-12" 
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 font-bold">%</div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
             {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
             {isLoading ? 'Generating Code...' : 'Create Code'}
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}