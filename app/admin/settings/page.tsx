'use client'

import { updatePassword } from './actions'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Form Component
function SettingsForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account security.</p>
        </div>

        {/* ALERTS */}
        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="text-red-500 text-xl">⚠️</div>
                <p className="text-red-200 font-medium">{error}</p>
            </div>
        )}

        {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="text-green-500 text-xl">✓</div>
                <p className="text-green-200 font-medium">{success}</p>
            </div>
        )}

        <SpotlightCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                Change Password
            </h2>

            <form 
                action={updatePassword} 
                onSubmit={() => setIsLoading(true)}
                className="flex flex-col gap-6"
            >
                {/* New Password */}
                <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">New Password</label>
                    <input 
                        name="password" 
                        type="password" 
                        required 
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" 
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Confirm New Password</label>
                    <input 
                        name="confirm_password" 
                        type="password" 
                        required 
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" 
                    />
                </div>

                <div className="flex justify-end mt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </SpotlightCard>
    </div>
  )
}

// Main Page Wrapper
export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
        <Suspense>
            <SettingsForm />
        </Suspense>
    </div>
  )
}