'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Music2,
  Wine,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Car,
  Shirt,
  IdCard,
  ChevronRight,
  Sliders,
  Volume2,
  Sun,
  Moon,
  Flame,
  Award,
  Calendar,
  Eye
} from 'lucide-react'
import FAQSection from '@/app/components/FAQSection'

// Space Showcase Data
const spaces = [
  {
    id: 'terrace',
    name: 'The Skyline Terrace',
    subtitle: 'Open-Air Stargazing & Golden Hour Panoramic Views',
    badge: 'Open-Air Rooftop',
    capacity: '250 Guests',
    sqft: '3,200 SQ FT',
    soundRating: 'Ambient & Deep House',
    lighting: '2200K Sunset to Candlelight',
    features: [
      'Unobstructed 360° Midtown & Downtown Houston skyline panorama',
      'Central island craft cocktail bar with full wrap-around service',
      'Motorized weather-adaptive retractable pergola for year-round comfort',
      'Ambient linear fire features and plush perimeter lounge banquettes'
    ],
    image: '/private_page/2.jpeg',
    tag: 'Midtown Rooftop Destination'
  },
  {
    id: 'salon',
    name: 'The Obsidian Sound Salon',
    subtitle: 'High-Fidelity Acoustics & Intimate Velvet Enclaves',
    badge: 'Interior Luxury Lounge',
    capacity: '150 Guests',
    sqft: '2,600 SQ FT',
    soundRating: 'Club-Calibrated Void Tuning',
    lighting: 'Sound-Sync Intelligent RGBW',
    features: [
      'Custom acoustic fluted walnut paneling engineered for acoustic purity',
      'Plush velvet VIP booths with direct sightlines to headline DJ booth',
      'Intelligent ambient lighting programmed to pulse with music frequencies',
      'Dedicated interior VIP bottle presentation station'
    ],
    image: '/private_page/4.jpg',
    tag: 'Acoustic Sanctuary'
  },
  {
    id: 'mezzanine',
    name: 'The VIP Mezzanine & Stage',
    subtitle: 'Elevated Prime Sightlines & Discrete White-Glove Bottle Service',
    badge: 'Exclusive Enclave',
    capacity: '60 Guests',
    sqft: '1,100 SQ FT',
    soundRating: 'Direct Stage Audio Focus',
    lighting: 'Personalized Booth Dimmers',
    features: [
      'Elevated vantage point overlooking both the dance floor and main stage',
      'Dedicated personal bottle service captain and private security detail',
      'Custom champagne crystal bucket presentations and sparkler celebrations',
      'Expedited private check-in and priority elevator transit'
    ],
    image: '/images/event-3.png',
    tag: 'Ultra-Exclusive VIP'
  }
]

// Timeline Milestones
const milestones = [
  {
    year: '2021',
    season: 'Autumn',
    title: 'The Inception & Blueprint',
    desc: 'Conceived by Houston nightlife purists at 606 Dennis Street. The mission: build an architectural space where crystal acoustics and skyline opulence take precedence over generic club tropes.'
  },
  {
    year: '2022',
    season: 'Summer',
    title: 'The Grand Opening',
    desc: 'Reset HTX officially opens its doors to Midtown Houston, introducing a dual-level indoor/outdoor rooftop experience with custom acoustic calibration and artisanal mixology.'
  },
  {
    year: '2023',
    season: 'Spring',
    title: 'The Cultural Residencies',
    desc: 'Launch of the iconic Wednesday Happy Hour and weekly Saturday rooftop sessions, attracting world-class electronic DJs, Afrobeats headliners, and Houston tastemakers.'
  },
  {
    year: '2024+',
    season: 'Present',
    title: 'The Gold Standard',
    desc: 'Established as Midtown’s undisputed landmark for elevated social dining, VIP bottle service, and private corporate buyouts, celebrating the best of Houston nightlife.'
  }
]

// Tastemaker Quotes / Accolades
const quotes = [
  {
    quote: "Reset HTX has redefined what an upscale rooftop lounge in Houston should be. The sound engineering alone is lightyears ahead.",
    author: "Houston Nightlife Culture",
    role: "Editorial Feature"
  },
  {
    quote: "A rare venue where you can enjoy an intimate conversation over craft cocktails, then step into a high-energy sound experience under the stars.",
    author: "Tastemaker Society",
    role: "VIP Member Review"
  },
  {
    quote: "The skyline terrace at golden hour is the most photogenic backdrop in Midtown. Impeccable bottle service from arrival to closing.",
    author: "Midtown Socialite",
    role: "Guest Chronicle"
  }
]

export default function AboutClient() {
  const [activeSpace, setActiveSpace] = useState(spaces[0].id)
  const [dressCodeTab, setDressCodeTab] = useState<'celebrated' | 'restricted'>('celebrated')
  const [lightingMode, setLightingMode] = useState<'sunset' | 'dusk' | 'midnight'>('sunset')

  const currentSpace = spaces.find((s) => s.id === activeSpace) || spaces[0]

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black pt-20 sm:pt-24 pb-0 relative overflow-hidden">
      
      {/* Dynamic Background Glows & Architectural Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[#D4AF37]/10 blur-[180px] rounded-full" />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 -left-60 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[180px] rounded-full" />
      </div>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC VIDEO & EDITORIAL HERO */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90dvh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        
        {/* Background Video with Luxury Dark Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
            style={{ opacity: 0.5, filter: 'brightness(1.1) contrast(1.05) saturate(1.2)' }}
          >
            <source src="/vids/vid.mp4" type="video/mp4" />
          </video>
          {/* Multi-layered gradient overlays */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, #050505 100%)' }} />
          
          {/* Subtle noise grain for filmic texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
            style={{ backgroundImage: "url('/images/noise.png')" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto pt-10 pb-16">
          
          {/* Haute Couture Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] mb-6" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', backdropFilter: 'blur(12px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span>EST. MMXXII • 606 DENNIS ST • MIDTOWN HOUSTON</span>
          </div>

          {/* Main Dramatic Editorial Title */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[1.05] mb-6" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.95)' }}>
            The Art Of <br />
            <span className="gold-gradient-text">
              The Reset
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-zinc-200 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light mb-8" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
            Where high-fidelity acoustics, artisanal mixology, and skyline opulence converge above the energy of Midtown Houston.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/reservations"
              className="w-full sm:w-auto btn-gold-shimmer px-9 py-3.5 font-bold uppercase tracking-[0.18em] text-[11px] rounded-full text-center flex items-center justify-center gap-2"
            >
              <span>Experience Reset</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/private-events"
              className="w-full sm:w-auto px-9 py-3.5 font-bold uppercase tracking-[0.18em] text-[11px] rounded-full text-white/90 hover:text-[#D4AF37] text-center transition-colors"
              style={{ background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
            >
              Private Buyouts & Spaces
            </Link>
          </div>

          {/* Anchor Navigation Pills */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-16 pt-8 border-t border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            <a href="#manifesto" className="hover:text-[#D4AF37] transition-colors">01. The Origin</a>
            <span className="text-zinc-600">•</span>
            <a href="#spaces" className="hover:text-[#D4AF37] transition-colors">02. Spaces & Architecture</a>
            <span className="text-zinc-600">•</span>
            <a href="#sensory" className="hover:text-[#D4AF37] transition-colors">03. Sensory Craft</a>
            <span className="text-zinc-600">•</span>
            <a href="#chronicle" className="hover:text-[#D4AF37] transition-colors">04. The Chronicle</a>
            <span className="text-zinc-600">•</span>
            <a href="#etiquette" className="hover:text-[#D4AF37] transition-colors">05. Guest Standards</a>
          </div>

        </div>

        {/* Floating Metrics Bar at bottom of Hero */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 mb-8">
          <div className="text-center p-3 border-r border-white/5">
            <div className="text-[#D4AF37] font-heading text-2xl sm:text-3xl font-bold">65 FT</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-sans mt-0.5">Above Midtown Skyline</div>
          </div>
          <div className="text-center p-3 md:border-r border-white/5">
            <div className="text-[#D4AF37] font-heading text-2xl sm:text-3xl font-bold">450 CAP</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-sans mt-0.5">Dual Salon & Terrace</div>
          </div>
          <div className="text-center p-3 border-r border-white/5">
            <div className="text-[#D4AF37] font-heading text-2xl sm:text-3xl font-bold">360°</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-sans mt-0.5">Panoramic Horizons</div>
          </div>
          <div className="text-center p-3">
            <div className="text-[#D4AF37] font-heading text-2xl sm:text-3xl font-bold">HIGH-FI</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-sans mt-0.5">Tuned Acoustic Matrix</div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. THE MANIFESTO & ORIGIN STORY (Haute Editorial Spread) */}
      {/* ========================================================================= */}
      <section id="manifesto" className="py-28 sm:py-36 px-4 sm:px-8 border-t border-white/10 bg-[#080808] relative z-10">
        
        {/* Background Roman Watermark */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 font-heading text-[180px] sm:text-[280px] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter">
          MMXXII
        </div>

        <div className="max-w-7xl mx-auto">
          
          {/* Editorial Lead Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Origin Manifesto</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-tight leading-[1.05]">
                Born Above <br />
                <span className="text-[#D4AF37]">The Houston Skyline</span>
              </h2>
            </div>
            <p className="text-zinc-400 max-w-md font-sans text-xs sm:text-sm leading-relaxed font-light">
              "We didn't set out to build another loud, crowded nightclub. We built a sonic sanctuary where Houston’s tastemakers could disconnect from the noise and reset."
            </p>
          </div>

          {/* Asymmetric Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Narrative Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-light">
              
              <p className="text-lg sm:text-xl text-white font-serif italic border-l-2 border-[#D4AF37] pl-5 py-1">
                In the summer of 2022, a bespoke architectural structure rose at 606 Dennis Street, right where Midtown connects to the pulse of Downtown Houston.
              </p>

              <p>
                Reset HTX was created in response to an obvious void in Texas nightlife: the lack of true <span className="text-white font-medium">acoustic intimacy combined with open-air grandeur</span>. Conventional lounges forced guests to choose between screaming over distorted sound systems or sitting in sterile, quiet bars.
              </p>

              <p>
                We engineered an alternative. Reset was conceptualized with two distinct acoustic chambers: an interior salon treated with fluted acoustics and custom-calibrated line arrays for deep, immersive listening; and an open-air skyline terrace where guests sip handcrafted agave cocktails beneath the Houston stars.
              </p>

              <p>
                Today, Reset is more than a rooftop—it is an epicenter of curated culture. From our legendary Wednesday Happy Hours with sunset views to weekend residencies featuring global electronic and Afrobeats artists, every detail is tuned for seamless opulence.
              </p>

              {/* Founder Sign-off & Pillars */}
              <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-8">
                <div>
                  <div className="font-heading text-lg font-bold text-white tracking-wider uppercase">Reset HTX Curators</div>
                  <div className="text-xs text-[#D4AF37] font-sans tracking-widest uppercase mt-0.5">Midtown Houston, TX</div>
                </div>
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3 text-xs tracking-wider text-zinc-400 font-mono">
                  <span>GPS // 29°44'59.6"N</span>
                  <span>95°22'40.8"W</span>
                </div>
              </div>

            </div>

            {/* Right Column: Layered Editorial Visual Montage (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Primary High-Resolution Frame */}
                <div className="relative h-[420px] sm:h-[480px] w-full rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
                  <Image
                    src="/images/event-3.png"
                    alt="Reset HTX Skyline Sunset Gathering"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-1">
                      Midtown Sunset Hour
                    </div>
                    <div className="font-heading text-xl font-bold text-white">
                      Where Golden Hour Meets Midnight
                    </div>
                  </div>
                </div>

                {/* Overlapping Secondary Glass Card */}
                <div className="absolute -bottom-10 -left-6 sm:-left-10 w-48 sm:w-60 p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl hidden sm:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">Acoustic Clarity</div>
                      <div className="text-[9px] text-[#D4AF37] uppercase">Zero Distortion</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Calibrated specifically so table conversations stay effortless while the rhythm moves you.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE VENUE SPACES NAVIGATOR */}
      {/* ========================================================================= */}
      <section id="spaces" className="py-28 sm:py-36 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Architectural Zoning</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-tight">
            The Spaces
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base font-sans mt-4 font-light">
            Designed to flow seamlessly from open-air golden hour sunsets to late-night acoustic intimacy.
          </p>

          {/* Interactive Space Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {spaces.map((space) => {
              const isActive = activeSpace === space.id
              return (
                <button
                  key={space.id}
                  onClick={() => setActiveSpace(space.id)}
                  className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.4)] scale-105'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-[#D4AF37]'}`} />
                  <span>{space.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Space Spotlight Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-zinc-950/90 border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[130px] pointer-events-none" />

          {/* Space Details (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {currentSpace.badge}
              </span>
              <span className="text-zinc-400 text-xs font-mono">{currentSpace.tag}</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-tight">
              {currentSpace.name}
            </h3>

            <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed font-light">
              {currentSpace.subtitle}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs font-sans">
              <div>
                <span className="text-zinc-400 uppercase tracking-wider block text-[10px]">Capacity</span>
                <span className="font-heading text-lg font-bold text-white mt-0.5 block">{currentSpace.capacity}</span>
              </div>
              <div>
                <span className="text-zinc-400 uppercase tracking-wider block text-[10px]">Area</span>
                <span className="font-heading text-lg font-bold text-white mt-0.5 block">{currentSpace.sqft}</span>
              </div>
              <div>
                <span className="text-zinc-400 uppercase tracking-wider block text-[10px]">Acoustic Tuning</span>
                <span className="font-heading text-base font-bold text-[#D4AF37] mt-0.5 block">{currentSpace.soundRating}</span>
              </div>
              <div>
                <span className="text-zinc-400 uppercase tracking-wider block text-[10px]">Lighting Profile</span>
                <span className="font-heading text-base font-bold text-white mt-0.5 block">{currentSpace.lighting}</span>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              {currentSpace.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/reservations"
                className="px-8 py-3.5 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Reserve Table Here
              </Link>
              <Link
                href="/private-events"
                className="px-8 py-3.5 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all"
              >
                Inquire For Buyout
              </Link>
            </div>

          </div>

          {/* Space Image Showcase (6 Cols) */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
            <Image
              src={currentSpace.image}
              alt={currentSpace.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider text-white font-mono">
              606 Dennis St • Level 2
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-zinc-300">
              <span className="text-[#D4AF37] font-bold uppercase tracking-widest">Reset HTX Midtown</span>
              <span className="font-mono text-zinc-400">Status: Active Service</span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. THE SENSORY PILLARS (Acoustics, Liquid Architecture, Hospitality) */}
      {/* ========================================================================= */}
      <section id="sensory" className="py-28 sm:py-36 bg-[#080808] border-y border-white/10 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sensory Curation</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-tight">
              The Sensory Anatomy
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base font-sans mt-4 font-light">
              Every evening at Reset is engineered across four pillars of sensory immersion.
            </p>
          </div>

          {/* 4-Quadrant Sensory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1: Acoustic Engineering */}
            <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-[#D4AF37]/60 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[90px] pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <Music2 className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">DISCIPLINE 01 // SOUND</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                  Sonic Purity & Precision
                </h3>

                <p className="text-zinc-400 text-sm font-sans leading-relaxed font-light mb-6">
                  We reject the standard nightclub practice of cranking up distorted speakers until conversation is impossible. Our acoustic environment is tuned for high-fidelity stereo balance—enabling crystal vocal clarity, warm sub-bass frequencies (35Hz–120Hz), and effortless conversation at your VIP table.
                </p>

                {/* Animated Sound Wave Graphic Representation */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-1.5 h-16">
                  {[40, 65, 30, 85, 55, 95, 70, 45, 90, 60, 35, 80, 50, 75, 40, 88, 60, 30, 70, 95, 45].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-gradient-to-t from-[#D4AF37]/40 to-[#D4AF37] rounded-full transition-all duration-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Void & Line-Array Calibration</span>
                <span className="text-[#D4AF37] font-mono">35Hz – 20kHz Balanced</span>
              </div>
            </div>

            {/* Pillar 2: Liquid Architecture (Mixology) */}
            <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-[#D4AF37]/60 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[90px] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <Wine className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">DISCIPLINE 02 // TASTE</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                  Artisanal Liquid Architecture
                </h3>

                <p className="text-zinc-400 text-sm font-sans leading-relaxed font-light mb-6">
                  Every cocktail served across our three bars is treated as an architectural build. From hand-carved crystal ice spheres to house-smoked rosemary aromatics and single-estate agave selections, our beverage directors honor timeless recipes while pioneering contemporary presentations.
                </p>

                {/* Signature Ingredients Ribbon */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                    <div className="text-[#D4AF37] font-bold text-xs uppercase">Hand-Cut</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Crystal 2x2 Ice</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                    <div className="text-[#D4AF37] font-bold text-xs uppercase">Aromatics</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Smoked Botanicals</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                    <div className="text-[#D4AF37] font-bold text-xs uppercase">Rare Cellar</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Agave & Tequila</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Cocktail Program</span>
                <span className="text-[#D4AF37] font-mono">Small-Batch House Infusions</span>
              </div>
            </div>

            {/* Pillar 3: Lighting & Ambiance */}
            <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-[#D4AF37]/60 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[90px] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <Sun className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">DISCIPLINE 03 // AMBIANCE</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                  Circadian Lighting Dynamics
                </h3>

                <p className="text-zinc-400 text-sm font-sans leading-relaxed font-light mb-6">
                  Lighting dictating mood. Our venue transitions across a subtle color temperature spectrum throughout the night—from warm golden hour amber (2700K) to dramatic candlelight dining (2200K) and immersive midnight sound-pulse sequences (1800K).
                </p>

                {/* Lighting Mode Selector / Preview */}
                <div className="flex items-center justify-between p-2 rounded-2xl bg-black/60 border border-white/10 gap-2">
                  <button
                    onClick={() => setLightingMode('sunset')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      lightingMode === 'sunset' ? 'bg-[#D4AF37] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Golden Hour (6PM)
                  </button>
                  <button
                    onClick={() => setLightingMode('dusk')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      lightingMode === 'dusk' ? 'bg-[#D4AF37] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Twilight (9PM)
                  </button>
                  <button
                    onClick={() => setLightingMode('midnight')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      lightingMode === 'midnight' ? 'bg-[#D4AF37] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Midnight Pulse (12AM)
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Intelligent DMX Controls</span>
                <span className="text-[#D4AF37] font-mono">1800K – 2700K Dim-To-Warm</span>
              </div>
            </div>

            {/* Pillar 4: White-Glove Hospitality */}
            <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-[#D4AF37]/60 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[90px] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">DISCIPLINE 04 // HOSPITALITY</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                  Anticipatory Service & Care
                </h3>

                <p className="text-zinc-400 text-sm font-sans leading-relaxed font-light mb-6">
                  True luxury is felt, not proclaimed. Our team of dedicated table captains, discreet security liaisons, and valet concierge greet each guest with intuitive warmth. From customized bottle celebrations to expedited arrivals, your evening unfolds without friction.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Dedicated Table Captains with Bottle Presentation Rituals</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Executive Security & Discrete VIP Protection Protocol</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Expedited Door Valet Staging at 606 Dennis Street</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Guest Concierge</span>
                <span className="text-[#D4AF37] font-mono">White-Glove Standard</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE CHRONICLE (Milestone Timeline) */}
      {/* ========================================================================= */}
      <section id="chronicle" className="py-28 sm:py-36 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>The Evolution</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight">
            The Chronicle
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base font-sans mt-4 font-light">
            The defining milestones that shaped Reset HTX from an ambitious blueprint into Houston's premier rooftop institution.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between shadow-xl group hover:-translate-y-2 relative"
            >
              {/* Year & Season Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-[#D4AF37] group-hover:scale-105 transition-transform">
                    {item.year}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {item.season}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              {/* Milestone Indicator Bar */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>PHASE 0{idx + 1}</span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. TASTEMAKER TESTIMONIALS & PRESS QUOTE CAROUSEL */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#080808] border-y border-white/10 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quotes.map((q, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-black/60 border border-white/10 flex flex-col justify-between relative shadow-xl hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="text-3xl font-serif text-[#D4AF37]/40 mb-4 select-none">“</div>
                <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed italic mb-6">
                  "{q.quote}"
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-heading text-sm font-bold text-white uppercase tracking-wider">{q.author}</div>
                  <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-mono mt-0.5">{q.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. GUEST STANDARDS & HOUSE ETIQUETTE LOOKBOOK */}
      {/* ========================================================================= */}
      <section id="etiquette" className="py-28 sm:py-36 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Subtle Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-5">
          <img src="/logos/r_logo.png" alt="Reset HTX Logo Watermark" className="w-[550px]" />
        </div>

        <div className="relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>House Etiquette</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight">
              Standards of Entry
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base font-sans mt-4 font-light">
              To preserve an elevated, vibrant, and safe social atmosphere for all patrons, we ask that you adhere to our house guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Interactive Dress Code Guide */}
            <div className="bg-zinc-950/90 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl hover:border-[#D4AF37]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/30 text-[#D4AF37]">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">FASHION FORWARD</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white mb-2">
                  Elevated Dress Code
                </h3>
                <p className="text-zinc-400 text-xs font-sans mb-6 font-light">
                  Chic, upscale, and fashion-forward attire is required. Management reserves all rights of entry.
                </p>

                {/* Tab Switcher */}
                <div className="flex rounded-xl bg-black/60 p-1 border border-white/10 mb-5">
                  <button
                    onClick={() => setDressCodeTab('celebrated')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      dressCodeTab === 'celebrated' ? 'bg-[#D4AF37] text-black' : 'text-zinc-400'
                    }`}
                  >
                    Encouraged
                  </button>
                  <button
                    onClick={() => setDressCodeTab('restricted')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      dressCodeTab === 'restricted' ? 'bg-red-950/80 text-red-300 border border-red-800/40' : 'text-zinc-400'
                    }`}
                  >
                    Prohibited
                  </button>
                </div>

                {dressCodeTab === 'celebrated' ? (
                  <div className="space-y-2.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Cocktail dresses, evening gowns, chic sets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Collared shirts, tailored blazers & trousers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Fashion-forward upscale streetwear & designer footwear</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Athletic sweatpants, tracksuits, or gym attire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Sports team jerseys or tank tops</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Flip flops, slides, or beachwear</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-zinc-400 font-mono">
                DRESS CODE STRICTLY ENFORCED
              </div>
            </div>

            {/* Card 2: Age & Identification */}
            <div className="bg-zinc-950/90 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl hover:border-[#D4AF37]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/30 text-[#D4AF37]">
                    <IdCard className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">PHYSICAL ID ONLY</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white mb-2">
                  21+ Age Standard
                </h3>
                <p className="text-zinc-400 text-xs font-sans mb-6 font-light">
                  Reset HTX is an adult social destination. Valid government photo identification is verified upon entry.
                </p>

                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Valid US Driver's License or State ID Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Valid US or Foreign Passport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>US Military Photo Identification Card</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] mt-4">
                    Note: Digital photos, screenshots, or expired IDs cannot be accepted under TABC state regulations.
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-zinc-400 font-mono">
                TABC REGULATIONS MANDATED
              </div>
            </div>

            {/* Card 3: Arrival, Valet & Location */}
            <div className="bg-zinc-950/90 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl hover:border-[#D4AF37]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/30 text-[#D4AF37]">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">DENNIS ST STAGING</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white mb-2">
                  Arrival & Valet
                </h3>
                <p className="text-zinc-400 text-xs font-sans mb-6 font-light">
                  Seamless arrival staging directly at our 606 Dennis Street main entrance in Midtown.
                </p>

                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>606 Dennis St, Houston, TX 77006 (Midtown Houston)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Door Valet Service: $15 regular / $10 during Wednesday Happy Hour</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Rideshare drop-off zone active in front of main entrance</span>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=606+Dennis+St,+Houston,+TX+77006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all w-full justify-center"
                >
                  <span>Open In Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-zinc-400 font-mono">
                CONCIERGE VALET AVAILABLE
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ SECTION */}
      {/* ========================================================================= */}
      <FAQSection />

      {/* ========================================================================= */}
      {/* 9. THE GOLD RESERVE FINALE CTA */}
      {/* ========================================================================= */}
      <section className="py-28 sm:py-36 bg-gradient-to-b from-[#080808] to-black border-t border-white/10 text-center px-4 sm:px-6 relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[#D4AF37]/15 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join The Reset Culture</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase mb-6 tracking-tight font-heading text-white">
            Your Table Above <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F6E8B1] to-[#D4AF37]">
              The City Awaits
            </span>
          </h2>

          <p className="text-sm sm:text-lg md:text-xl text-zinc-300 font-sans leading-relaxed mb-12 max-w-2xl mx-auto font-light text-balance">
            Whether celebrating a personal milestone, hosting a private corporate buyout, or securing an intimate terrace table for weekend residencies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/reservations"
              className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-[0.25em] text-xs rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)] text-center"
            >
              Reserve VIP Bottle Table
            </Link>
            <Link
              href="/private-events"
              className="w-full sm:w-auto px-10 py-4 border border-white/25 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold uppercase tracking-[0.25em] text-xs rounded-full transition-all text-center backdrop-blur-md hover:bg-white/5"
            >
              Private Event Inquiries
            </Link>
            <Link
              href="/events"
              className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold uppercase tracking-[0.25em] text-xs rounded-full transition-all text-center border border-white/10"
            >
              Weekly Calendar
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
