'use client'

import { useState } from 'react' // NEW
import { X, CreditCard } from 'lucide-react'

interface Table {
    id: string
    name: string
    capacity: number
    price: number
    category: string
}

interface BookingCheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    selectedTable: Table | null
    eventDate: string
    onConfirm: (e: React.FormEvent) => Promise<void>
    isProcessing: boolean
    error: string | null
    guestDob?: string // Added guestDob for summary display
    discountPercent?: number
    bookingFee?: number // NEW
    children?: React.ReactNode // For passing form inputs if needed, or specific checkout fields
}

export default function BookingCheckoutModal({
    isOpen,
    onClose,
    selectedTable,
    eventDate,
    onConfirm,
    isProcessing,
    error,
    guestDob,
    discountPercent = 0,
    bookingFee = 50, // Default to 50
    children
}: BookingCheckoutModalProps) {
    const [hasAgreed, setHasAgreed] = useState(false) // NEW

    if (!isOpen || !selectedTable) return null

    const finalPrice = bookingFee - ((bookingFee * discountPercent) / 100)

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-zinc-950 border border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03]">
                    <img src="/logos/r_logo.png" alt="Brand" className="w-[80%]" />
                </div>

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111]">
                    <h2 className="font-heading text-xl md:text-2xl text-[#D4AF37] uppercase tracking-wider">Confirm Reservation</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 md:p-8">
                    {/* Summary Card */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                        <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">{selectedTable.name}</h3>
                                <p className="text-slate-400 text-sm mt-1">{selectedTable.category}</p>
                            </div>
                            <div className="text-right">
                                {discountPercent > 0 ? (
                                    <>
                                        <p className="text-slate-500 font-bold text-sm line-through decoration-red-500/50">${bookingFee.toFixed(2)}</p>
                                        <p className="text-[#D4AF37] font-bold text-xl">${finalPrice.toFixed(2)}</p>
                                        <p className="text-[10px] text-green-400 uppercase font-bold">{discountPercent}% OFF</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[#D4AF37] font-bold text-xl">${bookingFee.toFixed(2)}</p>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Res. Fee</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 uppercase font-bold text-[10px] mb-1">Date</p>
                                <p className="text-white font-medium">{new Date(eventDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 uppercase font-bold text-[10px] mb-1">Guests</p>
                                <p className="text-white font-medium">Up to {selectedTable.capacity} People</p>
                            </div>
                            {guestDob && (
                                <div className="col-span-2 border-t border-white/10 pt-2 mt-2">
                                    <p className="text-slate-500 uppercase font-bold text-[10px] mb-1">Date of Birth</p>
                                    <p className="text-white font-medium">
                                        {new Date(guestDob).toLocaleDateString('en-US', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form & Payment Placeholder */}
                    <form onSubmit={onConfirm} className="space-y-6">
                        {/* Inject external form fields if any */}
                        {children}

                        {/* Payment Mockup */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase">Payment Method</label>
                            <div className="flex items-center gap-4 p-4 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-lg">
                                <CreditCard className="text-[#D4AF37]" size={24} />
                                <div>
                                    <p className="text-white font-bold text-sm">Credit Card (Stripe)</p>
                                    <p className="text-xs text-slate-400">Secure transaction encrypted.</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex items-start gap-3 my-4">
                            <input
                                type="checkbox"
                                id="terms-booking"
                                checked={hasAgreed}
                                onChange={(e) => setHasAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] bg-zinc-800 border-zinc-600"
                            />
                            <label htmlFor="terms-booking" className="text-sm text-zinc-400 leading-tight">
                                I agree to the <a href="/terms" target="_blank" className="underline hover:text-[#D4AF37]">Terms & Conditions</a> and <a href="/privacy" target="_blank" className="underline hover:text-[#D4AF37]">Privacy Policy</a>.
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 text-slate-400 hover:text-white font-bold uppercase tracking-wider text-xs border border-transparent hover:border-white/10 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing || !hasAgreed}
                                className="flex-[2] bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : `Pay $${finalPrice.toFixed(2)} & Complete`}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}
