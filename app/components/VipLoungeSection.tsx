'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Crown,
  Sparkles,
  Flame,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  Calendar,
  Wine,
  Phone,
  Clock,
  Zap,
  Users
} from 'lucide-react'
import { useInquire } from '../context/InquireContext'

const VIP_SECTIONS = [
  {
    suite: "01",
    name: "Skyline Terrace Banquette",
    tagline: "Panoramic Open-Air Vistas",
    capacity: "8–12 Guests",
    minSpend: "From $275 Min · $200 Sundays",
    image: "/images/14.png",
    popular: false,
    description: "Perched along the open-air terrace with dramatic vistas of Downtown Houston. Includes modular leather seating and motorized climate canopy.",
    perks: [
      "Unobstructed Houston skyline views",
      "Dedicated cocktail server & table host",
      "Expedited VIP entrance for table party",
      "Unlimited artisan mixers & fresh garnishes"
    ],
    actionText: "Reserve Terrace",
    href: "/reservations"
  },
  {
    suite: "02",
    name: "Center-Stage DJ Banquette",
    tagline: "Prime Sound & Front-Row Energy",
    capacity: "8–10 Guests",
    minSpend: "1-Bottle Min · Prime Sightlines",
    image: "/images/16.png",
    popular: true,
    badge: "MOST COVETED",
    description: "Directly in front of the headline DJ booth in our interior climate-controlled salon. Plush velvet seating, high-energy crowd flow, and theatrical bottle deliveries.",
    perks: [
      "Front-row sightlines to guest headliner DJs",
      "Intimate climate-controlled interior salon",
      "Theatrical sparkler bottle delivery ritual",
      "Complimentary coat & belongings oversight"
    ],
    actionText: "Reserve DJ Section",
    href: "/reservations"
  },
  {
    suite: "03",
    name: "Celebration & Birthday Suite",
    tagline: "Theatrical Sparkler Parade",
    capacity: "10–15 Guests",
    minSpend: "Custom Celebration Tier",
    image: "/images/event-1.png",
    popular: false,
    description: "The definitive Houston nightlife celebration. Complete with customized glowing LED letter board message, champagne sparkler train, and entourage priority escort.",
    perks: [
      "Custom LED message board presentation",
      "Multi-bottle sparkler parade by host team",
      "Guaranteed priority entry (zero door wait)",
      "Direct coordination with VIP concierge"
    ],
    actionText: "Book Celebration",
    href: "/contact"
  }
]

const VIP_JOURNEY = [
  {
    step: "01",
    title: "Expedited Arrival",
    desc: "Skip the general admission door line with instant check-in escorted by our VIP concierge liaison."
  },
  {
    step: "02",
    title: "Dedicated Section",
    desc: "Arrive at your reserved skyline banquette or DJ booth with fresh ice, glassware, and mixers prepared."
  },
  {
    step: "03",
    title: "The Sparkler Ritual",
    desc: "Theatrical champagne delivery featuring champagne sparklers, customized LED signage, and fanfare."
  },
  {
    step: "04",
    title: "All-Night Concierge",
    desc: "Your dedicated table captain caters drink refills, ice replenishment, and security oversight all evening."
  }
]

const PRESTIGE_BOTTLES = [
  { name: "Don Julio 1942", category: "Ultra Tequila", note: "Signature Reserve" },
  { name: "Clase Azul Reposado", category: "Artisanal Agave", note: "Bell Decanter" },
  { name: "Dom Pérignon Vintage", category: "Prestige Champagne", note: "Chilled Flutes" },
  { name: "Hennessy XO", category: "Rare Cognac", note: "Tableside Pour" },
  { name: "Veuve Clicquot Brut", category: "Champagne", note: "Celebration Classic" },
  { name: "Casamigos Reposado", category: "Highland Tequila", note: "Crowd Favorite" }
]

export default function VipLoungeSection() {
  const { openInquiry } = useInquire()

  return (
    <section className="relative overflow-hidden bg-[#040406] py-24 sm:py-32 border-t border-[#D4AF37]/20">
      {/* Dynamic ambient gold & magenta nightlife glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-[#D4AF37]/7 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[350px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- 1. EDITORIAL HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4"
            style={{
              background: 'rgba(0,0,0,0.65)',
              border: '1px solid rgba(212,175,55,0.45)',
              color: '#F5E6BE',
              backdropFilter: 'blur(12px)'
            }}
          >
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-mono text-[#E5C158]">CHAPTER // 05 · VIP BOTTLE CONCIERGE</span>
          </div>

          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}
          >
            Elevate Your Evening,<br />
            <span className="gold-gradient-text-bright">Reserve The Skyline</span>
          </h2>

          <p className="mt-4 text-zinc-100 font-sans text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Theatrical sparkler rituals, panoramic skyline vistas, and white-glove table service. Choose your table section below for an uncompromised Midtown Houston nightlife experience.
          </p>
        </div>

        {/* --- 2. 3-COLUMN VIP TABLE SHOWCASE (CENTER ELEVATED) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-20">
          {VIP_SECTIONS.map((sec, idx) => (
            <div
              key={idx}
              className={`rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 relative group ${
                sec.popular
                  ? 'lg:-translate-y-4 shadow-[0_20px_50px_rgba(212,175,55,0.2)]'
                  : 'hover:-translate-y-2 shadow-2xl'
              }`}
              style={{
                background: sec.popular
                  ? 'linear-gradient(155deg, rgba(20,20,26,0.98) 0%, rgba(10,10,14,0.99) 100%)'
                  : 'linear-gradient(145deg, rgba(14,14,18,0.95) 0%, rgba(7,7,9,0.98) 100%)',
                border: sec.popular
                  ? '2px solid rgba(212,175,55,0.6)'
                  : '1px solid rgba(212,175,55,0.25)',
                backdropFilter: 'blur(30px)'
              }}
            >
              {/* Gold Top Hairline */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2.5px] ${
                  sec.popular
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#FFF0C2] to-[#D4AF37]'
                    : 'bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent group-hover:via-[#D4AF37]'
                }`}
              />

              {/* Top Banner Ribbon for Popular Suite */}
              {sec.popular && (
                <div className="bg-gradient-to-r from-[#D4AF37] via-[#F3D368] to-[#D4AF37] text-black text-center py-1.5 px-4 text-[10px] font-mono font-black uppercase tracking-[0.25em] shadow-lg flex items-center justify-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  <span>{sec.badge}</span>
                </div>
              )}

              {/* Card Photo Banner */}
              <div className="relative h-60 sm:h-64 w-full overflow-hidden">
                <Image
                  src={sec.image}
                  alt={sec.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ filter: 'brightness(1.08) contrast(1.03) saturate(1.1)' }}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/30 to-transparent" />

                {/* Floating Suite Number Pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#E5C158] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span>SUITE // {sec.suite}</span>
                </div>

                {/* Floating Capacity Pill */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-zinc-200 text-[10px] font-mono font-semibold">
                  <Users className="w-3 h-3 text-[#D4AF37]" />
                  <span>{sec.capacity}</span>
                </div>

                {/* Bottom Photo Callout */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C158] font-bold">
                    {sec.tagline}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {sec.name}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-zinc-200 font-normal leading-relaxed mb-4">
                    {sec.description}
                  </p>

                  {/* Pricing Badge */}
                  <div
                    className="p-3 rounded-xl mb-5 flex items-center justify-between"
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(212,175,55,0.25)'
                    }}
                  >
                    <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Requirement</span>
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-[#F5E6BE]">{sec.minSpend}</span>
                  </div>

                  {/* Included Table Perks */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {sec.perks.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-200">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-5 border-t border-white/10">
                  {sec.actionText === 'Book Celebration' ? (
                    <button
                      onClick={() => openInquiry()}
                      className="w-full btn-gold-shimmer py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{sec.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={sec.href}
                      className={`w-full py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 transition-all ${
                        sec.popular
                          ? 'btn-gold-shimmer shadow-lg'
                          : 'bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/15 hover:border-[#D4AF37]'
                      }`}
                    >
                      <span>{sec.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- 3. THE VIP EXPERIENCE TIMELINE RIBBON --- */}
        <div
          className="p-8 sm:p-10 rounded-3xl mb-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14,14,18,0.95) 0%, rgba(8,8,10,0.98) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E5C158] font-bold block mb-1">
                WHITE-GLOVE HOSPITALITY STANDARD
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                Your Night As A VIP Table Guest
              </h3>
            </div>
            <Link
              href="/dress-code"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors"
            >
              <span>View Arrival Dress Code Standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {VIP_JOURNEY.map((j, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="font-heading font-black text-2xl text-[#D4AF37]/50">
                    {j.step}
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                </div>
                <h4 className="font-heading text-base font-bold uppercase text-white mb-1.5">
                  {j.title}
                </h4>
                <p className="font-sans text-xs text-zinc-300 font-normal leading-relaxed">
                  {j.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. PRESTIGE BOTTLE VAULT HIGHLIGHTS STRIP --- */}
        <div
          className="p-7 sm:p-9 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{
            background: 'linear-gradient(145deg, rgba(16,16,22,0.95) 0%, rgba(9,9,12,0.98) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.75)'
          }}
        >
          <div className="w-full lg:max-w-xs shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E5C158] font-bold block mb-1">
              CURATED SPIRITS &amp; CELLAR
            </span>
            <h4 className="font-heading text-xl font-bold uppercase text-white mb-2">
              Reserve Bottle Vault
            </h4>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Rare tequilas, vintage champagnes, and reserve cognacs served tableside with high-fidelity ice presentation.
            </p>
          </div>

          {/* Marquee of Bottles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {PRESTIGE_BOTTLES.map((b, bIdx) => (
              <div
                key={bIdx}
                className="p-3.5 rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <p className="text-[10px] font-mono uppercase text-[#E5C158] font-semibold">{b.category}</p>
                <p className="font-heading text-sm font-bold text-white uppercase truncate">{b.name}</p>
                <p className="text-[10px] text-zinc-400 font-sans mt-0.5">{b.note}</p>
              </div>
            ))}
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/reservations"
              className="btn-gold-shimmer py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center"
            >
              <span>Book Table</span>
            </Link>
            <Link
              href="/menu"
              className="py-3 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center text-white hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] transition-all bg-black/60"
            >
              <span>Full Bottle Menu</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
