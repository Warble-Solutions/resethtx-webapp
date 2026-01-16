import Image from 'next/image'
import Link from 'next/link'
import { IdCard, Shirt, Users, Ticket, Car } from 'lucide-react'
import PrivateEventsAboutSection from '@/app/components/PrivateEventsAboutSection'
import BookTableButton from '@/app/components/BookTableButton'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#C59D24] selection:text-black pt-32 pb-0">

            {/* 1. CINEMATIC HERO */}
            <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 border-b border-white/5 overflow-hidden">
                <div className="max-w-4xl mx-auto z-10">
                    <h2 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        Est. 2021 • Midtown Houston
                    </h2>
                    <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        The Standard <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C59D24] to-[#F0DEAA]">Of Luxury</span>
                    </h1>
                    <p className="font-sans text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        A rooftop sanctuary where sound, taste, and atmosphere converge to create Houston's most exclusive vibe.
                    </p>
                </div>

                {/* Background texture/noise (Pulse Removed) */}
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-15 pointer-events-none"></div>

                {/* Subtle Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C59D24]/5 blur-[100px] rounded-full pointer-events-none"></div>
            </section>


            {/* 2. THE VISION (Manifesto) */}
            <section className="py-24 px-6 bg-[#050505] relative">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="block w-1 h-16 bg-[#C59D24] mx-auto mb-8 animate-in fade-in zoom-in duration-1000 delay-300"></span>
                    <h3 className="font-heading text-3xl md:text-4xl text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        OUR STORY
                    </h3>
                    <div className="prose prose-invert prose-lg mx-auto font-sans text-slate-400 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 space-y-6">
                        <p>
                            RESET, officially known as Reset Rooftop Lounge, emerged as a vibrant addition to Houston's Midtown nightlife scene in the summer of 2022. Owned by physician-turned-businessman Dr. Abdulla Kudrath, the venue was built in a newly constructed building at 606 Dennis Street. The project aimed to fill a gap in Houston's rooftop lounge offerings with a focus on high-quality sound systems, crystal-clear acoustics, and a rooftop patio boasting panoramic skyline views.
                        </p>
                        <p>
                            Drawing inspiration from the city's growing demand for sophisticated yet energetic spaces, Reset Rooftop Lounge was designed as an intimate spot emphasizing local and regional talent alongside occasional international acts and celebrities.
                        </p>
                        <p>
                            Since opening, Reset has established itself as a premier destination for cocktails, hookah, live DJs, and weekly events. By the mid-2020s, the lounge has continued to thrive under ongoing management tied to Houston nightlife operators, hosting diverse music genres from Afro-Beats, House, R&B, and Techno to Hip-Hop, solidifying its reputation as a Midtown hotspot with stunning views of the city and unforgettable vibes.
                        </p>
                    </div>
                </div>
            </section>


            {/* 3. ZIG-ZAG FEATURE: THE INTERIOR */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 group order-2 lg:order-1 hover:border-[#C59D24]/30 transition-colors duration-500">
                        <Image
                            src="/images/event-1.jpg" // Use an interior shot
                            alt="Reset Interior"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                    </div>

                    {/* Text Side */}
                    <div className="order-1 lg:order-2">
                        <h4 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs mb-4">The Interior</h4>
                        <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
                            Industrial Chic Meets <br /> Modern Opulence
                        </h2>
                        <p className="font-sans text-slate-400 text-lg leading-relaxed mb-8">
                            Designed with an eye for contrast, our main lounge blends raw concrete textures with velvet softness. Low-slung modular seating invites conversation, while our intelligent lighting system adapts to the rhythm of the night.
                        </p>

                        {/* Animated List */}
                        <ul className="space-y-4 font-sans text-sm text-white">
                            {['Custom Velvet Seating', 'Intelligent Mood Lighting', 'State-of-the-Art Sound Treatment'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 group cursor-default">
                                    <span className="w-2 h-2 bg-[#C59D24] rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                                    <span className="group-hover:text-[#C59D24] group-hover:translate-x-2 transition-all duration-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>


            {/* 4. ZIG-ZAG FEATURE: THE PATIO (Swapped Layout) */}
            <section className="py-24 border-t border-white/5 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Side */}
                    <div>
                        <h4 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs mb-4">The Patio</h4>
                        <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
                            Under The <br /> Midtown Stars
                        </h2>
                        <p className="font-sans text-slate-400 text-lg leading-relaxed mb-8">
                            Step out onto our expansive terrace, where the energy of the city serves as your backdrop. It’s the perfect vantage point to watch Houston light up. Whether you are enjoying a cigar in our designated smoking area or sipping a chilled glass of champagne, the patio offers a breath of fresh air without leaving the party.
                        </p>
                        The patio offers a breath of fresh air without leaving the party.
                    </p>
                    <BookTableButton />
                </div>

                {/* Image Side */}
                <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 group hover:border-[#C59D24]/30 transition-colors duration-500">
                    <Image
                        src="/images/event-2.png" // Use a patio/exterior shot
                        alt="The Patio"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>

            </div>
        </section>


            {/* 5. THE EXPERIENCE (3 Pillars) */ }
    <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">The Experience</h2>
                <p className="text-slate-500 font-sans max-w-2xl mx-auto">Three pillars that define every night at Reset HTX.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Pillar 1 */}
                <div className="bg-[#111] p-10 rounded-xl border border-white/5 hover:border-[#C59D24]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#C59D24]/10 group">
                    <h3 className="text-[#C59D24] font-heading text-2xl mb-4 group-hover:text-white transition-colors">Sonic Identity</h3>
                    <p className="font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        We don't play background music. We curate soundscapes. From deep house grooves to soulful R&B, our residents are chosen for their ability to read a room, not just a playlist.
                    </p>
                </div>
                {/* Pillar 2 */}
                <div className="bg-[#111] p-10 rounded-xl border border-white/5 hover:border-[#C59D24]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#C59D24]/10 group md:-translate-y-8">
                    <h3 className="text-[#C59D24] font-heading text-2xl mb-4 group-hover:text-white transition-colors">Mixology</h3>
                    <p className="font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        Our bar program is rooted in classics but finished with a modern twist. Expect hand-cut ice, premium spirits, and botanicals sourced specifically for our menu.
                    </p>
                </div>
                {/* Pillar 3 */}
                <div className="bg-[#111] p-10 rounded-xl border border-white/5 hover:border-[#C59D24]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#C59D24]/10 group">
                    <h3 className="text-[#C59D24] font-heading text-2xl mb-4 group-hover:text-white transition-colors">Hospitality</h3>
                    <p className="font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        Service is an art form. Our staff is trained to anticipate needs before they arise, ensuring your glass is never empty and your night is never interrupted.
                    </p>
                </div>
            </div>
        </div>
    </section>


    {/* 6. HOUSE RULES (Redesigned) */ }
    <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-5">
            <img src="/logos/r_logo.png" alt="Brand" className="w-[600px] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#C59D24] uppercase tracking-widest mb-4">House Rules</h2>
                <p className="font-sans text-slate-500 text-lg max-w-2xl mx-auto">
                    To ensure a premium experience for all guests, we ask that you adhere to the following standards.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                {/* Slot 1: Dress Code */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl flex flex-col items-center text-center hover:border-[#C59D24] transition-colors duration-300 group">
                    <div className="mb-6 p-4 bg-[#C59D24]/10 rounded-full group-hover:bg-[#C59D24]/20 transition-colors">
                        <Shirt className="w-8 h-8 text-[#C59D24]" />
                    </div>
                    <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2">ELEVATED ATTIRE</h3>
                    <p className="text-zinc-400 font-sans leading-relaxed">
                        Fashion-forward, upscale, and creative looks are encouraged. No shorts, tank tops, jerseys, sweatpants, or gym bags. Athletic wear may be denied entry.
                    </p>
                </div>

                {/* Slot 2: Age & Vibe */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl flex flex-col items-center text-center hover:border-[#C59D24] transition-colors duration-300 group">
                    <div className="mb-6 p-4 bg-[#C59D24]/10 rounded-full group-hover:bg-[#C59D24]/20 transition-colors">
                        <IdCard className="w-8 h-8 text-[#C59D24]" />
                    </div>
                    <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2">21+ & VIBE</h3>
                    <p className="text-zinc-400 font-sans leading-relaxed">
                        Strictly 21+ at all times. The atmosphere is Elevated, Eclectic, Social, and Intimate.
                    </p>
                </div>

                {/* Slot 3: Parking */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl flex flex-col items-center text-center hover:border-[#C59D24] transition-colors duration-300 group">
                    <div className="mb-6 p-4 bg-[#C59D24]/10 rounded-full group-hover:bg-[#C59D24]/20 transition-colors">
                        <Car className="w-8 h-8 text-[#C59D24]" />
                    </div>
                    <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2">VALET & ARRIVAL</h3>
                    <p className="text-zinc-400 font-sans leading-relaxed">
                        Valet available for $15 ($5 during Happy Hour). Street parking is also available.
                    </p>
                </div>

            </div>
        </div>
    </section>


    {/* 7. PRIVATE EVENTS CTA */ }
    <PrivateEventsAboutSection />

        </main >
    )
}