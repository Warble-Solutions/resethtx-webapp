'use client'

import { login } from './actions'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState, Suspense } from 'react' // Suspense is needed for reading search params
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// We wrap the form in a component to handle the SearchParams safely
function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const [showPassword, setShowPassword] = useState(false)

  return (
    <SpotlightCard className="max-w-md w-full p-8 z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset HTX</h1>
        <p className="text-slate-400 text-sm">Admin Access</p>
      </div>

      {/* ERROR MESSAGE (Only shows if ?error= exists in URL) */}
      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-200 font-medium">{error}</p>
        </div>
      )}

      <form className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="admin@resethtx.com"
            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" 
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-slate-300">Password</label>
            {/* Show/Hide Toggle */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>
          
          <div className="relative">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder={showPassword ? "password123" : "••••••••"}
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600" 
            />
          </div>
        </div>

        <button 
          formAction={login} 
          className="mt-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          Sign In
        </button>
        
        {/* Forgot Password Link */}
        <div className="text-center mt-2">
            <Link 
                href="/admin/forgot-password"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
                Forgot your password?
            </Link>
        </div>
      </form>
    </SpotlightCard>
  )
}

// MAIN PAGE COMPONENT
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <Suspense>
        <LoginForm />
      </Suspense>
      
      <p className="absolute bottom-6 text-slate-600 text-xs">
        &copy; {new Date().getFullYear()} Reset HTX Admin System
      </p>
    </div>
  )
}