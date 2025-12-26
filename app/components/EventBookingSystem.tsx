import React, { useEffect, useState, useRef } from 'react'
import anime from 'animejs'
import { getEventTables, bookTable } from '@/app/actions/event-booking'
import { validatePromo } from '@/app/actions/promos'

interface Table {
    id: string
    name: string
    capacity: number
    price: number
    category: string
    isBooked?: boolean
}

export default function EventBookingSystem({ eventId }: { eventId: string }) {
    const [tables, setTables] = useState<Table[]>([])
    const [loading, setLoading] = useState(true)

    // Flow State
    const [step, setStep] = useState<'select' | 'checkout'>('select')
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)

    // Form State
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [isBooking, setIsBooking] = useState(false)
    const [discountApplied, setDiscountApplied] = useState(false)
    const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Animation Refs
    const containerRef = useRef<HTMLDivElement>(null)

    // 1. Fetch Tables
    const fetchTables = async () => {
        setLoading(true)
        console.log('Fetching tables for event:', eventId)
        const { success, tables, error } = await getEventTables(eventId)
        console.log('Fetch result:', { success, count: tables?.length, error })

        if (success && tables) {
            setTables(tables)
        } else {
            console.error('Failed to load tables')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTables()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId])

    // 2. Entrance Animation (Grid)
    useEffect(() => {
        console.log('Animation Effect Triggered. Tables:', tables.length, 'Loading:', loading, 'Step:', step)
        if (!loading && tables.length > 0 && step === 'select') {
            // Reset opacity for re-entrance
            anime.set('.table-card', { opacity: 0, translateY: 20 })

            anime({
                targets: '.table-card',
                translateY: [20, 0],
                opacity: [0, 1],
                delay: anime.stagger(30), // Faster stagger for snappy feel
                easing: 'easeOutExpo',
                duration: 500
            })
        }
    }, [loading, tables, step])

    // 3. Handle Table Selection & Transition
    const handleSelectTable = (table: Table) => {
        if (table.isBooked) return

        setSelectedTable(table)

        // Reset Promo State on new selection
        setDiscountApplied(false)
        setPromoCode('')
        setPromoMessage(null)

        // Animate Out Grid
        anime({
            targets: '.table-grid-container',
            opacity: [1, 0],
            translateY: [0, -20],
            easing: 'easeInExpo',
            duration: 400,
            complete: () => {
                setStep('checkout')
                // Animate In Form
                setTimeout(() => {
                    anime({
                        targets: '.checkout-form-container',
                        opacity: [0, 1],
                        translateY: [20, 0],
                        easing: 'easeOutExpo',
                        duration: 600
                    })
                }, 50)
            }
        })
    }

    // 4. Handle Back to Selection
    const handleBack = () => {
        // Animate Out Form
        anime({
            targets: '.checkout-form-container',
            opacity: [1, 0],
            translateY: [0, 20],
            easing: 'easeInExpo',
            duration: 400,
            complete: () => {
                setStep('select')
                setSelectedTable(null)
                // Grid animation will trigger via useEffect
            }
        })
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

        setIsBooking(true)
        const result = await bookTable(eventId, selectedTable.id, customerName, customerEmail, promoCode)

        if (result.success) {
            alert('Table Booked Successfully! Check your email for confirmation.')
            // Reset to start
            setCustomerName('')
            setCustomerEmail('')
            setPromoCode('')
            setDiscountApplied(false)
            setPromoMessage(null)
            setStep('select')
            setSelectedTable(null)
            fetchTables() // Refresh data
        } else {
            alert(result.error || 'Booking failed')
        }
        setIsBooking(false)
    }

    if (loading) return <div className="text-center text-slate-500 py-20 animate-pulse">Loading availability...</div>

    if (!loading && tables.length === 0) {
        return (
            <div className="text-center text-slate-400 py-20">
                <p className="text-xl mb-2">No tables available.</p>
                <p className="text-sm">Please try again later or contact support.</p>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto p-4 md:p-8 min-h-[400px]">

            {/* --- VIEW 1: SELECTION GRID --- */}
            {step === 'select' && (
                <div className="table-grid-container relative px-4">
                    {/* Background Pattern - Keeping subtle for depth */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_80%)] -z-10 pointer-events-none" />

                    <h2 className="text-3xl font-heading text-white mb-10 text-center uppercase tracking-widest drop-shadow-lg">
                        Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F1C40F]">Table</span>
                    </h2>

                    {/* LEGEND - MINIMAL */}
                    <div className="flex justify-center gap-8 mb-12 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-[#D4AF37]"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                            <span className="text-[#D4AF37]">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                            <span>Booked</span>
                        </div>
                    </div>

                    {/* CONSTELLATION GRID */}
                    <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto mb-12">
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                onClick={() => !table.isBooked && handleSelectTable(table)}
                                title={!table.isBooked ? `Table ${table.name} • ${table.capacity} Seats` : 'Booked'}
                                className={`
                                    table-card relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                                    ${table.isBooked
                                        ? 'bg-zinc-800 text-zinc-600 scale-90 cursor-not-allowed hidden md:flex' // Hide booked on small screens? or keep dim
                                        : selectedTable?.id === table.id
                                            ? 'bg-[#D4AF37] text-black scale-110 shadow-[0_0_25px_rgba(212,175,55,0.6)] z-10'
                                            : 'border-2 border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-105'
                                    }
                                `}
                            >
                                <span className="font-heading font-bold text-sm leading-none">{String(table.name).replace('Table ', '')}</span>
                                <span className={`text-[9px] font-bold mt-0.5 ${selectedTable?.id === table.id ? 'text-black/70' : 'opacity-60'}`}>
                                    {table.capacity}P
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- VIEW 2: CHECKOUT FORM --- */}
            {step === 'checkout' && selectedTable && (
                <div className="checkout-form-container opacity-0">
                    <div className="bg-[#111] border border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">

                        {/* Decorative BG */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-white/10 pb-6">
                            <div>
                                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Completing Reservation</p>
                                <h3 className="text-3xl font-heading text-white">{selectedTable.name}</h3>
                                <p className="text-slate-400 text-sm mt-1">{selectedTable.category} • Capacity: {selectedTable.capacity} Guests</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Due</p>
                                <p className={`text-2xl font-bold ${discountApplied ? 'text-slate-500 line-through text-lg' : 'text-white'}`}>$100.00</p>
                                {discountApplied && <p className="text-2xl font-bold text-[#D4AF37]">$0.00</p>}
                                <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold">{discountApplied ? 'Promo Applied' : 'Pending Payment'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Promo Code (Required*)</label>
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
                                        className="px-6 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase rounded-lg border border-white/10 transition-colors"
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

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-4 text-slate-400 hover:text-white text-sm font-bold uppercase transition-colors border border-transparent hover:border-white/10 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBooking || !discountApplied}
                                    className="flex-[2] bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-lg text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isBooking ? 'Confirming...' : discountApplied ? 'Confirm Ticket' : 'Apply Promo to Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
