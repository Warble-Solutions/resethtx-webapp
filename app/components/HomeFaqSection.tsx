'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'

import { HOMEPAGE_FAQS } from '@/lib/schemas'

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-28 bg-[#050505] border-t border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            CHAPTER // 07 · THE PROTOCOL
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            Guest Dossier &amp; <span className="gold-gradient-text">FAQs</span>
          </h2>
          <p className="text-slate-400 font-sans text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Essential guidelines covering dress code, arrival logistics, table minimums, and age requirements.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`glass-obsidian rounded-2xl border transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
                  isOpen
                    ? 'border-[#D4AF37]/60 shadow-[0_4px_30px_rgba(212,175,55,0.1)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg lg:text-xl font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] rotate-180'
                        : 'border-white/15 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-0 text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-light border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Link to Full FAQ */}
        <div className="mt-14 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-white uppercase tracking-[0.25em] transition-colors group px-6 py-3 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            <span>Review Full Guest Policy &amp; Guidelines</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
