'use client'

import { useState } from 'react'
import Image from 'next/image'
import InquireModal from './InquireModal'

export default function PrivateEventsAboutSection() {
    const [isInquireModalOpen, setIsInquireModalOpen] = useState(false)

    return (
        <section className="py-24 bg-zinc-900 border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Content */}
                <div className="order-2 lg:order-1">
                    <h2 className="font-heading text-5xl md:text-6xl text-[#D4AF37] mb-4">WE LOVE A GOOD PARTY</h2>
                    <h3 className="font-sans text-xl text-white font-bold mb-8">Host your next unforgettable event at Reset Rooftop & Lounge.</h3>

                    <div className="space-y-6 text-slate-400 font-sans text-lg leading-relaxed mb-10">
                        <p>
                            The perfect venue for corporate functions, birthday celebrations, receptions, engagement parties, and more. Our versatile spaces include a stunning rooftop patio and cozy interior seating, tailored to suit any occasion.
                        </p>
                        <p>
                            Centrally located less than 10 minutes from downtown Houston, enjoy panoramic skyline views with our elevated experience for your private gathering.
                        </p>
                    </div>

                    {/* Amenities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {['State-of-the-art TVs', 'Professional DJ services', 'High-quality sound system', 'Valet parking'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                                <span className="text-white font-sans text-sm tracking-wide uppercase">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Booking Info */}
                    <p className="text-slate-500 italic text-sm mb-2">
                        To submit a private reservation request for a party of 10 or more people, please complete the form below. A reservation manager will contact you within 48 hours.
                    </p>
                    <p className="text-slate-500 text-xs mb-8 uppercase tracking-wider">For guests 21 and up only.</p>

                    <button
                        onClick={() => setIsInquireModalOpen(true)}
                        className="bg-[#D4AF37] text-black hover:bg-white font-bold py-4 px-10 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,157,36,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(197,157,36,0.6)]"
                    >
                        Inquire For Events
                    </button>
                </div>

                {/* Right: Image */}
                <div className="order-1 lg:order-2 h-[600px] w-full relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#D4AF37]/30 transition-colors duration-500">
                    <Image
                        src="/images/dancing.jpeg"
                        alt="Private Event at Reset"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </div>

            </div>

            <InquireModal
                isOpen={isInquireModalOpen}
                onClose={() => setIsInquireModalOpen(false)}
            />
        </section>
    )
}
