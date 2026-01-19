'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import InquireModal from '@/app/components/InquireModal'

export default function PrivateEventsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

    return (
        <div className="bg-black min-h-screen text-white">
            {/* 1. HERO SECTION */}
            <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/private_page/5.jpeg"
                        alt="Reset Rooftop Skyline"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black" />
                </div>
                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 font-heading"
                    >
                        Elevate Your <span className="text-[#D4AF37]">Celebration</span>
                    </motion.h1>
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed font-sans"
                    >
                        Host your next unforgettable event at Reset Rooftop & Lounge.
                        From corporate functions to birthday buyouts, experience the best views in Houston.
                    </motion.p>
                    <motion.button
                        initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4, duration: 0.6 }}
                        onClick={() => setIsModalOpen(true)}
                        className="px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-[#b5952f] transition-all transform hover:scale-105 rounded-full"
                    >
                        Inquire Now
                    </motion.button>
                </div>
            </div>

            {/* 2. THE EXPERIENCE (Text + Image) */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-4">The Venue</h2>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6 font-heading">We Love a Good Party</h3>
                    <div className="space-y-6 text-zinc-400 leading-relaxed font-sans">
                        <p>
                            Located less than 10 minutes from downtown Houston, Reset offers a versatile canvas for your vision.
                            Our spaces include a stunning open-air patio with panoramic skyline views and cozy interior lounge seating
                            tailored to suit any occasion.
                        </p>
                        <p>
                            Whether it's a reception, engagement party, or corporate mixer, we provide the elevated experience
                            your guests deserve.
                        </p>
                    </div>
                </div>
                <div className="relative h-[250px] md:h-[500px] w-full rounded-lg overflow-hidden border border-zinc-800">
                    <video
                        src="/vids/vid.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </section>

            {/* 3. AMENITIES GRID */}
            <section className="bg-zinc-900/50 py-20 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { title: "Skyline Views", desc: "Panoramic downtown backdrops" },
                            { title: "A/V Ready", desc: "DJs, Sound Systems & TVs" },
                            { title: "Full Bar", desc: "Premium cocktails & bottle service" },
                            { title: "VIP Access", desc: "Valet parking available" }
                        ].map((item, i) => (
                            <div key={i} className="p-6 border border-white/5 bg-black/40 rounded-lg hover:border-[#D4AF37]/50 transition-colors group">
                                <h4 className="text-[#D4AF37] font-bold text-xl mb-2 uppercase font-heading group-hover:text-white transition-colors">{item.title}</h4>
                                <p className="text-zinc-500 text-sm font-sans">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. VISUAL GALLERY */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
                        <div className="relative h-full col-span-1 md:col-span-1 rounded-lg overflow-hidden group border border-white/5">
                            <Image src="/private_page/2.jpeg" alt="Party" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="flex flex-col gap-4 h-full col-span-1 md:col-span-1">
                            <div className="relative flex-1 rounded-lg overflow-hidden group border border-white/5">
                                <Image src="/private_page/1.png" alt="Drinks" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative flex-1 rounded-lg overflow-hidden group border border-white/5">
                                <Image src="/private_page/3.jpeg" alt="Bottles" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                        <div className="relative h-full col-span-1 md:col-span-1 rounded-lg overflow-hidden group border border-white/5">
                            <Image src="/private_page/4.jpg" alt="Vibe" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 text-center px-6 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase mb-6 tracking-tighter font-heading text-white">
                        Ready to <span className="text-[#D4AF37]">Reset?</span>
                    </h2>
                    <p className="text-xl text-zinc-400 font-medium mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
                        For parties of 10 or more, corporate events, and full venue buyouts.
                        Our reservation managers typically respond within 48 hours.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#D4AF37] text-black px-12 py-5 font-bold uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:scale-105 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        Start Planning
                    </button>
                    <p className="mt-8 text-xs font-bold text-zinc-600 uppercase tracking-widest">* 21+ Guests Only</p>
                </div>
            </section>

            {/* REUSE EXISTING MODAL */}
            <InquireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
