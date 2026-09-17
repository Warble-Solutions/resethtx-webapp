'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'

import { HOMEPAGE_FAQS } from '@/lib/schemas'

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 bg-[#070707] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Guest Guide
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-4">
            Frequently Asked <span className="text-[#D4AF37]">Questions</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-sans">
            Everything you need to know before visiting Houston's premier rooftop lounge.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#D4AF37]/60 bg-zinc-900/80 shadow-[0_4px_20px_rgba(212,175,55,0.08)]'
                    : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-lg md:text-xl font-bold text-white tracking-wide">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] rotate-180'
                        : 'border-zinc-700 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-slate-300 text-base leading-relaxed font-sans border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Link to Full FAQ */}
        <div className="mt-12 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-white uppercase tracking-widest transition-colors group"
          >
            View Full Guest & FAQ Policies
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
