'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { submitGeneralReservation, getEventByDate } from '@/app/actions/reservations'

const TIME_SLOTS = ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM']

interface EventInfo {
    hasEvent: boolean
    eventTitle?: string
    eventId?: string
}

export default function ResetBookingClient() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // Date selection
    const today = new Date().toISOString().split('T')[0]
    const [selectedDate, setSelectedDate] = useState(today)
    const [eventInfo, setEventInfo] = useState<EventInfo>({ hasEvent: false })
    const [checkingEvent, setCheckingEvent] = useState(false)

    // Active card
    const [activeCard, setActiveCard] = useState<'event' | 'general' | null>(null)

    // General booking form
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        guests: 2,
        time: '',
        special_requests: '',
    })
    const [formError, setFormError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ bookingRef: string } | null>(null)

    // Check for event whenever date changes
    useEffect(() => {
        const check = async () => {
            setCheckingEvent(true)
            setActiveCard(null)
            const result = await getEventByDate(selectedDate)
            setEventInfo(result)
            setCheckingEvent(false)
        }
        check()
    }, [selectedDate])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        if (!form.time) {
            setFormError('Please select a preferred time.')
            return
        }

        if (!form.full_name || !form.email || !form.phone) {
            setFormError('Please fill in all required fields.')
            return
        }

        startTransition(async () => {
            const result = await submitGeneralReservation({
                full_name: form.full_name,
                email: form.email,
                phone: form.phone,
                guests: form.guests,
                date: selectedDate,
                time: form.time,
                special_requests: form.special_requests,
            })

            if (result.success && result.bookingRef) {
                setSuccess({ bookingRef: result.bookingRef })
            } else {
                setFormError(result.error || 'Something went wrong. Please try again.')
            }
        })
    }

    const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    })

    // --- Success Screen ---
    if (success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-heading text-3xl text-white uppercase tracking-widest mb-3">Request Received!</h2>
                    <p className="text-slate-400 mb-6">We've received your reservation request and will confirm with you shortly via email.</p>
                    <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8 text-left">
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Booking Reference</div>
                        <div className="text-2xl font-heading font-bold text-[#D4AF37]">{success.bookingRef}</div>
                        <div className="mt-4 pt-4 border-t border-white/10 text-sm text-slate-400">
                            <p>📅 {formattedDate}</p>
                            <p>⏰ {form.time}</p>
                            <p>👥 {form.guests} {form.guests === 1 ? 'guest' : 'guests'}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600">A confirmation email has been sent to <span className="text-slate-400">{form.email}</span></p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 px-8 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[4px] mb-4">Reset HTX</p>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-4">
                        Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]">Visit</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Choose how you&apos;d like to join us. Select a date to see what&apos;s available.
                    </p>
                </div>

                {/* Date Picker */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-xl p-2 pr-5 hover:border-[#D4AF37]/50 transition-colors focus-within:border-[#D4AF37]">
                        <div className="p-3 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-bold leading-tight">Select Date</span>
                            <input
                                type="date"
                                value={selectedDate}
                                min={today}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none text-white text-sm font-bold uppercase p-0 focus:ring-0 outline-none cursor-pointer [color-scheme:dark] w-[140px]"
                            />
                        </div>
                        {checkingEvent && (
                            <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin ml-2" />
                        )}
                    </div>
                </div>

                {/* Two Option Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ─── CARD 1: EVENT BOOKING ─── */}
                    <div
                        className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
                            ${eventInfo.hasEvent
                                ? 'border-[#D4AF37]/40 bg-[#0a0a0a] cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]'
                                : 'border-white/5 bg-[#050505] opacity-50'
                            }`}
                        onClick={() => eventInfo.hasEvent && router.push('/events')}
                    >
                        {/* Glow top bar */}
                        <div className={`h-1 w-full ${eventInfo.hasEvent ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]' : 'bg-white/10'}`} />

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${eventInfo.hasEvent ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-white/5 text-slate-600'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                                    </svg>
                                </div>
                                {eventInfo.hasEvent && (
                                    <span className="px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                                        Event Night
                                    </span>
                                )}
                            </div>

                            <h2 className={`font-heading text-2xl font-bold uppercase tracking-wide mb-2 ${eventInfo.hasEvent ? 'text-white' : 'text-slate-600'}`}>
                                Event Booking
                            </h2>

                            {eventInfo.hasEvent ? (
                                <>
                                    <p className="text-slate-400 text-sm mb-2 leading-relaxed">
                                        There&apos;s an event happening on this night. Book your table or RSVP through the event page.
                                    </p>
                                    <p className="text-[#D4AF37] font-bold text-sm mb-6">🎉 {eventInfo.eventTitle}</p>
                                    <button
                                        onClick={e => { e.stopPropagation(); router.push('/events') }}
                                        className="w-full bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                    >
                                        View Event & Book
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                        No events scheduled for this date.
                                    </p>
                                    <div className="w-full bg-white/5 text-slate-600 font-bold py-4 rounded-xl uppercase tracking-widest text-sm text-center cursor-not-allowed border border-white/5">
                                        No Events Tonight
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ─── CARD 2: GENERAL DINING ─── */}
                    <div
                        className={`relative rounded-2xl border transition-all duration-300 overflow-hidden
                            ${!eventInfo.hasEvent
                                ? 'border-white/10 bg-[#0a0a0a]'
                                : 'border-white/5 bg-[#050505] opacity-50'
                            }`}
                    >
                        <div className={`h-1 w-full ${!eventInfo.hasEvent ? 'bg-gradient-to-r from-white/20 to-white/10' : 'bg-white/5'}`} />

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${!eventInfo.hasEvent ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-600'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                                    </svg>
                                </div>
                                {eventInfo.hasEvent && (
                                    <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-white/10">
                                        Unavailable Tonight
                                    </span>
                                )}
                            </div>

                            <h2 className={`font-heading text-2xl font-bold uppercase tracking-wide mb-2 ${!eventInfo.hasEvent ? 'text-white' : 'text-slate-600'}`}>
                                General Dining
                            </h2>

                            {eventInfo.hasEvent ? (
                                <div>
                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                        General dining is not available on event nights. Please use Event Booking instead.
                                    </p>
                                    <div className="w-full bg-white/5 text-slate-600 font-bold py-4 rounded-xl uppercase tracking-widest text-sm text-center cursor-not-allowed border border-white/5">
                                        Event Night — Unavailable
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                        Reserve a table for a regular night. We&apos;ll confirm your booking via email.
                                    </p>

                                    {/* General Booking Form */}
                                    {activeCard !== 'general' ? (
                                        <button
                                            onClick={() => setActiveCard('general')}
                                            className="w-full bg-white hover:bg-[#D4AF37] text-black font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                        >
                                            Reserve a Table
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">

                                            {/* Time + Party Size Row */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Preferred Time *</label>
                                                    <select
                                                        name="time"
                                                        value={form.time}
                                                        onChange={handleFormChange}
                                                        required
                                                        className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none text-sm [color-scheme:dark]"
                                                    >
                                                        <option value="">Select time</option>
                                                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Party Size *</label>
                                                    <select
                                                        name="guests"
                                                        value={form.guests}
                                                        onChange={handleFormChange}
                                                        className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none text-sm [color-scheme:dark]"
                                                    >
                                                        {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                                                            <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Full Name *</label>
                                                <input required type="text" name="full_name" value={form.full_name} onChange={handleFormChange}
                                                    placeholder="Jane Doe"
                                                    className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none text-sm transition-colors" />
                                            </div>

                                            {/* Email + Phone Row */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Email *</label>
                                                    <input required type="email" name="email" value={form.email} onChange={handleFormChange}
                                                        placeholder="jane@example.com"
                                                        className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none text-sm transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Phone *</label>
                                                    <input required type="tel" name="phone" value={form.phone} onChange={handleFormChange}
                                                        placeholder="(555) 555-5555"
                                                        className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none text-sm transition-colors" />
                                                </div>
                                            </div>

                                            {/* Special Requests */}
                                            <div>
                                                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Special Requests</label>
                                                <textarea name="special_requests" value={form.special_requests} onChange={handleFormChange}
                                                    placeholder="Allergies, celebrations, accessibility needs..."
                                                    rows={3}
                                                    className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none text-sm resize-none transition-colors" />
                                            </div>

                                            {formError && (
                                                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{formError}</p>
                                            )}

                                            <div className="flex gap-3 pt-1">
                                                <button type="button" onClick={() => setActiveCard(null)}
                                                    className="px-4 py-3 border border-white/10 text-slate-400 hover:text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors hover:border-white/30">
                                                    Back
                                                </button>
                                                <button type="submit" disabled={isPending}
                                                    className="flex-1 bg-white hover:bg-[#D4AF37] text-black font-bold py-3 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                                    {isPending ? (
                                                        <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Processing...</>
                                                    ) : 'Request Reservation'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer note */}
                <p className="text-center text-slate-600 text-xs mt-10">
                    21+ to enter. Reservations are subject to availability and management approval. · Reset HTX
                </p>

            </div>
        </main>
    )
}
