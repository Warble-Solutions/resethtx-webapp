'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, Music2, Wine, ArrowRight } from 'lucide-react'

export default function VenueShowcaseSection() {
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5" />
              Private Events & Buyouts
            </div>

            <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
              Your Next Event, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]">
                Elevated
              </span>
            </h2>

            <p className="text-slate-300 text-lg font-sans leading-relaxed">
              Boardroom views, not boardrooms. Located in the heart of Midtown Houston, Reset HTX offers an unmatched rooftop setting for corporate receptions, client dinners, private celebrations, and full venue buyouts.
            </p>

            {/* Capacity & Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-3 mb-1 text-[#D4AF37]">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-white text-base">Capacity</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Up to 450 standing · 280 seated
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-3 mb-1 text-[#D4AF37]">
                  <Music2 className="w-5 h-5" />
                  <span className="font-bold text-white text-base">Full AV Ready</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  DJ booth, premium sound & smart lighting
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-3 mb-1 text-[#D4AF37]">
                  <Wine className="w-5 h-5" />
                  <span className="font-bold text-white text-base">Bar & Catering</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Custom cocktail menus & plated dinner options
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-3 mb-1 text-[#D4AF37]">
                  <Building2 className="w-5 h-5" />
                  <span className="font-bold text-white text-base">Skyline Views</span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Panoramic open-air patio & cozy interior
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/private-events"
                className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Explore Venue Rental
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-full transition-all"
              >
                Inquire With Event Team
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Showcase Gallery */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-800 group">
              <Image
                src="/private_page/5.jpeg"
                alt="Reset HTX Rooftop Skyline View"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-sm">Downtown Skyline View</p>
                <p className="text-slate-400 text-xs">Open-air rooftop patio</p>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-800 group translate-y-6">
              <Image
                src="/private_page/2.jpeg"
                alt="Corporate Gathering at Reset HTX"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-sm">Corporate & Private Mixers</p>
                <p className="text-slate-400 text-xs">Custom seating & cocktail service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
