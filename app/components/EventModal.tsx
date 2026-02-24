/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

import EventBookingSystem from './EventBookingSystem'
import { purchaseTickets } from '@/app/actions/checkout'
import { formatEventTime } from '../utils/format'
import { useReservation } from '../context/ReservationContext' // NEW

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    end_time?: string | null
    image_url: string | null
    featured_image_url?: string | null
    description?: string | null
    is_external_event?: boolean
    external_url?: string
    ticket_price?: number
    ticket_capacity?: number
    table_price?: number
    category?: string // Added category
    is_sold_out?: boolean
}

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    event?: Event | null
    events?: Event[] | null // Support multiple
}

export default function EventModal({ isOpen, onClose, event, events }: EventModalProps) {
    // Normalize to array
    const allEvents = events || (event ? [event] : [])

    const activeEvent = allEvents.length > 0 ? allEvents[0] : null

    // For single event flow, we use 'view' state. 
    // For multi event flow, each item renders its own 'Details' block, and clicking a CTA sets 'bookingEvent' state.
    const [bookingEvent, setBookingEvent] = useState<Event | null>(null)
    const [view, setView] = useState<'details' | 'booking' | 'rsvp' | 'purchase'>('details')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [purchaseState, setPurchaseState] = useState<{ success: boolean, message: string } | null>(null)
    const { openReservation } = useReservation()

    // Form inputs
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userDob, setUserDob] = useState('')
    const [ticketQty, setTicketQty] = useState(1)
    const [couponCode, setCouponCode] = useState('')
    const [hasAgreed, setHasAgreed] = useState(false)

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) {
            setBookingEvent(null)
            setView('details')
            setPurchaseState(null)
            setUserName('')
            setUserEmail('')
            setUserPhone('')
            setUserDob('')
            setTicketQty(1)
            setCouponCode('')
            setHasAgreed(false)
        }
    }, [isOpen, event, events])

    // Prevent scrolling
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

    if (!isOpen || allEvents.length === 0) return null

    // --- FORM SUBMIT HANDLER ---
    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!bookingEvent) return

        if (!isOver21(userDob)) {
            alert('You must be 21+ to attend this event.')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await purchaseTickets({
                eventId: bookingEvent.id,
                userName,
                userEmail,
                userPhone,
                userDob,
                quantity: ticketQty,
                couponCode
            })

            if (result.success) {
                // Keep modal open but show success state
                setPurchaseState({ success: true, message: result.message || 'Confirmed' })
            } else {
                alert(result.error || 'Failed to process request.')
            }
        } catch (error) {
            console.error(error)
            alert('An unexpected error occurred.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        })
    }

    const isOver21 = (dobString: string) => {
        if (!dobString) return false
        const today = new Date()
        const birthDate = new Date(dobString)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age >= 21
    }

    const handleBack = () => {
        if (bookingEvent) {
            setBookingEvent(null)
            setView('details')
        } else {
            onClose()
        }
    }

    // --- RENDER HELPERS ---

    // Renders the single event details card (reused for list)
    const renderEventDetails = (ev: Event) => (
        <div key={ev.id} className="flex flex-col md:flex-row items-stretch min-h-0 bg-[#0a0a0a] shrink-0 border-b border-white/10 last:border-b-0 pb-12 md:pb-0">
            {/* Image */}
            <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto md:min-h-[500px]">
                {ev.image_url ? (
                    <Image
                        src={ev.image_url}
                        alt={ev.title}
                        fill
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-slate-500">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]" />
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#0a0a0a] relative">
                <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#D4AF37]/20">
                        Event Details
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 leading-tight">
                    {ev.title}
                </h2>

                {/* Category Badge */}
                {ev.category && (
                    <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-widest text-[#000000] rounded-full bg-[#D4AF37] uppercase w-fit border-none">
                        {ev.category}
                    </span>
                )}

                <div className="flex flex-col gap-2 text-slate-300 mb-8 font-sans">
                    <div className="flex items-center gap-2"><span className="text-[#D4AF37]">🗓</span><span className="text-lg">{formatDate(ev.date)}</span></div>
                    <div className="flex items-center gap-2"><span className="text-[#D4AF37]">⏰</span><span className="text-lg">
                        {formatEventTime(ev.time, ev.end_time)}
                    </span></div>
                </div>

                <p className="text-slate-400 leading-relaxed mb-10 max-w-md">
                    {ev.description || "Join us for an unforgettable night at Reset HTX."}
                </p>

                {/* Grid of buttons */}
                <div className="flex flex-col gap-4">
                    {new Date(ev.date) < new Date() ? (
                        <button disabled className="w-full md:w-auto bg-slate-800 text-slate-500 font-bold py-4 px-8 rounded-full uppercase tracking-widest text-sm cursor-not-allowed border border-white/5">EVENT ENDED</button>
                    ) : ev.is_sold_out ? (
                        <button disabled className="w-full md:w-auto bg-red-950/50 text-red-500 font-bold py-4 px-8 rounded-full uppercase tracking-widest text-sm cursor-not-allowed border border-red-900/50 shadow-inner">SOLD OUT</button>
                    ) : ev.is_external_event && ev.external_url ? (
                        <button onClick={() => window.open(ev.external_url, '_blank')} className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm">GET TICKETS</button>
                    ) : (
                        <>
                            {(ev.ticket_price === 0 || ev.ticket_price === undefined) ? (
                                <button onClick={() => { setBookingEvent(ev); setView('rsvp'); }} className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm">RSVP FOR FREE</button>
                            ) : (
                                <button onClick={() => { setBookingEvent(ev); setView('purchase'); }} className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm">GET TICKETS (${ev.ticket_price})</button>
                            )}

                            {((ev.table_price || 0) > 0) && (
                                <button
                                    onClick={() => { onClose(); openReservation({ eventId: ev.id, tableFee: ev.table_price }); }}
                                    className="w-full md:w-auto bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm"
                                >
                                    Reserve Table (${ev.table_price})
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03]">
                    <img src="/logos/r_logo.png" alt="Brand" className="w-[80%]" />
                </div>

                <div className="absolute top-4 right-4 z-50 flex gap-2">
                    {bookingEvent && (
                        <button
                            onClick={handleBack}
                            className="h-10 px-4 rounded-full bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/10 text-xs font-bold uppercase tracking-wider"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/10"
                    >
                        ✕
                    </button>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 overflow-y-auto relative z-10">

                    {/* DETAILS VIEW (LIST or SINGLE) */}
                    {!bookingEvent && (
                        <div className="flex flex-col">
                            {allEvents.map(ev => renderEventDetails(ev))}
                        </div>
                    )}


                    {/* FORM VIEWS (RSVP/PURCHASE) for specific event */}
                    {bookingEvent && (view === 'rsvp' || view === 'purchase') && (
                        <div className="flex flex-col h-full min-h-0 bg-[#0a0a0a] p-8 md:p-12 items-center justify-center">

                            <div className="max-w-md w-full bg-[#111] border border-white/10 p-8 rounded-2xl shadow-xl">
                                {purchaseState ? (
                                    <div className="text-center py-10 animate-in fade-in zoom-in">
                                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                                        <h3 className="text-2xl font-heading text-white mb-2">{purchaseState.message}</h3>
                                        <p className="text-slate-400 text-sm mb-6">Check your email for confirmation details.</p>
                                        <button onClick={onClose} className="bg-white text-black font-bold py-3 px-8 rounded-full w-full uppercase tracking-widest">Close</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleTicketSubmit} className="flex flex-col gap-6">
                                        <div className="text-center mb-4">
                                            <h3 className="text-2xl font-heading text-white uppercase tracking-wider">
                                                {view === 'rsvp' ? 'Free List RSVP' : 'Purchase Tickets'}
                                            </h3>
                                            <p className="text-slate-400 text-sm">{bookingEvent.title}</p>
                                        </div>

                                        {view === 'purchase' && (
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Quantity (${bookingEvent.ticket_price} ea)</label>
                                                <div className="flex items-center gap-4 bg-black/50 p-2 rounded-lg border border-white/10">
                                                    <button type="button" onClick={() => setTicketQty(Math.max(1, ticketQty - 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded">-</button>
                                                    <span className="flex-1 text-center font-bold text-xl text-white">{ticketQty}</span>
                                                    <button type="button" onClick={() => setTicketQty(Math.min(10, ticketQty + 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded">+</button>
                                                </div>
                                                <p className="text-right text-[#D4AF37] font-bold mt-2">Total: ${(bookingEvent.ticket_price || 0) * ticketQty}</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Full Name</label>
                                            <input required type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none" placeholder="Jane Doe" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Email Address</label>
                                            <input required type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none" placeholder="jane@example.com" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Phone</label>
                                                <input required type="tel" value={userPhone} onChange={e => setUserPhone(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none" placeholder="(555) 555-5555" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Date of Birth</label>
                                                <input required type="date" max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]} value={userDob} onChange={e => setUserDob(e.target.value)} className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none [color-scheme:dark]" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-[#D4AF37] mb-1">PROMO CODE</label>
                                            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-[#D4AF37] outline-none" />
                                        </div>

                                        <div className="flex items-start gap-3 my-4">
                                            <input type="checkbox" id="terms-event" checked={hasAgreed} onChange={(e) => setHasAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] bg-zinc-800 border-zinc-600" />
                                            <label htmlFor="terms-event" className="text-sm text-zinc-400 leading-tight">I agree to the <a href="/terms" target="_blank" className="underline hover:text-[#D4AF37]">Terms & Conditions</a>.</label>
                                        </div>

                                        <button type="submit" disabled={isSubmitting || !hasAgreed} className="bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest mt-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSubmitting ? 'Processing...' : (view === 'rsvp' ? 'Confirm RSVP' : 'Complete Purchase')}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
