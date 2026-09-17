'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Wine, UtensilsCrossed, Compass } from 'lucide-react'

export default function TheExperienceSection() {
  return (
    <section className="py-28 bg-[#070709] border-t border-white/5 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#D4AF37]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: EDITORIAL COPY */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5" />
              The Reset Experience
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-white leading-[1.05] tracking-tight">
              An Elevated Escape <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F0DEAA] to-[#D4AF37]">
                Above Midtown
              </span>
            </h2>

            <p className="font-sans text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
              Perched above the vibrant pulse of Midtown Houston, Reset HTX bridges the gap between sophisticated dining and vibrant nightlife. We designed a dual-atmosphere sanctuary — where golden-hour sunset cocktails effortlessly transition into client dinners, curated music residencies, and unforgettable celebrations.
            </p>

            {/* THREE LUXURY PILLARS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <Wine className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">Mixology</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">Infused botanicals, artisanal syrups, and smoked classics.</p>
              </div>

              <div className="space-y-2">
                <UtensilsCrossed className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">Rooftop Dining</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">Cajun lamb chops, steak truffle fries, and late-night bites.</p>
              </div>

              <div className="space-y-2">
                <Compass className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">Skyline Vistas</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">Panoramic open-air terrace overlooking downtown Houston.</p>
              </div>
            </div>

            {/* ACTION */}
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors group"
              >
                <span>Read Our Story & Architecture</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: LAYERED EDITORIAL IMAGERY */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden border border-zinc-800/90 shadow-2xl group">
                <Image
                  src="/private_page/2.jpeg"
                  alt="Reset HTX Evening Atmosphere"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Atmosphere</p>
                  <p className="font-heading text-xl text-white font-bold">Where Houston Unwinds & Celebrates</p>
                </div>
              </div>

              {/* Overlapping Small Float Card */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 w-56 h-56 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl">
                <Image
                  src="https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566172315-menu-item.jpg"
                  alt="Lamb Chop Cajun Pasta at Reset"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Culinary Spotlight</span>
                  <p className="text-xs text-white font-bold truncate">Lamb Chop Cajun Pasta</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
