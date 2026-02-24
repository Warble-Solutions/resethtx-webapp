/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
 
import { createPromo } from './actions' // Fallback or unused if action passed prop
// We'll accept action as prop to support both create and update

type Props = {
    action: (formData: FormData) => void | Promise<void>
    initialData?: {
        id?: string
        code: string
        discount: number
        expiryType: string
        customDate: string
    }
    isEdit?: boolean
}

export default function PromoForm({ action, initialData, isEdit = false }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState(initialData?.code || '')
    const [expiryType, setExpiryType] = useState(initialData?.expiryType || 'never')
    const [customDate, setCustomDate] = useState(initialData?.customDate || '')

    const generateCode = () => {
        const prefixes = ['VIP', 'GOLD', 'PLATINUM', 'RESET', 'SUMMER', 'WINTER', 'PARTY']
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
        const suffix = Math.random().toString(36).substring(2, 5).toUpperCase()
        const num = Math.floor(Math.random() * 99)
        setCode(`${prefix}-${suffix}${num}`)
    }

    return (
        <form
            action={action}
            onSubmit={() => setIsLoading(true)}
            className="flex flex-col gap-6"
        >
            {isEdit && <input type="hidden" name="id" value={initialData?.id} />}

            {/* Code */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-300">Promo Code</label>
                    {!isEdit && (
                        <button
                            type="button"
                            onClick={generateCode}
                            className="text-xs text-[#D4AF37] hover:text-[#b5952f] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 8.7 12 13.44 20.71 8.7" /><line x1="12" y1="22.13" x2="12" y2="13.44" /></svg>
                            Auto-Generate
                        </button>
                    )}
                </div>
                <input
                    name="code"
                    required
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER2024"
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600 uppercase font-mono tracking-wider"
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
                        defaultValue={initialData?.discount}
                        placeholder="15"
                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600 pl-4 pr-12"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 font-bold">%</div>
                </div>
            </div>

            {/* Expiration */}
            <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Expires In</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['never', '1_week', '1_month', '1_year', 'custom'].map((type) => (
                        <label
                            key={type}
                            className={`cursor-pointer border rounded-lg p-2 text-center text-sm font-medium transition-all ${expiryType === type
                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <input
                                type="radio"
                                name="expiryType"
                                value={type}
                                checked={expiryType === type}
                                onChange={(e) => setExpiryType(e.target.value)}
                                className="hidden"
                            />
                            {type === 'never' ? 'Never' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                    ))}
                </div>

                {expiryType === 'custom' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-bold text-slate-400 mb-1">Select Date</label>
                        <input
                            name="customDate"
                            type="date"
                            required={expiryType === 'custom'}
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600"
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-[#D4AF37] text-black font-bold hover:bg-[#b5952f] py-3 px-6 rounded-lg shadow-lg transition-all w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                {isLoading ? 'Saving...' : (isEdit ? 'Update Code' : 'Create Code')}
            </button>
        </form>
    )
}
