'use client'

import Image from 'next/image'
import Link from 'next/link'
import { UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react'

const SIGNATURE_PAIRINGS = [
  {
    name: 'Steak Truffle Fries',
    price: '$18.99',
    category: 'Shareable Small Plate',
    description: 'Crispy truffle fries topped with tender sliced steak, house au poivre reduction, shaved parmesan, and garlic herb aioli.',
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566652399-menu-item.jpg',
  },
  {
    name: 'Soft Flour Chicken Tacos',
    price: '$19.99',
    category: 'Rooftop Bites',
    description: 'Seasoned grilled chicken, fresh garden lettuce, pico de gallo, diced tomatoes, sour cream, mixed cheese, and signature baja drizzle.',
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781565714148-menu-item.jpg',
  },
  {
    name: 'Smashed Double Cheeseburger',
    price: '$12.99',
    category: 'Late Night Indulgence',
    description: 'Double smashed beef patties, melted sharp cheddar, secret house burger sauce, dill pickles, and seasoned fries.',
    image: 'https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566927041-menu-item.jpg',
  },
]

export default function RooftopDiningSection() {
  return (
    <section className="py-28 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Culinary Craft & Cocktails
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white mb-6">
            Dine Above <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F0DEAA] to-[#D4AF37]">The Skyline</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-sans font-light">
            More than drinks above the city. Reset offers a chef-driven rooftop culinary journey designed for client dinners, sunset dates, and after-work cocktail pairings.
          </p>
        </div>

        {/* MAGAZINE EDITORIAL SPREAD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* LEFT: FEATURED HERO DISH (Lamb Chop Cajun Pasta) */}
          <div className="lg:col-span-6 group bg-zinc-950/80 border border-zinc-800/80 hover:border-[#D4AF37]/60 rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl">
            <div className="relative h-[360px] sm:h-[420px] w-full bg-black overflow-hidden">
              <Image
                src="https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/menu-1781566172315-menu-item.jpg"
                alt="Lamb Chop Cajun Pasta at Reset HTX"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Chef's Signature Dish
              </div>
              <div className="absolute bottom-5 right-5 text-2xl font-bold font-heading text-[#D4AF37] bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                $23.99
              </div>
            </div>

            <div className="p-8">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                Lamb Chop Cajun Pasta
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base font-sans leading-relaxed mb-6 font-light">
                Tender grilled herb lamb chops served over al dente pasta tossed with crisp bell peppers, savory turkey bacon, and a rich, house-made cajun cream reduction.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-zinc-400 uppercase tracking-widest font-sans">
                <span>Recommended Pairing: Smoked Old Fashioned</span>
                <span className="text-[#D4AF37] font-bold">House Favorite</span>
              </div>
            </div>
          </div>

          {/* RIGHT: CURATED TASTING LIST */}
          <div className="lg:col-span-6 space-y-4">
            {SIGNATURE_PAIRINGS.map((dish, i) => (
              <div
                key={i}
                className="group flex gap-5 p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-[#D4AF37]/50 transition-all duration-300 items-center shadow-md hover:shadow-[0_6px_25px_rgba(212,175,55,0.1)]"
              >
                {/* Dish Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Dish Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                      {dish.category}
                    </span>
                    <span className="font-heading font-bold text-white text-base">
                      {dish.price}
                    </span>
                  </div>

                  <h4 className="font-heading text-lg font-bold text-white mb-1.5 group-hover:text-[#D4AF37] transition-colors truncate">
                    {dish.name}
                  </h4>

                  <p className="text-zinc-400 text-xs font-sans line-clamp-2 leading-relaxed font-light">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}

            {/* QUICK CTA BOX */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 to-[#121215] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div>
                <p className="text-white font-heading text-lg font-bold">Explore Our Full Menu</p>
                <p className="text-zinc-400 text-xs font-sans">Craft cocktails, shareable small plates & premium spirits.</p>
              </div>
              <Link
                href="/menu"
                className="shrink-0 px-6 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                View Menu →
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(212,175,55,0.3)]"
          >
            Explore Dining & Cocktail Menu
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/reservations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-xs py-4 px-10 rounded-full transition-all"
          >
            Reserve Table
          </Link>
        </div>

      </div>
    </section>
  )
}
