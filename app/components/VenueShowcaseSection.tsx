'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  Users,
  Music2,
  Wine,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Utensils,
  Maximize2
} from 'lucide-react'
import InquireModal from './InquireModal'

const VENUE_SPACES = [
  {
    id: 'terrace',
    name: "The Skyline Terrace",
    badge: "Open-Air Rooftop Deck",
    capacity: "Up to 250 Guests",
    seatedCapacity: "140 Seated",
    area: "3,000 Sq Ft",
    description: "Panoramic views of Downtown Houston with expansive open-air lounge seating, 360° terrace bar, and motorized climate pergola.",
    image: "/private_page/2.jpeg",
    highlights: [
      "Unobstructed Downtown Houston Skyline Views",
      "Dedicated 360-Degree Terrace Craft Bar",
      "Weather-Adaptive Retractable Pergola Cover",
      "Integrated Sound System & Evening Mood Glow"
    ]
  },
  {
    id: 'lounge',
    name: "The Obsidian Lounge",
    badge: "Interior Luxury Salon",
    capacity: "Up to 150 Guests",
    seatedCapacity: "85 Seated",
    area: "1,500 Sq Ft",
    description: "Intimate climate-controlled haven featuring plush velvet banquet booths, ambient gold lighting, and direct connection to the premier DJ booth.",
    image: "/private_page/4.jpg",
    highlights: [
      "Full Climate-Controlled Interior Salon",
      "Custom Sound-Synchronized Intelligent Lighting",
      "Dedicated Interior Craft Cocktail Bar",
      "Plush Velvet VIP Banquettes & DJ Staging"
    ]
  },
  {
    id: 'buyout',
    name: "Full Venue Buyout",
    badge: "Complete Rooftop Exclusivity",
    capacity: "Up to 450 Guests",
    seatedCapacity: "250 Seated",
    area: "4,500 Sq Ft",
    description: "Dual-level access uniting terrace and salon. Complete private buyout with dedicated event staff, security, private chef, and custom mixology.",
    image: "/private_page/6.png",
    highlights: [
      "Exclusive Dual-Atmosphere Indoor & Outdoor Access",
      "Private VIP Arrival & Dedicated Valet Staging",
      "Full AV Control, DJ Booth & Multi-Zone Sound",
      "Dedicated Event Director & Full Culinary Staff"
    ]
  }
]

const EVENT_PILLARS = [
  {
    icon: <Building2 className="w-5 h-5 text-[#D4AF37]" />,
    title: "Corporate Receptions",
    subtitle: "High-impact executive mixers, client dinners, and tech networking with skyline views."
  },
  {
    icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
    title: "Brand Activations",
    subtitle: "Turnkey visual canvas with projection surfaces, custom backdrops, and club-grade sound."
  },
  {
    icon: <Wine className="w-5 h-5 text-[#D4AF37]" />,
    title: "Milestone Galas",
    subtitle: "Celebratory birthdays, anniversaries, and year-end buyouts with theatrical bottle rituals."
  },
  {
    icon: <Utensils className="w-5 h-5 text-[#D4AF37]" />,
    title: "Culinary Pairings",
    subtitle: "Chef-curated passed hors d'oeuvres, Cajun prime cuts, and custom mixology menus."
  }
]

export default function VenueShowcaseSection() {
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0)
  const [isInquireModalOpen, setIsInquireModalOpen] = useState(false)

  const activeSpace = VENUE_SPACES[activeSpaceIndex]

  return (
    <section className="relative overflow-hidden bg-[#070709] py-24 sm:py-32 border-t border-[#D4AF37]/20">
      {/* Ambient background gold glow & subtle grid */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/6 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- 1. EDITORIAL HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(212,175,55,0.45)',
                color: '#F5E6BE',
                backdropFilter: 'blur(12px)'
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono text-[#E5C158]">CHAPTER // 04 · PRIVATE ENTERTAINING &amp; BUYOUTS</span>
            </div>

            <h2
              className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}
            >
              Your Next Event,<br />
              <span className="gold-gradient-text-bright">Elevated Above Midtown</span>
            </h2>

            <p className="mt-4 text-zinc-100 font-sans text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
              Boardroom views, not boardrooms. Reset HTX delivers an architectural rooftop haven for high-profile corporate receptions, milestone galas, brand launches, and complete dual-level private buyouts.
            </p>
          </div>

          {/* Action CTAs in Header */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsInquireModalOpen(true)}
              className="btn-gold-shimmer inline-flex items-center gap-2 py-3.5 px-7 rounded-full text-xs font-bold uppercase tracking-[0.2em] cursor-pointer"
            >
              <span>Quick Inquiry</span>
              <Calendar className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/private-events"
              className="inline-flex items-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] transition-all bg-black/60 shadow-lg"
            >
              <span>Full Event Specs</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          </div>
        </div>

        {/* --- 2. INTERACTIVE VENUE SPACES SHOWCASE --- */}
        <div className="mb-16">
          {/* Space Selection Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 custom-scrollbar mb-8">
            {VENUE_SPACES.map((space, idx) => (
              <button
                key={space.id}
                onClick={() => setActiveSpaceIndex(idx)}
                className={`flex items-center gap-3 px-5 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  activeSpaceIndex === idx
                    ? 'bg-[#D4AF37] text-black shadow-xl font-extrabold scale-[1.02]'
                    : 'text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/10 hover:border-[#D4AF37]/40'
                }`}
              >
                <span className="font-mono text-[11px] opacity-70">0{idx + 1}</span>
                <span>{space.name}</span>
                <span
                  className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${
                    activeSpaceIndex === idx
                      ? 'bg-black/20 text-black'
                      : 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {space.capacity}
                </span>
              </button>
            ))}
          </div>

          {/* Active Space Hero Card */}
          <div
            className="rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-500"
            style={{
              background: 'linear-gradient(145deg, rgba(14,14,18,0.96) 0%, rgba(8,8,10,0.98) 100%)',
              border: '1px solid rgba(212,175,55,0.35)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            {/* Top gold shimmer hairline */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              
              {/* Left Column: Photography & Visual Preview */}
              <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden group">
                <Image
                  src={activeSpace.image}
                  alt={activeSpace.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  style={{ filter: 'brightness(1.08) contrast(1.04) saturate(1.12)' }}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {/* Edge vignette & gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-[#0a0a0d]" />

                {/* Floating Top Badge */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E6BE] text-xs font-bold uppercase tracking-wider shadow-xl">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{activeSpace.badge}</span>
                </div>

                {/* Floating Bottom Quick Stat */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto flex items-center gap-3">
                  <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white shadow-xl">
                    <p className="text-[10px] font-mono text-[#E5C158] uppercase tracking-widest font-semibold">Total Area</p>
                    <p className="font-heading font-extrabold text-base sm:text-lg">{activeSpace.area}</p>
                  </div>
                  <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white shadow-xl">
                    <p className="text-[10px] font-mono text-[#E5C158] uppercase tracking-widest font-semibold">Capacity</p>
                    <p className="font-heading font-extrabold text-base sm:text-lg">{activeSpace.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Specs & Booking CTA */}
              <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5C158] font-bold">
                      // SPACE PROFILE 0{activeSpaceIndex + 1}
                    </span>
                    <span className="text-xs font-mono text-zinc-300 bg-white/10 px-2.5 py-1 rounded-full">
                      {activeSpace.seatedCapacity}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide mb-3">
                    {activeSpace.name}
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-zinc-100 font-normal leading-relaxed mb-6">
                    {activeSpace.description}
                  </p>

                  {/* Architectural Highlights */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <p className="text-xs font-mono uppercase tracking-widest text-[#E5C158] font-bold">
                      Included Amenities &amp; Infrastructure
                    </p>
                    <div className="space-y-2.5">
                      {activeSpace.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-100">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setIsInquireModalOpen(true)}
                    className="w-full sm:w-auto flex-1 btn-gold-shimmer inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] cursor-pointer"
                  >
                    <span>Inquire For This Space</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/private-events"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] transition-all bg-black/60 shadow-lg text-center"
                  >
                    <span>Floor Plans</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- 3. EVENT TYPES & STRATEGIC PILLARS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {EVENT_PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(14,14,18,0.94) 0%, rgba(8,8,10,0.98) 100%)',
                border: '1px solid rgba(212,175,55,0.25)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)'
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: 'rgba(212,175,55,0.15)',
                  border: '1px solid rgba(212,175,55,0.35)'
                }}
              >
                {p.icon}
              </div>
              <h4 className="font-heading text-base font-bold uppercase text-white tracking-wide mb-2 group-hover:text-[#D4AF37] transition-colors">
                {p.title}
              </h4>
              <p className="font-sans text-xs text-zinc-100 font-normal leading-relaxed">
                {p.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* --- 4. ARCHITECTURAL METRICS STRIP --- */}
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
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto">
            <div className="border-l-2 border-[#D4AF37]/50 pl-4">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">450</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#E5C158] uppercase">GUESTS</span>
              </div>
              <p className="text-xs text-zinc-100 font-sans font-medium">Standing Buyout Capacity</p>
            </div>

            <div className="border-l-2 border-[#D4AF37]/50 pl-4">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">4,500</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#E5C158] uppercase">SQ FT</span>
              </div>
              <p className="text-xs text-zinc-100 font-sans font-medium">Dual-Atmosphere Space</p>
            </div>

            <div className="border-l-2 border-[#D4AF37]/50 pl-4">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#E5C158] uppercase">CUSTOM</span>
              </div>
              <p className="text-xs text-zinc-100 font-sans font-medium">Chef Menus &amp; Mixology</p>
            </div>

            <div className="border-l-2 border-[#D4AF37]/50 pl-4">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">PRO</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#E5C158] uppercase">AV SYSTEM</span>
              </div>
              <p className="text-xs text-zinc-100 font-sans font-medium">Sound, DJ Booth &amp; Lighting</p>
            </div>
          </div>

          {/* Direct Event Team Contacts */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setIsInquireModalOpen(true)}
              className="w-full sm:w-auto btn-gold-shimmer inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em] cursor-pointer"
            >
              <span>Book An Event</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] transition-all bg-black/60 shadow-lg"
            >
              <span>Contact Concierge</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Inquiry Modal */}
      <InquireModal
        isOpen={isInquireModalOpen}
        onClose={() => setIsInquireModalOpen(false)}
      />
    </section>
  )
}
