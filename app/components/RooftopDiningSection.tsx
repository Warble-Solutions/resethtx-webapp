'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const SIGNATURE_PAIRINGS = [
  {
    name: 'Steak Truffle Fries',
    price: '$18.99',
    category: 'Shareable',
    description: 'Crispy truffle fries topped with tender sliced steak, house au poivre, shaved parmesan, and garlic herb aioli.',
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566652399-menu-item.jpg',
  },
  {
    name: 'Soft Flour Chicken Tacos',
    price: '$19.99',
    category: 'Rooftop Bites',
    description: 'Seasoned grilled chicken, fresh garden lettuce, pico de gallo, sour cream, mixed cheese, and signature baja drizzle.',
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781565714148-menu-item.jpg',
  },
  {
    name: 'Smashed Double Cheeseburger',
    price: '$12.99',
    category: 'Late Night',
    description: 'Double smashed beef patties, melted sharp cheddar, secret house burger sauce, dill pickles, and seasoned fries.',
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566927041-menu-item.jpg',
  },
]

export default function RooftopDiningSection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: '#070709' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header — left aligned, compact */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
              CHAPTER // 04
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white">
              Dine Above <span className="gold-gradient-text">The Skyline</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors group"
          >
            <span>Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-10">
          {/* HERO DISH — spans 2 columns on desktop */}
          <div className="lg:col-span-2 lg:row-span-2 group rounded-2xl overflow-hidden relative"
            style={{ background: 'rgba(10,10,12,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full overflow-hidden">
              <Image
                src="https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566172315-menu-item.jpg"
                alt="Lamb Chop Cajun Pasta"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)' }} />

              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', backdropFilter: 'blur(8px)' }}>
                <Sparkles className="w-3 h-3" />
                Chef&apos;s Signature
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">Signature Entrée</p>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">Lamb Chop Cajun Pasta</h3>
                    <p className="text-zinc-300 text-xs font-sans mt-1 font-light max-w-sm">Tender herb lamb chops over al dente pasta with cajun cream reduction.</p>
                  </div>
                  <span className="font-heading text-xl font-bold text-[#D4AF37] shrink-0 ml-4"
                    style={{ background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)' }}>
                    $23.99
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Side dishes */}
          {SIGNATURE_PAIRINGS.map((dish, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden flex flex-row lg:flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(10,10,12,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="relative w-28 sm:w-32 lg:w-full aspect-square lg:aspect-[4/3] shrink-0 overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'brightness(1.05) contrast(1.05)' }}
                  sizes="(max-width: 1024px) 128px, 25vw"
                />
                <div className="absolute inset-0 lg:block hidden" style={{ background: 'linear-gradient(to top, rgba(10,10,12,0.8) 0%, transparent 50%)' }} />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37]">{dish.category}</span>
                    <span className="font-heading font-bold text-[#D4AF37] text-sm">{dish.price}</span>
                  </div>
                  <h4 className="font-heading text-sm font-bold text-white uppercase group-hover:text-[#D4AF37] transition-colors truncate">{dish.name}</h4>
                  <p className="text-zinc-400 text-[11px] font-sans leading-relaxed line-clamp-2 font-light mt-1">{dish.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/menu"
            className="btn-gold-shimmer inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] py-3 px-8 rounded-full"
          >
            <span>Explore Dining &amp; Cocktails</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/reservations"
            className="text-white font-bold uppercase tracking-[0.18em] text-[11px] py-3 px-8 rounded-full transition-all hover:text-[#D4AF37]"
            style={{ background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Reserve Table
          </Link>
        </div>
      </div>
    </section>
  )
}
