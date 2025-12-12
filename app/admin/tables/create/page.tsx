'use client'

import { createTable } from './actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState } from 'react'

export default function CreateTablePage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Add New Table</h1>
            <p className="text-slate-400 text-sm mt-1">Expand your floor plan capacity.</p>
        </div>
        <Link href="/admin/tables" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form 
            action={createTable} 
            onSubmit={() => setIsLoading(true)}
            className="flex flex-col gap-6"
        >
          {/* Table Number */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Table Number</label>
            <input 
              name="table_number" 
              required 
              type="number" 
              placeholder="e.g. 15"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" 
            />
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Seats Capacity</label>
            <input 
              name="seats" 
              required 
              type="number" 
              placeholder="e.g. 4"
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
             {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
             {isLoading ? 'Creating Table...' : 'Save Table'}
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}