'use client'

import SpotlightCard from '@/app/components/SpotlightCard'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <SpotlightCard className="max-w-md w-full p-8 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recovery</h1>
          <p className="text-slate-400 text-sm">Reset your admin password.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="admin@resethtx.com"
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white placeholder:text-slate-600" 
              />
            </div>

            <button 
              className="mt-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
            >
              Send Reset Link
            </button>
            
            <div className="text-center mt-2">
                <Link 
                    href="/admin/login" 
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                >
                    ← Back to Login
                </Link>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
            <p className="text-slate-400 text-sm mb-6">
              If an account exists for that email, we have sent password reset instructions.
            </p>
            <Link 
                href="/admin/login" 
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
                Back to Login
            </Link>
          </div>
        )}
      </SpotlightCard>
      
      <p className="absolute bottom-6 text-slate-600 text-xs">
        &copy; {new Date().getFullYear()} Reset HTX Admin System
      </p>
    </div>
  )
}