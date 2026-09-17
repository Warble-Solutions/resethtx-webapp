'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Crown, Sparkles, Shield, ArrowRight, Star } from 'lucide-react'
import { useInquire } from '../context/InquireContext'

export default function VipLoungeSection() {
  const { openInquiry } = useInquire()

  const VIP_TIERS = [
    {
      code: "01",
      title: "Skyline Booth Reservations",
      desc: "Prime elevated seating with panoramic downtown Houston views. Dedicated VIP host, expedited entry, and premium mixers.",
      features: ["Dedicated Table Host", "Expedited Line Privileges", "Premium Artisanal Mixers"],
      icon: <Crown className="w-4 h-4" />,
      actionText: "Reserve Booth",
      actionType: "link",
      href: "/reservations",
      image: "/images/14.png"
    },
    {
      code: "02",
      title: "Milestone & Birthday Galas",
      desc: "Custom bottle presentations, champagne sparkler rituals, and dedicated sectional seating for your entourage.",
      features: ["Custom Sparkler Presentation", "Dedicated Lounge Sectional", "Bespoke Congratulatory Display"],
      icon: <Sparkles className="w-4 h-4" />,
      actionText: "Plan Celebration",
      actionType: "inquire",
      href: "/contact",
      image: "/images/event-1.png"
    },
    {
      code: "03",
      title: "Executive Entertaining",
      desc: "Full-venue exclusivity with customizable bar tiers, passed culinary pairings, and high-fidelity AV systems.",
      features: ["Full AV & Screen Integration", "Executive Culinary Catering", "Private Bartender Service"],
      icon: <Shield className="w-4 h-4" />,
      actionText: "Inquire Buyouts",
      actionType: "inquire",
      href: "/private-events",
      image: "/images/11.png"
    }
  ]

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
              CHAPTER // 06
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white">
              Elevate Your <span className="gold-gradient-text">Evening</span>
            </h2>
            <p className="mt-2 text-zinc-400 font-sans text-sm max-w-lg font-light leading-relaxed">
              Skyline seating, theatrical bottle rituals, and dedicated concierge hospitality.
            </p>
          </div>
          <Link
            href="/reservations"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors group"
          >
            <span>Bottle Reserves</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {VIP_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              style={{ background: 'rgba(10,10,12,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Image */}
              <div className="relative h-56 sm:h-60 w-full overflow-hidden">
                <Image
                  src={tier.image}
                  alt={tier.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'brightness(1.05) contrast(1.05)' }}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 50%)' }} />

                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] tracking-[0.2em] font-mono font-bold uppercase"
                  style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', backdropFilter: 'blur(8px)' }}>
                  SUITE {tier.code}
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', backdropFilter: 'blur(8px)' }}>
                  {tier.icon}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors uppercase">
                    {tier.title}
                  </h3>
                  <p className="font-sans text-zinc-400 text-xs leading-relaxed mb-4 font-light">{tier.desc}</p>
                  <div className="space-y-1.5 mb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-zinc-300 font-sans">
                        <Star className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" style={{ fill: 'rgba(212,175,55,0.3)' }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  {tier.actionType === 'inquire' ? (
                    <button
                      onClick={() => openInquiry()}
                      className="btn-gold-shimmer w-full py-3 text-[11px] font-bold uppercase tracking-[0.18em] rounded-lg cursor-pointer text-center"
                    >
                      {tier.actionText}
                    </button>
                  ) : (
                    <Link
                      href={tier.href}
                      className="btn-gold-shimmer w-full inline-block text-center py-3 text-[11px] font-bold uppercase tracking-[0.18em] rounded-lg"
                    >
                      {tier.actionText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
