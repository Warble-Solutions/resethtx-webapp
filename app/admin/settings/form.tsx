'use client'

import { updatePassword, updateSiteSettings } from './actions'
import SpotlightCard from '@/app/components/SpotlightCard'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface SettingsData {
    address?: string
    phone?: string
    email?: string
    instagram_url?: string
    facebook_url?: string
    tiktok_url?: string
    youtube_url?: string
    hours_mon_tue?: string
    hours_wed_thu?: string
    hours_fri_sat?: string
    hours_sun?: string
    google_maps_embed_url?: string
}

export default function SettingsForm({ initialSettings }: { initialSettings: SettingsData | null }) {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [isSettingsLoading, setIsSettingsLoading] = useState(false)

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 mt-1">Manage global website details and account security.</p>
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

            {/* --- FORM 1: WEBSITE INFORMATION --- */}
            <h2 className="text-[#D4AF37] font-bold text-xl mb-4 border-b border-white/10 pb-2">
                Website Information
            </h2>

            <SpotlightCard className="p-8 mb-12">
                <form action={updateSiteSettings} onSubmit={() => setIsSettingsLoading(true)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-4">Contact Details</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Address</label>
                            <input name="address" defaultValue={initialSettings?.address} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                            <input name="phone" defaultValue={initialSettings?.phone} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Email (Optional)</label>
                            <input name="email" defaultValue={initialSettings?.email} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-4">Operating Hours</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Mon - Tue</label>
                            <input name="hours_mon_tue" defaultValue={initialSettings?.hours_mon_tue} placeholder="e.g. Closed" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Wed - Thu</label>
                            <input name="hours_wed_thu" defaultValue={initialSettings?.hours_wed_thu} placeholder="e.g. 4pm - 2am" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Fri - Sat</label>
                            <input name="hours_fri_sat" defaultValue={initialSettings?.hours_fri_sat} placeholder="e.g. 4pm - 3am" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Sunday</label>
                            <input name="hours_sun" defaultValue={initialSettings?.hours_sun} placeholder="e.g. 3pm - 12am" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                        </div>
                    </div>

                    {/* Social & Map */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-800 mt-2">
                        <h3 className="text-white font-bold mb-4">Social & Map</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Instagram URL</label>
                                <input name="instagram_url" defaultValue={initialSettings?.instagram_url} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Facebook URL</label>
                                <input name="facebook_url" defaultValue={initialSettings?.facebook_url} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">TikTok URL</label>
                                <input name="tiktok_url" defaultValue={initialSettings?.tiktok_url} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">YouTube URL</label>
                                <input name="youtube_url" defaultValue={initialSettings?.youtube_url} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Google Maps Embed Source (URL only)</label>
                            <input name="google_maps_embed_url" defaultValue={initialSettings?.google_maps_embed_url} placeholder="https://www.google.com/maps/embed?..." className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:border-[#D4AF37] outline-none text-xs" />
                            <p className="text-[10px] text-slate-500 mt-1">Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy only the link inside the src="..." attribute.</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSettingsLoading}
                            className="bg-[#D4AF37] hover:bg-white text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSettingsLoading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                            {isSettingsLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </SpotlightCard>

            {/* --- FORM 2: CHANGE PASSWORD (Your original form) --- */}
            <h2 className="text-white font-bold text-xl mb-4 border-b border-white/10 pb-2">
                Account Security
            </h2>

            <SpotlightCard className="p-8">
                <form
                    action={updatePassword}
                    onSubmit={() => setIsPasswordLoading(true)}
                    className="flex flex-col gap-6"
                >
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">New Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Confirm New Password</label>
                        <input
                            name="confirm_password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-white placeholder:text-slate-600"
                        />
                    </div>

                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="bg-slate-800 hover:bg-red-900/50 text-white hover:text-red-200 border border-slate-700 font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPasswordLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isPasswordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </SpotlightCard>
        </div>
    )
}