'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Crown, Sparkles, Shield, ArrowRight } from 'lucide-react'
import { useInquire } from '../context/InquireContext'

export default function VipLoungeSection() {
  const { openInquiry } = useInquire()

  const VIP_TIERS = [
    {
      title: "Skyline Booth Reservations",
      desc: "Prime elevated seating with direct panoramic downtown Houston views. Dedicated VIP host, expedited entry, and complimentary mixers.",
      icon: <Crown className="w-5 h-5 text-[#D4AF37]" />,
      actionText: "Reserve Booth",
      actionType: "link",
      href: "/reservations",
      image: "/images/event-1.jpg"
    },
    {
      title: "Milestone & Birthday Celebrations",
      desc: "Custom personalized bottle presentations, celebratory sparkler service, and dedicated sectional seating for your entire entourage.",
      icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
      actionText: "Plan Celebration",
      actionType: "inquire",
      href: "/contact",
      image: "/images/dancing.jpeg"
    },
    {
      title: "Corporate Buyouts & Entertaining",
      desc: "Impress prospective clients and treat your executive team. Custom open bar packages, passed hors d'oeuvres, and AV support.",
      icon: <Shield className="w-5 h-5 text-[#D4AF37]" />,
      actionText: "Inquire Buyouts",
      actionType: "inquire",
      href: "/private-events",
      image: "/private_page/4.jpg"
    }
  ]

  return (
    <section className="py-28 bg-[#070709] border-t border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] mb-4">
              <Crown className="w-3.5 h-3.5" />
              Table Concierge & Bottle Service
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-white leading-tight">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F0DEAA] to-[#D4AF37]">Evening</span>
            </h2>
          </div>

          <Link
            href="/reservations"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors group"
          >
            <span>Explore Bottle Service Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 VIP TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIP_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="group rounded-3xl bg-zinc-950/70 border border-zinc-800/80 hover:border-[#D4AF37]/60 overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                <Image
                  src={tier.image}
                  alt={tier.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  {tier.icon}
                </div>
              </div>

              <div className="p-8 pt-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {tier.title}
                  </h3>
                  <p className="font-sans text-zinc-400 text-sm leading-relaxed mb-6 font-light">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  {tier.actionType === 'inquire' ? (
                    <button
                      onClick={() => openInquiry()}
                      className="w-full py-3.5 bg-zinc-900 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer"
                    >
                      {tier.actionText}
                    </button>
                  ) : (
                    <Link
                      href={tier.href}
                      className="w-full inline-block text-center py-3.5 bg-zinc-900 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all border border-white/10 hover:border-[#D4AF37]"
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
