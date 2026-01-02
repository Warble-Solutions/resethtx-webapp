'use client'

import React, { useEffect, useState, useRef } from 'react'
import anime from 'animejs'
import { getEventTables, bookTable, getEventForDate } from '@/app/actions/event-booking'
import { validatePromo } from '@/app/actions/promos'
import BookingCheckoutModal from './BookingCheckoutModal'

interface Table {
    id: string
    name: string
    capacity: number
    price: number
    category: string
    isBooked?: boolean
    x?: number
    y?: number
}

const BOOKING_FEE = 50

export default function EventBookingSystem({ eventId: initialEventId, eventDate: initialEventDate }: { eventId: string, eventDate: string }) {
    // Current Active Event and Date State
    const [currentEventId, setCurrentEventId] = useState(initialEventId)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(initialEventDate))
    const [eventLookupError, setEventLookupError] = useState<string | null>(null)

    const [tables, setTables] = useState<Table[]>([])
    const [loading, setLoading] = useState(true)

    // Flow State
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    // Form State
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [customerDob, setCustomerDob] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [isBooking, setIsBooking] = useState(false)
    const [discountApplied, setDiscountApplied] = useState(false)
    const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [bookingError, setBookingError] = useState<string | null>(null)

    // Animation Refs
    const containerRef = useRef<HTMLDivElement>(null)

    // Helper: Age Validation
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

    // 1. Fetch Tables
    const fetchTables = async (id: string) => {
        setLoading(true)
        console.log('Fetching tables for event:', id)
        const { success, tables, error } = await getEventTables(id)
        console.log('Fetch result:', { success, count: tables?.length, error })

        if (success && tables) {
            setTables(tables)
        } else {
            console.error('Failed to load tables')
            setTables([])
        }
        setLoading(false)
    }

    // Initial Load
    useEffect(() => {
        fetchTables(currentEventId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Handle Date Change
    const handleDateChange = async (dateStr: string) => {
        // Update input state immediately for UI responsiveness
        const newDate = new Date(dateStr)
        // Adjust for timezone offset to prevent date shifting when creating new Date object
        // Actually, input type="date" returns YYYY-MM-DD. 
        // new Date('YYYY-MM-DD') creates UTC midnight.
        // We want to preserve the calendar date selected by user.
        // Let's stick to the string for lookup, but store Date object for display if needed ?
        // actually simplest is just store the date string or the Date object carefully.
        // Using new Date(dateStr + 'T12:00:00') puts it in midday to avoid timezone shifts for display.
        const displayDate = new Date(dateStr + 'T12:00:00')
        setSelectedDate(displayDate)

        setLoading(true)
        setSelectedTable(null)
        setEventLookupError(null)

        const { success, event, error } = await getEventForDate(dateStr)

        if (success && event) {
            setCurrentEventId(event.id)
            await fetchTables(event.id)
        } else {
            setCurrentEventId('')
            setTables([])
            setEventLookupError('No events scheduled for this date.')
            setLoading(false)
        }
    }

    // 3. Handle Table Selection & Transition
    const handleSelectTable = (table: Table) => {
        if (table.isBooked) return

        setSelectedTable(table)

        // Reset Promo State on new selection
        setDiscountApplied(false)
        setPromoCode('')
        setPromoMessage(null)
        setBookingError(null)
    }

    const handleOpenCheckout = () => {
        setIsCheckoutOpen(true)
    }

    // 5. Handle Promo Apply
    const handleApplyPromo = async () => {
        setPromoMessage(null)
        if (!promoCode.trim()) return

        const result = await validatePromo(promoCode)
        if (result.valid) {
            setDiscountApplied(true)
            setPromoMessage({ type: 'success', text: result.message || 'Code applied!' })
        } else {
            setDiscountApplied(false)
            setPromoMessage({ type: 'error', text: result.message || 'Invalid code.' })
        }
    }

    // 6. Submit Booking
    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTable) return

        if (!isOver21(customerDob)) {
            setBookingError('You must be 21+ to book a table.')
            return
        }

        setIsBooking(true)
        setBookingError(null)

        const result = await bookTable(currentEventId, selectedTable.id, customerName, customerEmail, customerPhone, customerDob, promoCode)

        if (result.success) {
            alert('Table Booked Successfully! Check your email for confirmation.')
            // Reset to start
            setCustomerName('')
            setCustomerEmail('')
            setCustomerPhone('')
            setCustomerDob('')
            setPromoCode('')
            setDiscountApplied(false)
            setPromoMessage(null)
            setSelectedTable(null)
            setIsCheckoutOpen(false)
            fetchTables(currentEventId) // Refresh data
        } else {
            setBookingError(result.error || 'Booking failed')
        }
        setIsBooking(false)
    }

    if (loading) return <div className="text-center text-slate-500 py-20 animate-pulse">Loading availability...</div>

    if (!loading && tables.length === 0 && !eventLookupError) {
        return (
            <div className="text-center text-slate-400 py-20">
                <p className="text-xl mb-2">No tables available.</p>
                <p className="text-sm">Please try again later or contact support.</p>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto p-4 md:p-8 min-h-[400px]">

            {/* --- VIEW 1: CATEGORIZED LIST SELECTION --- */}
            <div className="table-list-container px-2 pb-20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading text-white mb-4 uppercase tracking-widest drop-shadow-lg">
                        Availability for <span className="text-[#D4AF37]">{selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                    </h2>

                    <div className="inline-flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-lg p-1.5 pr-4 hover:border-[#D4AF37] transition-colors group cursor-pointer focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]">
                        <div className="p-2 bg-white/5 rounded text-[#D4AF37]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-slate-500 uppercase font-bold leading-tight">Change Date</span>
                            <input
                                type="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="bg-transparent border-none text-white text-sm font-bold uppercase p-0 focus:ring-0 outline-none w-[130px] cursor-pointer [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {eventLookupError && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded max-w-md mx-auto">
                            {eventLookupError}
                        </div>
                    )}
                </div>

                {/* Disclaimer UI */}
                <div className="bg-zinc-900 border-l-4 border-[#D4AF37] p-4 mb-8 rounded-r-lg shadow-lg max-w-3xl mx-auto">
                    <div className="flex items-start gap-4">
                        <div className="text-[#D4AF37] mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                        <div>
                            <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">Reservation Fee Required</p>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Table bookings require a <span className="text-white font-bold">${BOOKING_FEE} reservation fee</span>. This fee secures your spot and does not go towards your tab.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Group tables by category */}
                {(() => {
                    // Strict Sort Order
                    const categoryOrder = ['Lounge', 'Dance Floor', 'Dj Booth', 'Patio', 'Table Top']

                    const groupedTables = tables.reduce((acc, table) => {
                        const cat = table.category || 'Standard'
                        if (!acc[cat]) acc[cat] = []
                        acc[cat].push(table)
                        return acc
                    }, {} as Record<string, Table[]>)

                    // Filter and Sort Categories
                    const presentCategories = Object.keys(groupedTables)
                    const sortedCategories = [
                        ...categoryOrder.filter(c => presentCategories.includes(c)),
                        ...presentCategories.filter(c => !categoryOrder.includes(c) && c !== 'Standard'),
                        ...(presentCategories.includes('Standard') ? ['Standard'] : [])
                    ]

                    return (
                        <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                            {sortedCategories.map(category => (
                                <div key={category} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <h3 className="text-[#D4AF37] font-bold text-xl uppercase tracking-widest whitespace-nowrap px-4 border-l-4 border-[#D4AF37]">
                                            {category}
                                        </h3>
                                        <div className="h-[1px] bg-white/10 w-full"></div>
                                    </div>

                                    {/* Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {groupedTables[category].map(table => {
                                            const isSelected = selectedTable?.id === table.id
                                            return (
                                                <button
                                                    key={table.id}
                                                    onClick={() => !table.isBooked && handleSelectTable(table)}
                                                    disabled={table.isBooked}
                                                    className={`
                                                            relative p-4 rounded-xl border transition-all duration-300 text-left group flex flex-col justify-between h-full min-h-[100px]
                                                            ${table.isBooked
                                                            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed grayscale'
                                                            : isSelected
                                                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105 z-10'
                                                                : 'border-zinc-800 bg-[#0a0a0a] text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10'
                                                        }
                                                        `}
                                                >
                                                    {/* Status Indicator Dot */}
                                                    {!table.isBooked && (
                                                        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${isSelected ? 'bg-black' : 'bg-[#D4AF37]'}`} />
                                                    )}

                                                    <div>
                                                        <div className="font-heading font-bold text-lg mb-1 leading-tight">{table.name}</div>
                                                        <div className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-black/70' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                                            Max {table.capacity} Guests
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                })()}

                {/* Sticky Mobile/Desktop Action Bar if selection made */}
                <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${selectedTable ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="bg-[#111] border-t border-[#D4AF37] p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-center md:text-left">
                                <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Selected Table</div>
                                <div className="text-white font-heading text-2xl md:text-3xl font-bold">{selectedTable?.name}</div>
                                <div className="text-[#D4AF37] text-xs uppercase tracking-wider font-bold">Max {selectedTable?.capacity} Guests</div>
                            </div>

                            <button
                                onClick={handleOpenCheckout}
                                className="w-full md:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-4 px-12 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <span>Pay ${BOOKING_FEE.toFixed(2)} & Book</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <BookingCheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                selectedTable={selectedTable}
                eventDate={selectedDate.toISOString()}
                onConfirm={handleBooking}
                isProcessing={isBooking}
                error={bookingError}
                guestDob={customerDob}
            >
                {/* Injection of Form Fields logic */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                        <input
                            required
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                            placeholder="Jane Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                        <input
                            required
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                            placeholder="jane@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                            <input
                                required
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="(555) 555-5555"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Date of Birth</label>
                            <input
                                required
                                type="date"
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
                                value={customerDob}
                                onChange={(e) => setCustomerDob(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors [color-scheme:dark]"
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Promo Code (Optional)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className={`flex-1 bg-[#050505] border text-white rounded-lg p-3 outline-none transition-colors uppercase tracking-wider ${promoMessage?.type === 'error' ? 'border-red-500/50' : 'border-white/10 focus:border-[#D4AF37]'}`}
                                placeholder="ENTER CODE"
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromo}
                                className="px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase rounded-lg border border-white/10 transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                        {promoMessage && (
                            <p className={`text-xs ${promoMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {promoMessage.text}
                            </p>
                        )}
                    </div>
                </div>
            </BookingCheckoutModal>
        </div>
    )
}
