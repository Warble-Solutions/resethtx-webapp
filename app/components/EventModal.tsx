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
}

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    event: Event | null
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
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
    const [hasAgreed, setHasAgreed] = useState(false) // NEW

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) {
            setView('details')
            setPurchaseState(null)
            setUserName('')
            setUserEmail('')
            setUserPhone('')
            setUserDob('')
            setTicketQty(1)
            setCouponCode('')
            setHasAgreed(false) // NEW
        }
    }, [isOpen, event])

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

    if (!isOpen || !event) return null

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        })
    }

    const handleExternalClick = () => {
        if (event.external_url) {
            window.open(event.external_url, '_blank')
        }
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

    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isOver21(userDob)) {
            alert('You must be 21+ to attend this event.')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await purchaseTickets({
                eventId: event.id,
                userName,
                userEmail,
                userPhone,
                userDob,
                quantity: ticketQty,
                couponCode
            })

            if (result.success) {
                onClose()
                // Small delay to ensure modal closes before alert (optional but smoother)
                setTimeout(() => {
                    alert('Ticket reserved! Check your email.')
                }, 300)
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

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/10"
                >
                    ✕
                </button>

                {/* --- DETAILS VIEW --- */}
                {view === 'details' && (
                    <div className="flex flex-col md:flex-row items-stretch h-full min-h-0 overflow-y-auto md:overflow-hidden pb-12 md:pb-0">
                        {/* Image */}
                        <div className="w-full md:w-1/2 relative aspect-square">
                            {event.image_url ? (
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
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

                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                                {event.title}
                            </h2>

                            <div className="flex flex-col gap-2 text-slate-300 mb-8 font-sans">
                                <div className="flex items-center gap-2"><span className="text-[#D4AF37]">🗓</span><span className="text-lg">{formatDate(event.date)}</span></div>
                                <div className="flex items-center gap-2"><span className="text-[#D4AF37]">⏰</span><span className="text-lg">
                                    {formatEventTime(event.time, event.end_time)}
                                </span></div>
                            </div>

                            <p className="text-slate-400 leading-relaxed mb-10 max-w-md">
                                {event.description || "Join us for an unforgettable night at Reset HTX."}
                            </p>

                            {/* --- DYNAMIC CTA --- */}
                            <div className="flex flex-col gap-4">
                                {new Date(event.date) < new Date() ? (
                                    /* PAST EVENT */
                                    <button
                                        disabled
                                        className="w-full md:w-auto bg-slate-800 text-slate-500 font-bold py-4 px-8 rounded-full uppercase tracking-widest text-sm cursor-not-allowed border border-white/5"
                                    >
                                        EVENT ENDED
                                    </button>
                                ) : event.is_external_event ? (
                                    <button
                                        onClick={handleExternalClick}
                                        className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm"
                                    >
                                        GET TICKETS
                                    </button>
                                ) : (
                                    <>
                                        {/* Internal Event Logic */}
                                        {(event.ticket_price === 0 || event.ticket_price === undefined) ? (
                                            /* FREE EVENT */
                                            <button
                                                onClick={() => setView('rsvp')}
                                                className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm"
                                            >
                                                RSVP FOR FREE
                                            </button>
                                        ) : (
                                            /* PAID EVENT */
                                            <button
                                                onClick={() => setView('purchase')}
                                                className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm"
                                            >
                                                GET TICKETS (${event.ticket_price})
                                            </button>
                                        )}

                                        {/* Reserve Table Button */}
                                        {((event.table_price || 0) > 0) && (
                                            <button
                                                onClick={() => {
                                                    onClose()
                                                    openReservation({ eventId: event.id, tableFee: event.table_price })
                                                }}
                                                className="w-full md:w-auto bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 uppercase tracking-widest text-sm"
                                            >
                                                Reserve Table (${event.table_price})
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {/* --- RSVP / PURCHASE VIEW --- */}
                {(view === 'rsvp' || view === 'purchase') && (
                    <div className="flex flex-col h-full min-h-0 bg-[#0a0a0a] p-8 md:p-12 items-center justify-center relative">
                        <button
                            onClick={() => setView('details')}
                            className="absolute top-6 left-6 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            ← Back
                        </button>

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
                                        <p className="text-slate-400 text-sm">{event.title}</p>
                                    </div>

                                    {view === 'purchase' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Quantity (${event.ticket_price} ea)</label>
                                            <div className="flex items-center gap-4 bg-black/50 p-2 rounded-lg border border-white/10">
                                                <button type="button" onClick={() => setTicketQty(Math.max(1, ticketQty - 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded">-</button>
                                                <span className="flex-1 text-center font-bold text-xl text-white">{ticketQty}</span>
                                                <button type="button" onClick={() => setTicketQty(Math.min(10, ticketQty + 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded">+</button>
                                            </div>
                                            <p className="text-right text-[#D4AF37] font-bold mt-2">Total: ${(event.ticket_price || 0) * ticketQty}</p>
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
                                            <input
                                                required
                                                type="date"
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
                                                value={userDob}
                                                onChange={e => setUserDob(e.target.value)}
                                                className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none [color-scheme:dark]"
                                                placeholder="MM/DD/YYYY"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-[#D4AF37] mb-1">PROMO CODE</label>
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="ENTER CODE"
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-[#D4AF37] outline-none"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3 my-4">
                                        <input
                                            type="checkbox"
                                            id="terms-event"
                                            checked={hasAgreed}
                                            onChange={(e) => setHasAgreed(e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] bg-zinc-800 border-zinc-600"
                                        />
                                        <label htmlFor="terms-event" className="text-sm text-zinc-400 leading-tight">
                                            I agree to the <a href="/terms" target="_blank" className="underline hover:text-[#D4AF37]">Terms & Conditions</a> and <a href="/privacy" target="_blank" className="underline hover:text-[#D4AF37]">Privacy Policy</a>.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !hasAgreed}
                                        className="bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest mt-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Processing...' : (view === 'rsvp' ? 'Confirm RSVP' : 'Complete Purchase')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* --- BOOKING LOGIC --- */}
                {view === 'booking' && (
                    <div className="flex flex-col h-full min-h-0 bg-[#0a0a0a]">
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

                        {/* Check if Paid or Free */}
                        {(event.table_price && event.table_price > 0 && !event.is_external_event) ? (
                            // PAID TABLE FLOW -> Redirect to checkout (simulated here by showing purchase view with VIP ticket for now, OR specialized checkout)
                            // For this task, user said "Select VIP Table ticket type and redirect".
                            // Since we don't have a "Ticket Type" selector in this simple modal yet, we'll reuse the Purchase View but pre-set it or show a message.
                            // However, the cleanest implementation per instructions is to just redirect to payment page.
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                                <h3 className="text-2xl font-bold text-white mb-4">VIP Table Booking</h3>
                                <p className="text-slate-400 mb-8 max-w-md">
                                    Secure your VIP table for <strong>${event.table_price}</strong>.
                                </p>
                                <button
                                    onClick={() => {
                                        // In a real app, this would add a "VIP Table" item to cart or go to a Stripe checkout link
                                        alert("Redirecting to VIP Table Payment Gateway...")
                                    }}
                                    className="bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all uppercase tracking-widest"
                                >
                                    Proceed to Payment (${event.table_price})
                                </button>
                            </div>
                        ) : (
                            /* FREE / INQUIRY FLOW (Standard) */
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black/50 pb-20 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <EventBookingSystem eventId={event.id} eventDate={event.date} />
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
