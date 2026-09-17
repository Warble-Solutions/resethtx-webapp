'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Music2, Wine, Building2 } from 'lucide-react'

export default function VenueShowcaseSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background split: left dark, right image */}
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute inset-0 w-1/2" style={{ background: '#050505' }} />
        <div className="absolute inset-0 left-1/2">
          <Image
            src="/images/12.png"
            alt="Reset HTX Rooftop Venue"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.5) saturate(1.2)' }}
            sizes="50vw"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #050505 0%, transparent 30%)' }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
              CHAPTER // 05
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              Your Next Event,<br />
              <span className="gold-gradient-text">Elevated</span>
            </h2>

            <p className="text-zinc-300 text-sm font-sans leading-relaxed font-light max-w-lg">
              Boardroom views, not boardrooms. Reset HTX offers an unmatched rooftop setting for corporate receptions, client dinners, milestone galas, and complete venue buyouts.
            </p>

            {/* Metrics row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Users className="w-4 h-4" />, label: 'Capacity', value: '450 standing · 280 seated' },
                { icon: <Music2 className="w-4 h-4" />, label: 'AV Ready', value: 'Club sound & DJ booth' },
                { icon: <Wine className="w-4 h-4" />, label: 'Bar & Catering', value: 'Custom mixology & menus' },
                { icon: <Building2 className="w-4 h-4" />, label: 'Skyline Views', value: 'Open terrace & salon' },
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                    {m.icon}
                    <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">{m.label}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans font-light">{m.value}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/private-events"
                className="btn-gold-shimmer inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] py-3 px-7 rounded-full"
              >
                <span>Explore Venue Rental</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-bold uppercase tracking-[0.18em] text-[11px] py-3 px-7 rounded-full text-white hover:text-[#D4AF37] transition-colors"
                style={{ background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Inquire With Event Team
              </Link>
            </div>
          </div>

          {/* Right: Stacked images (visible on mobile as well) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
              <Image
                src="/images/16.png"
                alt="Corporate Gathering"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)' }} />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-heading font-bold text-xs">Corporate & Galas</p>
                <p className="text-[#D4AF37] text-[9px] uppercase font-mono tracking-widest">Full Production</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group translate-y-6" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
              <Image
                src="/images/14.png"
                alt="Friday Exchange Night"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)' }} />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-heading font-bold text-xs">Skyline Terrace</p>
                <p className="text-[#D4AF37] text-[9px] uppercase font-mono tracking-widest">Open-Air Rooftop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
