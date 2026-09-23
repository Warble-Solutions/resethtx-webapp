'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Wine,
  UtensilsCrossed,
  Compass,
  ArrowRight,
  Sparkles,
  Music2,
  Flame,
  Sun,
  Moon,
  Building2,
  ShieldCheck
} from 'lucide-react'

export default function TheExperienceSection() {
  const [activeAtmosphere, setActiveAtmosphere] = useState<'day' | 'night'>('day')

  const experiences = [
    {
      number: "01",
      icon: <Wine className="w-5 h-5 text-[#D4AF37]" />,
      tag: "ARTISANAL MIXOLOGY",
      title: "Botanical Infusions & Reserve Spirits",
      desc: "Smoked bourbon classics, rare agave selections, and house botanical syrups crafted tableside by our lead mixologists.",
      highlight: "Crafted Tableside"
    },
    {
      number: "02",
      icon: <UtensilsCrossed className="w-5 h-5 text-[#D4AF37]" />,
      tag: "HAUTE ROOFTOP DINING",
      title: "Scratch Cajun & Prime Selections",
      desc: "Herb-crusted lamb chops, steak truffle fries, and chef-curated late-night small plates served against the skyline.",
      highlight: "Chef-Driven Kitchen"
    },
    {
      number: "03",
      icon: <Compass className="w-5 h-5 text-[#D4AF37]" />,
      tag: "SKYLINE PANORAMA",
      title: "360° Open-Air Midtown Terrace",
      desc: "Panoramic vantage points overlooking Downtown Houston with motorized climate pergola, ambient fire features, and plush seating.",
      highlight: "Unobstructed Views"
    },
    {
      number: "04",
      icon: <Music2 className="w-5 h-5 text-[#D4AF37]" />,
      tag: "SOUND CALIBRATION",
      title: "Intimate Acoustics & Residencies",
      desc: "Transition from sunset acoustic R&B vocals to late-night melodic house sets powered by high-fidelity sound engineering.",
      highlight: "Curated Sound Design"
    }
  ]

  const metrics = [
    { value: "4,500", unit: "SQ FT", label: "Open-Air Skyline Terrace" },
    { value: "450", unit: "GUESTS", label: "Full Buyout & Reception Capacity" },
    { value: "606", unit: "DENNIS ST", label: "Heart of Midtown Houston" },
    { value: "360°", unit: "SKYLINE", label: "Panoramic Downtown Vistas" }
  ]

  return (
    <section className="relative overflow-hidden bg-[#070709] py-24 sm:py-32 border-t border-[#D4AF37]/20">
      {/* Full-bleed background image with preserved high-res styling */}
      <div className="absolute inset-0">
        <Image
          src="/images/8.png"
          alt="Reset HTX Skyline Terrace Atmosphere"
          fill
          className="object-cover"
          style={{ filter: 'brightness(1.05) contrast(1.02) saturate(1.15)' }}
          sizes="100vw"
        />
        {/* Soft edge blend without darkening the center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, transparent 18%, transparent 82%, rgba(7,7,9,0.7) 100%)'
          }}
        />
      </div>

      {/* Ambient gold aura light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/8 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- 1. EDITORIAL HEADER & DUAL-ATMOSPHERE CALLOUT --- */}
        <div
          className="p-7 sm:p-10 lg:p-12 rounded-3xl mb-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(8,8,12,0.94) 0%, rgba(4,4,6,0.97) 100%)',
            border: '1px solid rgba(212,175,55,0.35)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 24px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Hairline gold accent on top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em]"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(212,175,55,0.45)',
                  color: '#F5E6BE',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono text-[#E5C158]">CHAPTER // 02 · ARCHITECTURAL NARRATIVE</span>
              </div>

              <h2
                className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}
              >
                An Elevated Escape<br />
                <span className="gold-gradient-text-bright">Above Midtown</span>
              </h2>

              <p
                className="font-sans text-zinc-100 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-normal"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
              >
                Perched above <strong className="text-white font-semibold">606 Dennis Street</strong>, Reset HTX is an architectural sanctuary designed for dual-atmosphere opulence. Where sunset craft cocktails and culinary pairings seamlessly transition into curated sound residencies beneath Houston&apos;s skyline.
              </p>
            </div>

            {/* Right: Atmosphere Switcher Pill */}
            <div className="lg:col-span-4 flex flex-col sm:items-start lg:items-end justify-center">
              <div
                className="p-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xl"
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  border: '1px solid rgba(212,175,55,0.4)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <button
                  onClick={() => setActiveAtmosphere('day')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeAtmosphere === 'day'
                      ? 'bg-[#D4AF37] text-black shadow-lg font-extrabold'
                      : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Golden Hour</span>
                </button>
                <button
                  onClick={() => setActiveAtmosphere('night')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeAtmosphere === 'night'
                      ? 'bg-[#D4AF37] text-black shadow-lg font-extrabold'
                      : 'text-zinc-200 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Nightfall</span>
                </button>
              </div>

              <div
                className="mt-3.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#F5E6BE] tracking-wide text-left lg:text-right"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(212,175,55,0.2)'
                }}
              >
                {activeAtmosphere === 'day'
                  ? '✦ Chilled Mixology · Skyline Dining · Sunset Vistas'
                  : '✦ Headliner DJs · Intelligent Lighting · VIP Bottle Rituals'}
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. LUXURY 4-PILLAR EXPERIENCE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {experiences.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 sm:p-7 group transition-all duration-500 hover:-translate-y-1.5 relative overflow-hidden flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(14,14,18,0.95) 0%, rgba(8,8,10,0.98) 100%)',
                border: '1px solid rgba(212,175,55,0.3)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 20px 45px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
            >
              {/* Hairline gold shimmer on top edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent group-hover:via-[#D4AF37] transition-all" />

              <div>
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid rgba(212,175,55,0.35)'
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E5C158] group-hover:text-white transition-colors">
                    // {item.number}
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#E5C158] font-bold block mb-2">
                  {item.tag}
                </span>

                <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-white tracking-wide mb-3 group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="font-sans text-sm text-zinc-100 font-normal leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Tag */}
              <div
                className="pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-200 group-hover:text-[#D4AF37] font-medium transition-colors"
              >
                <span>✦ {item.highlight}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* --- 3. ARCHITECTURAL METRIC STRIP & CTAS --- */}
        <div
          className="p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{
            background: 'linear-gradient(135deg, rgba(14,14,18,0.95) 0%, rgba(8,8,10,0.98) 100%)',
            border: '1px solid rgba(212,175,55,0.35)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}
        >
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto">
            {metrics.map((m, i) => (
              <div key={i} className="border-l-2 border-[#D4AF37]/50 pl-4">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#E5C158] tracking-wider uppercase">
                    {m.unit}
                  </span>
                </div>
                <p className="text-xs text-zinc-100 font-sans font-medium leading-snug">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/about"
              className="w-full sm:w-auto btn-gold-shimmer inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
            >
              <span>Our Full Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] transition-all bg-black/60 shadow-lg"
            >
              <span>View Gallery</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
