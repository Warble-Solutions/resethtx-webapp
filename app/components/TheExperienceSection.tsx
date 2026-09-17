'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Wine, UtensilsCrossed, Compass, ArrowRight } from 'lucide-react'

export default function TheExperienceSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/8.png"
          alt="Reset HTX Skyline Terrace Atmosphere"
          fill
          className="object-cover"
          style={{ filter: 'brightness(0.35) saturate(1.2)' }}
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Top label */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold mb-5"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            CHAPTER // 02
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-tight mb-4"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            An Elevated Escape<br />
            <span className="gold-gradient-text">Above Midtown</span>
          </h2>
          <p className="font-sans text-zinc-200 text-sm sm:text-base max-w-xl leading-relaxed font-light"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>
            Perched above Midtown Houston, Reset HTX bridges sophisticated dining and high-energy nightlife. A dual-atmosphere haven — where sunset cocktails effortlessly transition into curated sound residencies and skyline celebrations.
          </p>
        </div>

        {/* 3 Feature columns on glass background */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10">
          {[
            { icon: <Wine className="w-5 h-5" />, title: 'Mixology', sub: 'Botanical infusions, smoked classics, and reserve spirits curated by our bar director.' },
            { icon: <UtensilsCrossed className="w-5 h-5" />, title: 'Rooftop Dining', sub: 'Cajun lamb chops, steak truffle fries, and chef-driven late-night plates.' },
            { icon: <Compass className="w-5 h-5" />, title: 'Skyline Vistas', sub: 'Panoramic open-air terrace overlooking downtown Houston\'s glittering skyline.' },
          ].map((item, i) => (
            <div key={i} className="p-5 sm:p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300"
              style={{ background: 'rgba(10,10,12,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#D4AF37]"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                  {item.icon}
                </div>
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
              </div>
              <p className="text-zinc-300 text-xs font-sans leading-relaxed font-light">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom stats bar + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] font-sans">
            <div>
              <span className="text-[#D4AF37] font-bold block mb-0.5">Terrace</span>
              <span className="text-white font-bold text-sm font-heading">4,500 sq ft</span>
            </div>
            <div>
              <span className="text-[#D4AF37] font-bold block mb-0.5">Capacity</span>
              <span className="text-white font-bold text-sm font-heading">450 guests</span>
            </div>
            <div>
              <span className="text-[#D4AF37] font-bold block mb-0.5">Location</span>
              <span className="text-white font-bold text-sm font-heading">606 Dennis St</span>
            </div>
          </div>
          <Link
            href="/about"
            className="btn-gold-shimmer inline-flex items-center gap-2 px-7 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            <span>Our Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
