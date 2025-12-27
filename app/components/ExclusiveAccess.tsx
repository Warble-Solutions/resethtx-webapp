'use client'

import Image from 'next/image'
import { Crown, Star, Briefcase } from 'lucide-react'

interface ExclusiveAccessProps {
    onInquire: () => void
}

export default function ExclusiveAccess({ onInquire }: ExclusiveAccessProps) {
    const cards = [
        {
            id: 1,
            title: 'VIP BOTTLE SERVICE',
            description: 'Premium spirits, private seating, and personal service for you and your crew.',
            icon: <Crown className="w-5 h-5 text-black" />,
            buttonText: 'BOOK NOW',
            image: '/images/event-1.jpg', // Placeholder, using existing image
        },
        {
            id: 2,
            title: 'PRIVATE PARTIES',
            description: 'Celebrate in style with a dedicated section and custom packages.',
            icon: <Star className="w-5 h-5 text-black" />,
            buttonText: 'INQUIRE',
            image: '/images/event-2.png', // Placeholder
        },
        {
            id: 3,
            title: 'CORPORATE EVENTS',
            description: 'Impress clients and team members with a unique rooftop experience.',
            icon: <Briefcase className="w-5 h-5 text-black" />,
            buttonText: 'CONTACT US',
            image: '/images/corpo.avif',
        }
    ]

    return (
        <section className="bg-black py-20 px-6 border-b border-white/5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <span className="block text-[#D4AF37] text-xs font-bold tracking-[0.3em] mb-4">
                            UPGRADE YOUR NIGHT
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white uppercase leading-tight font-heading">
                            EXCLUSIVE <span className="bg-white text-black px-2 inline-block transform -skew-x-6">ACCESS</span>
                        </h2>
                    </div>

                    <button
                        onClick={onInquire}
                        className="text-[#D4AF37] font-bold text-sm tracking-widest hover:text-white transition-colors group"
                    >
                        Inquire Now <span className="inline-block transition-transform group-hover:translate-x-1">-&gt;</span>
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={onInquire}
                            className="group relative h-[450px] w-full overflow-hidden rounded-xl cursor-pointer border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500"
                        >
                            {/* Background Image */}
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay (Gradient) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8">

                                {/* Icon Circle */}
                                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-300">
                                    {card.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-white uppercase mb-3 font-heading tracking-wide">
                                    {card.title}
                                </h3>

                                <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100 mb-0 group-hover:mb-6">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>

                                {/* Fallback description visibility for mobile or if logic prefers always visible? 
                    Request said "Small gray text (visible on hover or always)". 
                    I'll make it always visible on mobile, hover on desktop for cleaner look, 
                    OR just always visible. Let's make it always visible but subtle, 
                    and the button emphasizes on hover. 
                    
                    Re-reading: "Hover Effect: ... overlay gets darker." 
                    Let's keep description always visible but cleaner.
                */}
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 md:line-clamp-none group-hover:text-white transition-colors">
                                    {card.description}
                                </p>

                                <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs tracking-widest uppercase">
                                    {card.buttonText} <span className="text-lg leading-none">&gt;</span>
                                </div>

                                {/* Animated Line */}
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
