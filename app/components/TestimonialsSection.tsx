import { MessageSquareQuote, Star } from 'lucide-react'

interface Testimonial {
    id: string
    quote: string
    author_name: string
    author_role: string | null
    created_at: string
    is_active: boolean
    rating?: number
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
    if (!testimonials || testimonials.length === 0) return null

    return (
        <section className="py-28 bg-[#050505] border-t border-white/10 relative overflow-hidden">
            {/* Background Decor & Glow */}
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        CHAPTER // 06 · THE ACCLAIM
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
                        Voices of the <span className="gold-gradient-text">Skyline</span>
                    </h2>
                    <p className="mt-3 text-slate-400 font-sans text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
                        Unfiltered impressions from Houston tastemakers, private celebration hosts, and evening regulars.
                    </p>
                </div>

                {/* Horizontal Scrollable Carousel */}
                <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory custom-scrollbar pt-2">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] snap-center glass-obsidian border border-white/10 p-8 rounded-2xl relative group hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:-translate-y-1.5"
                        >
                            {/* Gold Quote Icon */}
                            <div className="absolute top-6 right-6 text-5xl text-[#D4AF37]/20 font-serif leading-none group-hover:text-[#D4AF37]/50 transition-colors select-none pointer-events-none">
                                &ldquo;
                            </div>

                            <div>
                                {/* Stars */}
                                <div className="flex items-center gap-1 text-[#D4AF37] text-xs mb-5">
                                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                                    ))}
                                </div>

                                {/* Quote Text */}
                                <p className="text-slate-200 font-sans text-sm sm:text-base leading-relaxed mb-8 relative z-10 font-light italic">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                            </div>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 border-t border-white/10 pt-5 mt-auto">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8a701f] flex items-center justify-center text-black font-bold font-heading shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0 text-base">
                                    {t.author_name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider truncate">
                                        {t.author_name}
                                    </h4>
                                    <p className="text-[#D4AF37] text-[11px] font-mono tracking-widest uppercase truncate mt-0.5">
                                        {t.author_role || 'Verified Guest'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="w-4 shrink-0" />
                </div>
            </div>
        </section>
    )
}