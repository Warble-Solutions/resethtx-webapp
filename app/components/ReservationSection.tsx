'use client'
import { useState } from 'react'

import { createReservation } from '@/app/actions/reservations'

export default function ReservationSection() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        const result = await createReservation(formData)

        if (result.success) {
            alert(result.message)
            form.reset()
        } else {
            alert(result.message)
        }

        setIsSubmitting(false)
    }

    return (
        <section className="relative py-24 bg-black overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black opacity-50" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" />

            <div className="max-w-4xl mx-auto relative z-10 px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[#D4AF37] tracking-[0.2em] text-sm font-bold uppercase mb-4">Book Your Experience</p>
                    <h2 className="text-5xl md:text-6xl font-heading text-white mb-6">
                        Make a <span className="text-[#D4AF37] italic font-serif">Reservation</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Reserve your table at Reset HTX and experience an evening of unparalleled luxury, cocktails, and sound.
                    </p>
                </div>

                {/* The Card */}
                <div className="bg-[#111] border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative">
                    {/* Subtle Gold Glow Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border border-[#D4AF37]/20 pointer-events-none" />
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Full Name</label>
                                <input required name="full_name" type="text" placeholder="John Doe" className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Email Address</label>
                                <input required name="email" type="email" placeholder="john@example.com" className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-600" />
                            </div>
                        </div>
                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Phone Number</label>
                                <input required name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Number of Guests</label>
                                <select name="guests" className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-slate-400">
                                    <option>2 Guests</option>
                                    <option>3 Guests</option>
                                    <option>4 Guests</option>
                                    <option>5-8 Guests (Large Party)</option>
                                    <option>8+ (Contact Us)</option>
                                </select>
                            </div>
                        </div>
                        {/* Row 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Date</label>
                                <input required name="date" type="date" className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all [color-scheme:dark]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Time</label>
                                <select name="time" className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-slate-400">
                                    <option>7:00 PM</option>
                                    <option>8:00 PM</option>
                                    <option>9:00 PM</option>
                                    <option>10:00 PM</option>
                                    <option>11:00 PM</option>
                                </select>
                            </div>
                        </div>
                        {/* Row 4 */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Special Requests</label>
                            <textarea name="special_requests" rows={3} placeholder="Any special occasions or dietary requirements..." className="w-full bg-slate-900/50 border border-white/10 text-white p-4 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-slate-600"></textarea>
                        </div>
                        {/* Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#D4AF37] hover:bg-white text-black font-bold text-sm tracking-[0.2em] uppercase py-5 rounded-lg transition-all transform hover:scale-[1.01] shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                        </button>
                        <p className="text-center text-xs text-slate-600 mt-4">
                            By making a reservation, you agree to our <span className="text-slate-400 underline cursor-pointer hover:text-[#D4AF37]">terms & conditions</span>.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}
