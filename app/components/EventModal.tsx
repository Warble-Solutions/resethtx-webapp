'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import EventBookingSystem from './EventBookingSystem'

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    image_url: string | null
    featured_image_url?: string | null
    description?: string | null
}

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    event: Event | null
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
    const [view, setView] = useState<'details' | 'booking'>('details')

    // Reset view when modal opens or event changes
    useEffect(() => {
        if (isOpen) {
            setView('details')
        }
    }, [isOpen, event])

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || !event) return null

    // Format Date/Time helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/10"
                >
                    ✕
                </button>

                {/* --- DETAILS VIEW --- */}
                {view === 'details' && (
                    <div className="flex flex-col md:flex-row h-full min-h-0 overflow-y-auto md:overflow-hidden pb-12 md:pb-0">

                        {/* Image Section (Half width on desktop) */}
                        <div className="w-full md:w-1/2 relative min-h-[300px] md:h-full">
                            {event.image_url ? (
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-slate-500">
                                    No Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]" />
                        </div>

                        {/* Info Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#0a0a0a] relative">

                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#D4AF37]/20">
                                    Event Details
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                                {event.title}
                            </h2>

                            <div className="flex flex-col gap-2 text-slate-300 mb-8 font-sans">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#D4AF37]">🗓</span>
                                    <span className="text-lg">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#D4AF37]">⏰</span>
                                    <span className="text-lg">{event.time || '9:00 PM'}</span>
                                </div>
                            </div>

                            <p className="text-slate-400 leading-relaxed mb-10 max-w-md">
                                {event.description || "Join us for an unforgettable night at Reset HTX. Experience luxury, music, and crafted cocktails in our premier lounge."}
                            </p>

                            <button
                                onClick={() => setView('booking')}
                                className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] uppercase tracking-widest text-sm text-center"
                            >
                                Get Tickets / Book Table
                            </button>
                        </div>
                    </div>
                )}

                {/* --- BOOKING VIEW --- */}
                {view === 'booking' && (
                    <div className="flex flex-col h-full min-h-0 bg-[#0a0a0a]">
                        {/* Header with Back Button */}
                        <div className="p-6 border-b border-white/10 relative flex items-center justify-center bg-[#111] shrink-0">
                            <button
                                onClick={() => setView('details')}
                                className="absolute left-6 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                                ← Back to Details
                            </button>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest font-heading">
                                Table Reservation
                            </h3>
                        </div>

                        {/* Booking System Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black/50 pb-20 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <EventBookingSystem eventId={event.id} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
