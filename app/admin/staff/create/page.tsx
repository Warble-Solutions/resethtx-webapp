'use client'

import { createEmployee } from './actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState } from 'react'

export default function CreateStaffPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Add New Employee</h1>
            <p className="text-slate-400 text-sm mt-1">Create a new user account.</p>
        </div>
        <Link href="/admin/staff" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form 
            action={createEmployee} 
            onSubmit={() => setIsLoading(true)}
            className="flex flex-col gap-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
            <input name="name" required type="text" placeholder="e.g. John Doe" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
            <input name="email" required type="email" placeholder="john@resethtx.com" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
            <input name="phone" type="tel" placeholder="(555) 123-4567" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Role</label>
            <div className="relative">
                <select name="role" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Staff">Staff (Standard Access)</option>
                    <option value="Manager">Manager (Can Edit Menu)</option>
                    <option value="Admin">Admin (Full Access)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">▼</div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all w-full md:w-auto md:self-end disabled:opacity-50 flex items-center justify-center gap-2"
          >
             {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
             {isLoading ? 'Creating Account...' : 'Save Employee'}
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}