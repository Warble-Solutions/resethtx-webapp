'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Utensils, Wine, Clock, Flame, ChevronRight } from 'lucide-react'

interface CulinaryItem {
  id: string
  name: string
  price: string
  category: string
  type: 'dish' | 'cocktail'
  tag: string
  description: string
  tastingNotes: string[]
  image: string
}

const CULINARY_SELECTIONS: CulinaryItem[] = [
  {
    id: 'lamb-pasta',
    name: 'Lamb Chop Cajun Pasta',
    price: '$23.99',
    category: 'Chef Signature',
    type: 'dish',
    tag: "CHEF'S CULINARY MASTERPIECE",
    description: 'Tender herb-crusted lamb chops seared to perfection over al dente fettuccine, bathed in a rich velvet Cajun cream reduction with blistered cherry tomatoes.',
    tastingNotes: ['Herb Lamb Chops', 'Cajun Cream', 'Shaved Pecorino'],
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566172315-menu-item.jpg',
  },
  {
    id: 'truffle-fries',
    name: 'Steak Truffle Fries',
    price: '$18.99',
    category: 'Shareable Luxury',
    type: 'dish',
    tag: 'ROOFTOP FAVORITE',
    description: 'Crisp golden truffle fries topped with tender sliced prime steak, house au poivre glaze, aged shaved parmesan, and garlic herb aioli.',
    tastingNotes: ['Prime Sliced Steak', 'Black Truffle Oil', 'House Au Poivre'],
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566652399-menu-item.jpg',
  },
  {
    id: 'chicken-tacos',
    name: 'Soft Flour Chicken Tacos',
    price: '$19.99',
    category: 'Rooftop Bites',
    type: 'dish',
    tag: 'SUNSET PAIRING',
    description: 'Flame-seasoned grilled chicken, crisp garden greens, scratch pico de gallo, lime crema, Monterey jack, and signature house baja drizzle.',
    tastingNotes: ['Charred Chicken', 'Baja Drizzle', 'Pico de Gallo'],
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781565714148-menu-item.jpg',
  },
  {
    id: 'double-burger',
    name: 'Smashed Double Wagyu Burger',
    price: '$12.99',
    category: 'Late Night Indulgence',
    type: 'dish',
    tag: 'LATE NIGHT ICON',
    description: 'Double smashed beef patties seared crispy, melted sharp Wisconsin cheddar, secret house burger remoulade, dill pickles, and seasoned fries.',
    tastingNotes: ['Double Smashed Patties', 'Secret House Sauce', 'Brioche Bun'],
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566927041-menu-item.jpg',
  },
  {
    id: 'craft-mixology',
    name: 'Artisanal Smoked Old Fashioned',
    price: '$17.00',
    category: 'Signature Mixology',
    type: 'cocktail',
    tag: 'TABLESIDE RITUAL',
    description: 'Reserve small-batch bourbon, aromatic Angostura and blood orange bitters, demerara sugar, and charred cedar smoke infusion over crystal ice.',
    tastingNotes: ['Reserve Bourbon', 'Smoked Cedar', 'Orange Peel Oils'],
    image: '/images/12.png',
  }
]

export default function RooftopDiningSection() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'dish' | 'cocktail'>('all')
  const [activeItem, setActiveItem] = useState<CulinaryItem>(CULINARY_SELECTIONS[0])

  const filteredItems = CULINARY_SELECTIONS.filter(item => {
    if (selectedFilter === 'all') return true
    return item.type === selectedFilter
  })

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[#070709] border-t border-[#D4AF37]/20">
      {/* Ambient luxury lighting halos to brighten the space */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-[#D4AF37]/8 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[450px] bg-[#D4AF37]/6 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- 1. EDITORIAL HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4"
              style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.35)',
                color: '#D4AF37',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>CULINARY SPOTLIGHT · HAUTE ROOFTOP DINING</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.08]">
              Dine Above <span className="gold-gradient-text">The Skyline</span>
            </h2>

            <p className="mt-3 text-zinc-300 font-sans text-sm sm:text-base font-light leading-relaxed">
              Chef-driven elevated plates, Cajun-infused prime selections, and tableside craft mixology paired with panoramic views of Downtown Houston.
            </p>
          </div>

          {/* Quick Filter Pills & Full Menu Link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full bg-zinc-950 p-1 border border-white/10 shadow-lg">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === 'all' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Highlights
              </button>
              <button
                onClick={() => setSelectedFilter('dish')}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === 'dish' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Kitchen
              </button>
              <button
                onClick={() => setSelectedFilter('cocktail')}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === 'cocktail' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Mixology
              </button>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37] hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all bg-black/40"
            >
              <span>Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* --- 2. EDITORIAL FEATURED SPREAD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* LEFT: HAUTE FEATURE HERO (7 Columns) */}
          <div
            className="lg:col-span-7 rounded-3xl overflow-hidden relative group flex flex-col justify-between transition-all duration-500"
            style={{
              background: 'linear-gradient(145deg, rgba(20,20,24,0.92) 0%, rgba(10,10,12,0.98) 100%)',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
            }}
          >
            {/* Top gold hairline shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-20" />

            {/* Hero Image Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black/50">
              <Image
                src={activeItem.image}
                alt={activeItem.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ filter: 'brightness(1.1) contrast(1.02) saturate(1.1)' }}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {/* Minimal gradient at base of image */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 40%)' }} />

              {/* Luxury Badge Top Left */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-xl"
                style={{
                  background: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(212,175,55,0.45)',
                  color: '#D4AF37',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>{activeItem.tag}</span>
              </div>

              {/* Price Pill Top Right */}
              <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-heading font-black tracking-wider shadow-xl"
                style={{
                  background: 'rgba(212,175,55,0.95)',
                  color: '#000000',
                  boxShadow: '0 0 20px rgba(212,175,55,0.4)'
                }}
              >
                {activeItem.price}
              </div>
            </div>

            {/* Description & Taste Notes */}
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-semibold">
                    {activeItem.category}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    {activeItem.type === 'dish' ? 'Scratch Kitchen' : 'Artisan Bar'}
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight mb-3">
                  {activeItem.name}
                </h3>

                <p className="font-sans text-zinc-200 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {activeItem.description}
                </p>
              </div>

              {/* Tasting Notes & Action */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {activeItem.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-[#D4AF37]/25 text-zinc-300"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>

                <Link
                  href="/reservations"
                  className="btn-gold-shimmer inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] shrink-0"
                >
                  <span>Taste This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE CULINARY LIST (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 justify-between">
            {filteredItems.map((item) => {
              const isSelected = activeItem.id === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-4 sm:p-4.5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center gap-4 group relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-zinc-900 to-[#16161c] border border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(212,175,55,0.15)] scale-[1.01]'
                      : 'bg-zinc-950/70 border border-white/10 hover:border-[#D4AF37]/35 hover:bg-zinc-900/60'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]" />
                  )}

                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ filter: 'brightness(1.1) contrast(1.02)' }}
                      sizes="90px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold truncate">
                        {item.category}
                      </span>
                      <span className="font-heading font-black text-[#D4AF37] text-sm shrink-0">
                        {item.price}
                      </span>
                    </div>

                    <h4 className={`font-heading text-sm sm:text-base font-bold uppercase transition-colors truncate ${
                      isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                    }`}>
                      {item.name}
                    </h4>

                    <p className="text-[11px] text-zinc-400 font-sans font-light line-clamp-1 mt-0.5">
                      {item.description}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 group-hover:text-[#D4AF37] transition-colors">
                      <span>View pairing details</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* --- 3. CULINARY PILLARS BAR --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-[#D4AF37]/20 mb-12">
          {[
            {
              icon: <Wine className="w-5 h-5 text-[#D4AF37]" />,
              title: "Craft Cocktail Mixology",
              desc: "Artisanal smoked infusions, agave selections, and bespoke tableside presentations."
            },
            {
              icon: <Flame className="w-5 h-5 text-[#D4AF37]" />,
              title: "Scratch Cajun Kitchen",
              desc: "From prime sliced steak to Cajun lamb chops and late-night smashed sliders."
            },
            {
              icon: <Clock className="w-5 h-5 text-[#D4AF37]" />,
              title: "Late-Night Dining Service",
              desc: "Full kitchen menu available late every Wednesday through Sunday evening."
            }
          ].map((pillar, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-zinc-950/60 border border-white/10 flex items-start gap-4 hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                {pillar.icon}
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold uppercase text-white tracking-wider mb-1">
                  {pillar.title}
                </h4>
                <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- 4. BOTTOM CTAS --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            href="/reservations"
            className="w-full sm:w-auto btn-gold-shimmer py-3.5 px-9 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            Reserve Dining Table
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] border border-white/15 hover:border-[#D4AF37] transition-all bg-black/40"
          >
            Explore Complete Menu &amp; Spirits
          </Link>
        </div>

      </div>
    </section>
  )
}
