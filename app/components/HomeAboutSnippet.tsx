'use client'

import Link from 'next/link'
import { Wine, Sparkles, Music2, Building2, MapPin, ArrowRight, Compass, Shield, Users, Clock } from 'lucide-react'

export default function HomeAboutSnippet() {
  const highlights = [
    {
      icon: <Wine className="w-5 h-5 text-[#D4AF37]" />,
      tag: "CRAFT MIXOLOGY",
      title: "Elevated Mixology",
      desc: "Smoked classic cocktails, botanical infusions, and chef-curated small plates."
    },
    {
      icon: <Building2 className="w-5 h-5 text-[#D4AF37]" />,
      tag: "PANORAMA",
      title: "Skyline Views",
      desc: "Open-air rooftop terrace overlooking Midtown and the glittering Downtown skyline."
    },
    {
      icon: <Music2 className="w-5 h-5 text-[#D4AF37]" />,
      tag: "RESIDENCIES",
      title: "Curated Sounds",
      desc: "Acoustic R&B, deep melodic house, 90s throwbacks, and guest headline DJs."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
      tag: "VIP & HOSPITALITY",
      title: "VIP Celebrations",
      desc: "Dedicated sectional bottle service, custom sparkler presentations, and buyouts."
    }
  ]

  const metrics = [
    { value: "4,500", unit: "SQ FT", label: "Open-Air Skyline Terrace" },
    { value: "360°", unit: "PANORAMA", label: "Midtown & Downtown Views" },
    { value: "05", unit: "NIGHTS", label: "Wed – Sun Weekly Programming" },
    { value: "450", unit: "GUESTS", label: "Full Buyout & Gala Capacity" }
  ]

  return (
    <section className="relative bg-[#070709] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 overflow-hidden">
      {/* Ambient gold & champagne radial halo lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute -top-12 left-10 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative luxury architectural top banner */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>EST. 2021 · 606 DENNIS STREET · MIDTOWN HOUSTON</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">
          
          {/* Left Column: Brand Story & Context */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]"
              style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.35)',
                color: '#D4AF37',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Midtown Houston&apos;s Rooftop Sanctuary</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.08]">
              Elevated Sips. Skyline Views.<br />
              <span className="gold-gradient-text">Unrivaled Energy.</span>
            </h2>

            <p className="font-sans text-zinc-200 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
              Perched above <strong className="text-white font-medium">606 Dennis Street</strong> in the heartbeat of Midtown, <strong className="text-white font-medium">Reset HTX</strong> seamlessly bridges sophisticated rooftop dining with electrifying nightlife. From golden-hour craft cocktails and chef-curated small plates overlooking downtown to late-night headliner DJ sets under the open sky, every detail is engineered to elevate your evening.
            </p>

            {/* Quick Action Buttons & Metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5">
              <Link
                href="/about"
                className="btn-gold-shimmer inline-flex items-center gap-2 py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/menu"
                className="inline-flex items-center gap-2 py-3.5 px-7 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] transition-all hover:border-[#D4AF37]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <span>Explore Menu</span>
              </Link>

              <div className="inline-flex items-center gap-2 text-zinc-300 text-xs font-sans tracking-wide py-1 px-3 rounded-full bg-white/[0.03] border border-white/[0.08]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>606 Dennis St • Midtown Houston</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Highlight Luxury Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(145deg, rgba(20,20,24,0.85) 0%, rgba(10,10,12,0.92) 100%)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
                }}
              >
                {/* Hairline gold accent on card top */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: 'rgba(212,175,55,0.12)',
                        border: '1px solid rgba(212,175,55,0.3)'
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-mono font-semibold">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-zinc-300 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Luxury Metric Strip */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 pb-2"
          style={{ borderTop: '1px solid rgba(212,175,55,0.18)' }}
        >
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col text-left pl-2 sm:pl-4 border-l border-[#D4AF37]/25">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {m.value}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-[#D4AF37] tracking-wider uppercase">
                  {m.unit}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans font-light leading-snug">
                {m.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
