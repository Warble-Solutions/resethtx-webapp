'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useReservation } from '../context/ReservationContext'

export default function HeroSection() {
  const { openReservation } = useReservation()
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

      {/* 1. Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/event-1.jpg" // Ensure this image exists!
          alt="Reset HTX Atmosphere"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black"></div>
      </div>

      {/* 2. Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">

        {/* SUBTITLE: Using font-heading for that "EST 2021" Serif look */}
        <h2 className="font-heading text-[#D4AF37] text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Welcome to Houston's Premier Lounge
        </h2>

        {/* MAIN TITLE: Cinzel Font */}
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
          RESET <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] via-[#F0DEAA] to-[#D4AF37]">HTX</span>
        </h1>

        {/* DESCRIPTION: Manrope Font */}
        <p className="font-sans text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Experience an atmosphere where luxury meets rhythm.
          Crafted cocktails, world-class DJs, and an unforgettable vibe.
        </p>

        {/* BUTTONS: Manrope Font */}
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <button
            onClick={() => openReservation()}
            className="font-sans bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-widest text-sm uppercase"
          >
            Book A Table
          </button>
          <Link
            href="/menu"
            className="font-sans bg-transparent border border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all hover:border-[#D4AF37] hover:text-[#D4AF37] tracking-widest text-sm uppercase"
          >
            View Menu
          </Link>
        </div>
      </div>

      {/* 3. Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}