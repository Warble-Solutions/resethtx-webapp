'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function PrivateEventsSection() {
    return (
        <section className="w-full bg-zinc-900 border-t border-zinc-800">
            <div className="flex flex-col md:flex-row h-auto md:min-h-[600px] group cursor-default">
                {/* Left: Image */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <Image
                        src="/images/cta.jpeg"
                        alt="Private Event Venue"
                        fill
                        className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 text-center md:text-left opacity-90 group-hover:opacity-100 transition-opacity duration-700">
                    <h2 className="font-display text-[#D4AF37] text-3xl md:text-5xl leading-tight mb-8 drop-shadow-lg">
                        Host Your Private Event at Reset Rooftop Bar & Lounge
                    </h2>

                    <div className="font-sans text-slate-300 text-base md:text-lg leading-relaxed space-y-6 mb-10">
                        <p>
                            Looking for the perfect venue for your next event? Reset Rooftop Bar & Lounge offers an upscale, vibrant setting in the heart of Houston. Whether you’re planning a corporate gathering, birthday party, or private reception, our stunning rooftop with skyline views sets the stage for an unforgettable experience.
                        </p>
                        <p>
                            Book your private event today and party with premium bottle service, live DJs, and a stylish indoor-outdoor ambiance.
                        </p>
                    </div>

                    <div>
                        <Link
                            href="/contact"
                            className="bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-widest text-sm uppercase inline-block"
                        >
                            INQUIRE NOW
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
