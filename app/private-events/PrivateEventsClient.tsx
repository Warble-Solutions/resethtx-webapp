'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  Users,
  Music2,
  Wine,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Utensils,
  ChevronDown,
  Volume2,
  HelpCircle,
  FileText
} from 'lucide-react'
import InquireModal from '@/app/components/InquireModal'

const VENUE_SPACES = [
  {
    id: 'terrace',
    name: "The Skyline Terrace",
    subtitle: "Open-Air Rooftop Deck",
    capacity: "Up to 250 Guests",
    seatedCapacity: "140 Seated",
    description: "Panoramic views of the downtown Houston skyline with expansive open-air lounge seating, private outdoor craft bar, and weather-adaptive retractable cover.",
    image: "/private_page/2.jpeg",
    idealFor: ["Cocktail Receptions", "Networking Mixers", "Sunset Celebrations", "Product Launches"],
    features: [
      "Panoramic Downtown Skyline Views",
      "Dedicated 360-Degree Terrace Bar",
      "Weather-Adaptive Retractable Pergola Cover",
      "High-Top Cocktail & Soft Lounge Seating",
      "Outdoor Sound System & Ambient Lighting"
    ]
  },
  {
    id: 'lounge',
    name: "The Obsidian Lounge",
    subtitle: "Interior Luxury Salon",
    capacity: "Up to 150 Guests",
    seatedCapacity: "85 Seated",
    description: "Intimate climate-controlled haven featuring plush velvet banquet booths, ambient gold mood lighting, and direct connection to the premier DJ booth.",
    image: "/private_page/4.jpg",
    idealFor: ["Executive Dinners", "VIP Mixers", "Late-Night Afterparties", "Milestone Birthdays"],
    features: [
      "Full Climate-Controlled Interior Space",
      "Custom LED Sound-Synchronized Mood Lighting",
      "Dedicated Full-Service Craft Cocktail Bar",
      "Plush Velvet VIP Bottle Service Booths",
      "Integrated DJ Setup & Microphone System"
    ]
  },
  {
    id: 'buyout',
    name: "Full Venue Buyout",
    subtitle: "Complete Rooftop Exclusivity",
    capacity: "Up to 450 Guests",
    seatedCapacity: "250 Seated",
    description: "Dual-level venue access including both the open-air terrace and interior salon. Complete exclusivity with dedicated event staff, security, private chef, and custom mixology.",
    image: "/private_page/6.png",
    idealFor: ["Company Holiday Galas", "Corporate Year-End Buyouts", "Brand Activations", "Conferences"],
    features: [
      "Exclusive Dual-Level Rooftop & Indoor Access",
      "Private VIP Entrance & Dedicated Valet Staging",
      "Full AV Control, DJ Booth & Multi-Zone Sound",
      "Custom Branded Food & Mixology Menus",
      "Dedicated Event Director & Full Staff Service"
    ]
  }
]

const EVENT_TYPES = [
  {
    title: "Corporate Mixers & Receptions",
    desc: "Impress executives, clients, and colleagues with panoramic skyline vistas, passed hors d'oeuvres, and bespoke craft cocktails.",
    icon: Building2
  },
  {
    title: "Private Dining & Tasting Menus",
    desc: "Curated multi-course culinary dinners paired with artisanal wines and signature mixology for intimate executive groups.",
    icon: Utensils
  },
  {
    title: "Brand Activations & Launches",
    desc: "High-impact visual canvas with projection surfaces, custom photo backdrops, and state-of-the-art audio-visual production.",
    icon: Sparkles
  },
  {
    title: "Milestone Galas & Buyouts",
    desc: "Celebrate birthdays, company anniversaries, and holiday celebrations with complete venue privacy, headline DJs, and bottle presentations.",
    icon: Wine
  }
]

const BEVERAGE_TIERS = [
  {
    name: "The Skyline Package",
    badge: "Beer & Wine",
    desc: "A refined selection of craft drafts, premium imported beers, and sommelier-curated red, white, and sparkling wines.",
    includes: ["Draft & Bottled Craft Beers", "Curated Red & White Wines", "Prosecco Toast", "Soft Drinks & Mocktails"]
  },
  {
    name: "The Obsidian Tier",
    badge: "Most Popular",
    desc: "Our signature elevated open bar featuring premium spirits, handcrafted seasonal cocktails, and boutique wines.",
    includes: ["Top-Tier Spirits (Casamigos, Tito's, Hennessy)", "Reset HTX Signature Cocktails", "Curated Wines & Craft Beers", "Champagne Greeting Toast"]
  },
  {
    name: "The Gold Reserve",
    badge: "Ultra Luxury",
    desc: "The pinnacle of hospitality. Rare reserve spirits, prestige vintage champagnes, and custom engraved cocktail ice stamps.",
    includes: ["Prestige Champagnes (Dom Pérignon, Veuve Clicquot)", "Reserve Spirits & Cognacs", "Bespoke Signature Cocktail Menu", "Custom Ice Stamps & Menu Branding"]
  }
]

const FAQS = [
  {
    q: "What is the capacity of Reset HTX for private events?",
    a: "We accommodate groups ranging from 30 guests for semi-private terrace lounge sections up to 450 guests for a full venue buyout spanning both the open-air terrace and interior salon."
  },
  {
    q: "Are outside catering and decorators permitted?",
    a: "We offer comprehensive in-house chef catering and craft beverage packages. Certified outside catering and professional event decorators may be approved on a case-by-case basis with prior coordination."
  },
  {
    q: "What audio/visual equipment is included?",
    a: "Our venue features a club-grade sound system, full DJ booth connectivity, wireless handheld microphones, HDTV presentation screens, and programmable architectural mood lighting."
  },
  {
    q: "What is the weather contingency plan for the rooftop terrace?",
    a: "The Skyline Terrace features a motorized weather-adaptive retractable pergola system with climate shields, keeping guests protected while preserving downtown skyline views."
  },
  {
    q: "What is the booking deposit and cancellation policy?",
    a: "A 50% deposit secures your date on our calendar, with the remaining balance due 14 days prior to your event. Our team will provide complete terms tailored to your proposal."
  }
]

export default function PrivateEventsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSpaceTab, setSelectedSpaceTab] = useState<'terrace' | 'lounge' | 'buyout'>('terrace')
  
  // Interactive Event Fit Estimator state
  const [estEventType, setEstEventType] = useState('Corporate Mixer')
  const [estGuestCount, setEstGuestCount] = useState(150)
  
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Determine recommendation based on guest count
  const recommendedSpace = useMemo(() => {
    if (estGuestCount <= 120) return VENUE_SPACES[1] // The Obsidian Lounge
    if (estGuestCount <= 250) return VENUE_SPACES[0] // The Skyline Terrace
    return VENUE_SPACES[2] // Full Venue Buyout
  }, [estGuestCount])

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#D4AF37] selection:text-black">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative h-[90dvh] min-h-[640px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image & Ambient Luxury Vignettes */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/private_page/2.jpeg"
            alt="Reset Rooftop Skyline Private Event"
            fill
            className="object-cover opacity-55 scale-105 transition-transform duration-10000"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D4AF37]/12 blur-[140px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
          
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Events & Rooftop Buyouts</span>
            <span className="hidden sm:inline">✦ Midtown Houston</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tight mb-6 text-white leading-[1.05] sm:leading-[0.95] drop-shadow-2xl">
            Host Above <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F6E8B1] to-[#D4AF37]">
              The Skyline
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-zinc-300 text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Boardroom views, not boardrooms. From executive networking and private culinary tastings to milestone galas and complete venue buyouts.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.35)] cursor-pointer"
            >
              Inquire About Dates
            </button>
            <a
              href="#spaces"
              className="w-full sm:w-auto px-10 py-4 border border-white/25 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all text-center backdrop-blur-sm"
            >
              Explore Spaces
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VENUE CAPACITY & KEY METRICS RIBBON */}
      {/* ========================================================================= */}
      <section className="bg-zinc-950/90 border-y border-white/10 py-6 sm:py-8 px-4 sm:px-6 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="p-2">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37]">450</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400 mt-1 font-sans">Standing Reception</p>
          </div>
          <div className="p-2 border-l border-white/10">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37]">280</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400 mt-1 font-sans">Seated Dining</p>
          </div>
          <div className="p-2 border-l border-white/10">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37]">Dual</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400 mt-1 font-sans">Indoor & Patio Spaces</p>
          </div>
          <div className="p-2 border-l border-white/10">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37]">10 min</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400 mt-1 font-sans">From Downtown HTX</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE VENUE SPACES SHOWCASE */}
      {/* ========================================================================= */}
      <section id="spaces" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
            Customizable Configurations
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight">
            The Venue Spaces
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-sans leading-relaxed mt-4 font-light">
            Choose from an open-air rooftop terrace overlooking downtown Houston, an intimate interior luxury salon, or reserve the entire venue exclusively.
          </p>

          {/* Interactive Space Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {VENUE_SPACES.map((space) => (
              <button
                key={space.id}
                onClick={() => setSelectedSpaceTab(space.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedSpaceTab === space.id
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {space.name}
              </button>
            ))}
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VENUE_SPACES.map((space) => {
            const isHighlighted = selectedSpaceTab === space.id
            return (
              <div
                key={space.id}
                className={`group bg-zinc-950/90 border rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                  isHighlighted
                    ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50'
                    : 'border-zinc-800/80 hover:border-[#D4AF37]/60'
                }`}
              >
                <div>
                  {/* Space Photography */}
                  <div className="relative h-72 w-full bg-zinc-900 overflow-hidden">
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Capacity Badge */}
                    <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                      {space.capacity}
                    </span>

                    <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-widest text-zinc-300 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                      {space.seatedCapacity}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 sm:p-7">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-1">
                      {space.subtitle}
                    </p>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
                      {space.name}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans mb-6 font-light">
                      {space.description}
                    </p>

                    {/* Features Checklist */}
                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      {space.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3.5 border border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer text-center shadow-md"
                  >
                    Inquire For This Space
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE EVENT FIT & CAPACITY ESTIMATOR */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-y border-white/10 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
              Plan Your Experience
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white tracking-tight">
              Event Fit Estimator
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-2 font-light">
              Select your expected guest count and event style to discover your ideal venue configuration.
            </p>
          </div>

          <div className="bg-zinc-950/85 border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            
            {/* Step 1: Event Type */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                1. Select Event Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Corporate Mixer', 'Private Dining', 'Milestone Gala', 'Brand Activation'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setEstEventType(type)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border text-center ${
                      estEventType === type
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-black/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Guest Count Slider / Preset Buttons */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  2. Estimated Guest Count
                </label>
                <span className="font-heading text-2xl font-bold text-[#D4AF37]">
                  {estGuestCount} <span className="text-xs text-zinc-400 font-sans font-normal uppercase tracking-wider">Guests</span>
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="30"
                max="450"
                step="10"
                value={estGuestCount}
                onChange={(e) => setEstGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />

              {/* Quick Presets */}
              <div className="flex justify-between text-[11px] text-zinc-500 font-sans mt-2">
                <span>30 (Intimate)</span>
                <span>150 (Lounge)</span>
                <span>250 (Terrace)</span>
                <span>450 (Full Buyout)</span>
              </div>
            </div>

            {/* Recommended Configuration Box */}
            <div className="bg-black/80 rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mb-1">
                  Recommended Configuration
                </span>
                <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                  {recommendedSpace.name}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl">
                  {recommendedSpace.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[11px] bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/30 font-semibold">
                    Max: {recommendedSpace.capacity}
                  </span>
                  <span className="text-[11px] bg-white/5 text-zinc-300 px-3 py-1 rounded-full border border-white/10">
                    Format: {estEventType === 'Private Dining' ? 'Seated Dining' : 'Standing Reception'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 w-full md:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-[0.2em] text-xs rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer text-center"
              >
                Inquire For This Setup
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OCCASIONS & EVENT FORMATS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
            Tailored Experiences
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight">
            Event Types & Occasions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENT_TYPES.map((ev, i) => {
            const Icon = ev.icon
            return (
              <div
                key={i}
                className="p-7 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 hover:border-[#D4AF37]/50 transition-all group flex flex-col justify-between shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2 leading-tight">
                    {ev.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed font-light">
                    {ev.desc}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-600 mt-6 block">0{i + 1} // RESET HTX</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TURNKEY PRODUCTION, TECH & VIDEO SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 bg-zinc-950/70 border-y border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
              Full-Service Event Execution
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight mb-6">
              Turnkey Production & Amenities
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans mb-8 font-light">
              Reset HTX handles the complexities so your guests can celebrate seamlessly. Our in-house event directors coordinate directly with your planners on floor plans, audiovisuals, mixology menus, and security.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-black border border-zinc-800">
                <Music2 className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h4 className="font-heading text-base font-bold text-white mb-1">State-of-the-Art AV</h4>
                <p className="text-xs text-zinc-400 font-sans font-light">Club-grade multi-zone sound, DJ booth, and presentation wireless microphones.</p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-zinc-800">
                <Wine className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h4 className="font-heading text-base font-bold text-white mb-1">Bespoke Mixology</h4>
                <p className="text-xs text-zinc-400 font-sans font-light">Custom branded cocktails, craft draft towers, and reserve vintage champagne.</p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-zinc-800">
                <Building2 className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h4 className="font-heading text-base font-bold text-white mb-1">Culinary Program</h4>
                <p className="text-xs text-zinc-400 font-sans font-light">Passed artisanal canapés, charcuterie grazing tables, and gourmet slider bars.</p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-zinc-800">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h4 className="font-heading text-base font-bold text-white mb-1">Valet & Door Security</h4>
                <p className="text-xs text-zinc-400 font-sans font-light">Dedicated executive security, guest-list concierge, and valet parking options.</p>
              </div>
            </div>
          </div>

          {/* Sizzle Reel Video Display */}
          <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <video
              src="/vids/vid.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mb-1">
                Rooftop Atmosphere
              </span>
              <p className="text-white font-heading text-lg sm:text-xl font-bold">
                Midtown Houston's Premier Skyline Experience
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BEVERAGE & MIXOLOGY PACKAGES */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
            Curated Bar Experiences
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight">
            Beverage & Mixology Tiers
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans mt-3 font-light">
            Flexible bar packages tailored to your event format, from craft beer & wine to top-shelf reserves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BEVERAGE_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`p-7 sm:p-8 rounded-3xl bg-zinc-950/85 border flex flex-col justify-between shadow-xl transition-all ${
                idx === 1
                  ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/40'
                  : 'border-zinc-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/25">
                    {tier.badge}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">TIER 0{idx + 1}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3">{tier.name}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed mb-6 font-light">
                  {tier.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  {tier.includes.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2.5 text-xs text-zinc-300 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 w-full py-3.5 border border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer text-center"
              >
                Inquire For Package
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. 4-STEP EVENT PLANNING ROADMAP */}
      {/* ========================================================================= */}
      <section className="py-20 bg-zinc-950/70 border-y border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
              The Journey
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold uppercase text-white tracking-tight">
              Seamless Planning Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Inquire & Date Check",
                desc: "Submit your desired date, guest count, and event style. Our event directors respond within 24 business hours."
              },
              {
                step: "02",
                title: "Walkthrough & Tasting",
                desc: "Tour the terrace and lounge in person, review sightlines, and select your craft beverage and culinary tastings."
              },
              {
                step: "03",
                title: "Custom Proposal",
                desc: "Receive an itemized layout and proposal tailored to your budget, AV needs, and timeline."
              },
              {
                step: "04",
                title: "Flawless Execution",
                desc: "Arrive and enjoy. Our on-site venue director and team oversee every detail from load-in to last call."
              }
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-black border border-white/10 relative">
                <span className="font-heading text-3xl font-bold text-[#D4AF37] block mb-2">{step.step}</span>
                <h4 className="font-heading text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
            Clear Answers
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
            Event Planner FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed border-t border-white/5 pt-3 font-light animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. GRAND FINALE CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black border-t border-white/10 text-center px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dates Fill Quickly</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase mt-2 mb-6 tracking-tight font-heading text-white">
            Plan Your Next Event
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-sans leading-relaxed mb-10 max-w-xl mx-auto font-light">
            Let our hospitality team tailor the ideal skyline experience for your guests. Event inquiries receive responses within 24 business hours.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#D4AF37] hover:bg-white text-black px-12 py-4.5 font-bold uppercase tracking-[0.2em] text-xs transition-all transform hover:scale-105 rounded-full shadow-[0_0_35px_rgba(212,175,55,0.4)] cursor-pointer"
          >
            Submit Venue Inquiry
          </button>

          <p className="mt-6 text-xs text-zinc-500 font-sans tracking-wider font-light">
            21+ Guests Only · In-house sound & security included with all rentals
          </p>
        </div>
      </section>

      {/* INQUIRE MODAL */}
      <InquireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
