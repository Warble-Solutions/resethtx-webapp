'use client'

import { Star, MessageSquarePlus } from 'lucide-react'

interface ReviewsCTAProps {
    onOpenReview: () => void
}

export default function ReviewsCTA({ onOpenReview }: ReviewsCTAProps) {
    return (
        <section className="py-20 bg-[#050505] border-t border-white/10 relative overflow-hidden">
            {/* Ambient Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="glass-obsidian border border-[#D4AF37]/25 rounded-3xl p-10 sm:p-14 text-center shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
                    {/* Subtle top shimmer bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-6">
                        <MessageSquarePlus className="w-5 h-5" />
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-white uppercase font-bold tracking-tight mb-4">
                        Did you enjoy your time at <span className="gold-gradient-text">Reset?</span>
                    </h2>
                    <p className="text-slate-300 font-sans text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed mb-8">
                        Your impressions help us refine our craft, elevate our hospitality, and deliver Houston&apos;s ultimate rooftop sanctuary.
                    </p>
                    
                    <button
                        onClick={onOpenReview}
                        className="btn-gold-shimmer inline-flex items-center justify-center gap-3 text-black font-bold py-4 px-10 rounded-lg text-xs uppercase tracking-[0.25em] transition-all cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:scale-105"
                    >
                        <Star className="w-4 h-4 fill-black" />
                        <span>Leave a Review</span>
                    </button>
                </div>
            </div>
        </section>
    )
}
