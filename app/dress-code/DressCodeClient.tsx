'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shirt,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  IdCard,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react'

export default function DressCodeClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'encouraged' | 'prohibited'>('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const encouragedLadies = [
    'Cocktail dresses, elegant evening dresses, and chic jumpsuits',
    'Fashion-forward matching sets, tailored separates, and elevated blouses',
    'Tailored trousers, dark premium denim, and stylish evening skirts',
    'Heels, dress sandals, stylish ankle boots, or upscale designer footwear',
    'Refined evening accessories and jewelry'
  ]

  const encouragedGentlemen = [
    'Collared shirts, tailored button-downs, polo shirts, and luxury knits',
    'Sport coats, tailored blazers, and structured outerwear',
    'Tailored slacks, fitted chinos, and clean dark-wash fitted denim (no heavy tears)',
    'Loafers, Chelsea boots, dress oxfords, and clean upscale designer sneakers',
    'Well-groomed, fashion-forward evening presentations'
  ]

  const prohibitedItems = [
    {
      title: 'Athletic & Gym Apparel',
      desc: 'Sweatpants, athletic joggers, gym shorts, spandex, tracksuits, or workout compression gear.'
    },
    {
      title: 'Sports Jerseys & Team Apparel',
      desc: 'Sports jerseys (NFL, NBA, MLB, soccer), team warm-up gear, or branded athletic apparel.'
    },
    {
      title: 'Casual & Pool Footwear',
      desc: 'Rubber flip-flops, foam slides, pool slippers, shower sandals, or foam clogs (Crocs).'
    },
    {
      title: 'Excessively Baggy or Sagging Clothing',
      desc: 'Oversized sagging pants, excessively distressed or shredded denim that falls below hips.'
    },
    {
      title: 'Undershirts & Sleepwear',
      desc: 'Plain white undershirts, ribbed muscle tank tops, robes, or sleepwear.'
    },
    {
      title: 'Offensive Graphics or Inappropriate Attire',
      desc: 'Clothing displaying vulgarity, gang-related insignia, hate speech, or explicit graphics.'
    }
  ]

  const faqs = [
    {
      q: 'Are sneakers allowed at Reset HTX?',
      a: 'Yes, clean, upscale, fashion-forward designer and lifestyle sneakers are welcome. However, heavily worn, scuffed gym runners, running shoes, or athletic cleats are not permitted.'
    },
    {
      q: 'Can gentlemen wear hats or caps?',
      a: 'Fashion-forward headwear (such as stylish fedoras or clean fitted caps worn forward) is generally accepted. Backwards athletic caps, skull caps, or durags are not permitted during nightlife hours.'
    },
    {
      q: 'Are shorts permitted during the day or Happy Hour?',
      a: 'During Wednesday–Friday Happy Hour (4 PM – 8 PM) and Saturday/Sunday daytime, neat, tailored dress shorts paired with a collared shirt and stylish shoes are permitted. For late-night nightlife (after 9 PM), gentlemen are required to wear trousers or dark denim.'
    },
    {
      q: 'What if someone in my party does not meet the dress code?',
      a: 'Admittance is evaluated on an individual basis. Even with an advance table reservation or ticket, all guests must satisfy the dress code to enter. We strongly recommend communicating the policy to all guests in advance.'
    },
    {
      q: 'Who has final say on dress code compliance?',
      a: 'The door host and management team have full and final discretion over entry and dress code adherence. Our goal is to ensure an elevated, memorable experience for all guests.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#D4AF37]/20">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#D4AF37]/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]"
            style={{
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.35)',
              color: '#D4AF37',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>THE RESET HTX PROTOCOL</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
            Dress Code &amp; <br />
            <span className="gold-gradient-text">Guest Standards</span>
          </h1>

          <p className="font-sans text-zinc-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Reset HTX is Midtown Houston&apos;s premier rooftop lounge. We celebrate personal expression and curate an upscale, high-energy atmosphere where fashion-forward elegance is strictly honored.
          </p>

          {/* Quick Pillars */}
          <div className="pt-2 flex flex-wrap justify-center items-center gap-3 text-xs font-mono uppercase tracking-wider text-zinc-300">
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37]">
              ✦ Standard: Upscale Chic
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              ✦ Physical 21+ ID Required
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              ✦ Strict Door Discretion
            </span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOGGLE FILTER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-zinc-950 p-1.5 border border-[#D4AF37]/30 shadow-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 sm:px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'btn-gold-shimmer text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Guidelines
            </button>
            <button
              onClick={() => setActiveTab('encouraged')}
              className={`px-5 sm:px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all cursor-pointer ${
                activeTab === 'encouraged'
                  ? 'bg-[#D4AF37] text-black font-extrabold shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Encouraged Attire
            </button>
            <button
              onClick={() => setActiveTab('prohibited')}
              className={`px-5 sm:px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all cursor-pointer ${
                activeTab === 'prohibited'
                  ? 'bg-red-950 text-red-200 border border-red-800/60 shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Prohibited Items
            </button>
          </div>
        </div>

        {/* GUIDELINE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ENCOURAGED ATTIRE CARD */}
          {(activeTab === 'all' || activeTab === 'encouraged') && (
            <div
              className="rounded-3xl p-7 sm:p-9 relative overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, rgba(20,20,24,0.9) 0%, rgba(10,10,12,0.95) 100%)',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              {/* Gold Shimmer Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">STANDARDS OF EXCELLENCE</span>
                    <h2 className="font-heading text-2xl font-bold uppercase text-white">What We Encourage</h2>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
                  Fashion Forward
                </span>
              </div>

              <p className="text-zinc-300 text-sm font-sans mb-7 font-light leading-relaxed">
                We invite all guests to dress to impress. Upscale chic attire enhances the ambiance and elevates the collective experience.
              </p>

              <div className="space-y-6">
                {/* Ladies */}
                <div>
                  <h3 className="font-heading text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                    For Ladies
                  </h3>
                  <ul className="space-y-2.5">
                    {encouragedLadies.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-200 font-light">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <h3 className="font-heading text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                    For Gentlemen
                  </h3>
                  <ul className="space-y-2.5">
                    {encouragedGentlemen.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-200 font-light">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PROHIBITED ATTIRE CARD */}
          {(activeTab === 'all' || activeTab === 'prohibited') && (
            <div
              className={`rounded-3xl p-7 sm:p-9 relative overflow-hidden transition-all duration-300 ${
                activeTab === 'prohibited' ? 'lg:col-span-2 max-w-4xl mx-auto' : ''
              }`}
              style={{
                background: 'linear-gradient(145deg, rgba(24,14,14,0.9) 0%, rgba(12,8,8,0.95) 100%)',
                border: '1px solid rgba(220,38,38,0.3)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              {/* Red Shimmer Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-700/50 flex items-center justify-center text-red-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-red-400">RESTRICTED ITEMS</span>
                    <h2 className="font-heading text-2xl font-bold uppercase text-white">What Is Prohibited</h2>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-red-950/80 border border-red-800/60 text-red-300">
                  Strictly Enforced
                </span>
              </div>

              <p className="text-zinc-300 text-sm font-sans mb-7 font-light leading-relaxed">
                The following apparel is strictly non-compliant with our evening standards. Guests wearing prohibited items will be respectfully declined entry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prohibitedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-black/40 border border-red-900/30 flex items-start gap-3"
                  >
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-snug font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 pt-5 border-t border-red-900/30 flex items-center gap-3 text-zinc-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Entry denial due to dress code non-compliance is not eligible for refund.</span>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* DAY VS NIGHT COMPARISON MATRIX */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            TIMING &amp; ATMOSPHERE
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white">
            Daytime vs. <span className="gold-gradient-text">Nightlife Standards</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daytime / Happy Hour */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0a0c] border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">WED–FRI 4PM–8PM · SAT–SUN AFTERNOON</span>
                <h3 className="font-heading text-xl font-bold uppercase text-white">Rooftop Lounge &amp; Sunset</h3>
              </div>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed font-light mb-5">
              During golden hour and afternoon hours, elevated rooftop resort-chic attire is welcomed. Clean, tailored dress shorts paired with a collared shirt or polo are permitted for gentlemen. Stylish sundresses, rompers, and upscale daytime sets for ladies.
            </p>
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 text-xs text-zinc-400 font-sans">
              <strong className="text-white font-medium">Permitted:</strong> Tailored dress shorts, stylish loafers, resort-chic rooftop apparel.
            </div>
          </div>

          {/* Nightlife & Sound Residencies */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0a0c] border border-[#D4AF37]/30 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">WED–SUN 9PM–2AM</span>
                <h3 className="font-heading text-xl font-bold uppercase text-white">Nightlife &amp; Sound Residencies</h3>
              </div>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed font-light mb-5">
              As darkness falls, our atmosphere transitions to high-energy nightlife. Full upscale chic guidelines apply. Gentlemen are required to wear trousers, tailored chinos, or clean dark denim. Cocktail attire and glamorous evening sets are strongly encouraged.
            </p>
            <div className="p-3.5 rounded-xl bg-black/50 border border-[#D4AF37]/20 text-xs text-zinc-300 font-sans">
              <strong className="text-[#D4AF37] font-medium">Required:</strong> Full-length trousers or dark denim for men; high-energy chic evening fashion.
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSION & IDENTIFICATION PROTOCOL */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#0e0e12] to-zinc-950 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest">
              <IdCard className="w-3.5 h-3.5" />
              <span>ENTRY REQUIREMENT</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-white">
              Strict 21+ Age Standard &amp; Physical ID Verification
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light font-sans">
              Reset HTX operates as an exclusive 21+ adult venue. All patrons must present a valid, unexpired, government-issued physical identification upon arrival (Driver&apos;s License, State ID card, or Passport). Digital ID photographs or paper copies are not accepted under Texas TABC regulations.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            DRESS CODE CLARIFICATIONS
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-zinc-950/70 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-heading text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full border border-white/15 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 border-[#D4AF37] text-[#D4AF37]' : 'text-zinc-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed border-t border-white/5 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* BOTTOM CTA: TABLE RESERVATION & INQUIRY */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white">
            Planning Your <span className="gold-gradient-text">Experience?</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed font-light">
            Reserve a VIP booth or browse our upcoming weekly sound residencies and chef-curated menus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reservations"
              className="w-full sm:w-auto btn-gold-shimmer py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
            >
              Reserve a Table
            </Link>
            <Link
              href="/events"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#D4AF37] border border-white/15 hover:border-[#D4AF37] transition-all"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
