import { createClient } from '@/utils/supabase/server'

export default async function TestimonialsSection() {
  const supabase = await createClient()

  // 1. Fetch ALL active testimonials (Removed limit)
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-24 bg-neutral-900 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-[#D4AF37] tracking-[0.3em] font-bold text-sm mb-4 uppercase">
                The Word on the Street
            </h2>
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase">
                Guest <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#F0DEAA]">Love</span>
            </h3>
        </div>

        {/* 2. Scrollable Container */}
        {/* 'snap-x' enables snap scrolling, 'pb-8' makes room for scrollbar */}
        <div className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory custom-scrollbar">
            
            {testimonials.map((t) => (
                <div 
                    key={t.id} 
                    // Fixed width (w-80 or w-96) ensures cards stay consistent size while scrolling
                    className="shrink-0 w-[85vw] md:w-96 snap-center bg-black/40 border border-white/5 p-8 relative group hover:border-[#D4AF37]/30 transition-all duration-500"
                >
                    {/* Gold Quote Icon */}
                    <div className="absolute -top-4 -left-2 text-6xl text-[#D4AF37] opacity-20 font-serif leading-none group-hover:opacity-40 transition-opacity">
                        &ldquo;
                    </div>

                    {/* Quote Text */}
                    <p className="text-slate-300 italic mb-8 relative z-10 font-sans leading-relaxed min-h-[80px]">
                        {t.quote}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#D4AF37] to-[#8a701f] flex items-center justify-center text-black font-bold font-heading shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                            {t.author_name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider">{t.author_name}</h4>
                            <p className="text-[#D4AF37] text-xs font-bold opacity-70">{t.author_role || 'Guest'}</p>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Spacer at the end for smooth scrolling */}
            <div className="w-4 shrink-0"></div>
        </div>
      </div>
    </section>
  )
}