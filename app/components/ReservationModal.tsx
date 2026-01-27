'use client'

import { useState, useEffect } from 'react'
import { getNextEvent, getEventById } from '@/app/actions/event-booking'
import EventBookingSystem from './EventBookingSystem'
import Link from 'next/link'

interface ReservationModalProps {
    isOpen: boolean
    onClose: () => void
    eventId?: string
    tableFee?: number
}

export default function ReservationModal({ isOpen, onClose, eventId, tableFee }: ReservationModalProps) {
    const [event, setEvent] = useState<{ id: string, date: string, title: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            // Lock body scroll
            document.body.style.overflow = 'hidden'

            // Fetch logic
            const loadEvent = async () => {
                setLoading(true)
                setError(null)
                try {
                    // Logic: If eventId provided, we assume we need to fetch info for THAT event, 
                    // OR if we already passed the essential info? Database fetch is safer to get title/date.
                    // For now, if eventId is passed, we might need a "getEventById" action. 
                    // Or we can modify getNextEvent or create new one.
                    // Actually, if eventId passed, assuming we want to load that specific event.

                    // Since we don't have getEventById imported here yet, let's stick to getNextEvent() if no ID.
                    // If ID exists, we should ideally fetch it. 
                    // For simplicity, let's assume `getNextEvent` can handle ID or we add `getEventById`.
                    // The `bookTable` logic relies on `currentEventId` in EventBookingSystem anyway.

                    // Wait, `EventBookingSystem` takes `eventId`. If we pass it, we are good.
                    // But `ReservationModal` header shows `event.title`.
                    // We need to fetch title for display if we only have ID.
                    // Let's assume we can fetch it or just pass null title until loaded.

                    if (eventId) {
                        const result = await getEventById(eventId)
                        if (result.success && result.event) {
                            setEvent(result.event)
                        } else {
                            setError(result.error || 'Event not found.')
                        }
                    } else {
                        const result = await getNextEvent()
                        if (result.success && result.event) {
                            setEvent(result.event)
                        } else {
                            setError(result.error || 'No upcoming events found.')
                        }
                    }
                    setLoading(false)
                } catch (err) {
                    console.error('ReservationModal Load Error:', err)
                    setError('Failed to load event data.')
                    setLoading(false)
                }
            }

            loadEvent()
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-lg transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50">
                    <div>
                        <h2 className="text-2xl font-cinzel text-white">RESERVE A <span className="text-[#D4AF37]">TABLE</span></h2>
                        {event && !loading && (
                            <p className="text-slate-400 text-sm mt-1">
                                Booking for <span className="text-white font-bold">{event.title}</span>
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 animate-pulse">Checking availability...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <h3 className="text-xl font-heading text-white">{error}</h3>
                            <p className="text-slate-400 max-w-md">There are no upcoming events available for online booking right now.</p>
                            <Link href="/contact" onClick={onClose} className="mt-4 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all">
                                Contact Us
                            </Link>
                        </div>
                    ) : event ? (
                        <div className="py-8">
                            <EventBookingSystem
                                eventId={eventId || event.id}
                                eventDate={event.date}
                                tableFee={tableFee || 50} // Default 50 if not passed
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
