'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HappyHourSection() {
    return (
        <section className="w-full bg-zinc-900 border-t border-zinc-800">
            <div className="flex flex-col md:flex-row h-auto md:min-h-[500px] group cursor-default">
                {/* Left: Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <Image
                        src="/images/dancing.jpeg"
                        alt="Happy Hour"
                        fill
                        className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 text-center md:text-left opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                    <h2 className="font-display text-[#D4AF37] text-4xl md:text-6xl leading-tight mb-4 drop-shadow-lg uppercase tracking-tight">
                        Happy Hour
                    </h2>

                    <div className="font-sans text-white text-lg md:text-xl space-y-4 mb-8">
                        <div>
                            <p className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-1">When</p>
                            <p className="text-2xl font-bold">Wed - Fri: 4 PM - 8 PM</p>
                        </div>

                        <div>
                            <p className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-1">Vibe</p>
                            <p className="text-xl">Top 40 & Global Sounds</p>
                        </div>

                        <div>
                            <p className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-1">Offer</p>
                            <p className="text-slate-300">Join us for specials on drinks and bites.</p>
                        </div>
                    </div>

                    <div>
                        <Link
                            href="/menu"
                            className="bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-widest text-sm uppercase inline-block"
                        >
                            View Menu
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
