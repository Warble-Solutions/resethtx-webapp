'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatEventTime } from '../utils/format'
import InquireModal from '@/app/components/InquireModal'
import EventModal from '@/app/components/EventModal'

// Define types for our slides
type SlideType = 'BRAND' | 'EVENT'

interface BaseSlide {
  id: string
  type: SlideType
  image_url: string | null
}

interface BrandSlide extends BaseSlide {
  type: 'BRAND'
  title: string
  subtitle: string
  description: string
  buttonText?: string
  buttonLink?: string
}

interface EventSlide extends BaseSlide {
  type: 'EVENT'
  title: string
  date: string
  time: string | null
  end_time?: string | null
  featured_image_url: string | null
  description: string | null
  category?: string
  // Add fields needed for EventModal compatibility
  ticket_price?: number
  is_external_event?: boolean
  external_url?: string
  featured_description?: string
}

type Slide = BrandSlide | EventSlide

interface Event {
  id: string
  title: string
  date: string
  time: string | null
  end_time?: string | null
  image_url: string | null
  featured_image_url: string | null
  description: string | null
  featured_description?: string
  ticket_price?: number
  is_external_event?: boolean
  external_url?: string
}

interface HeroCarouselProps {
  events: Event[]
  onEventClick?: (event: Event) => void
  onInquire?: () => void
}

export default function HeroCarousel({ events, onEventClick, onInquire }: HeroCarouselProps) {

  // 1. Seven Fixed Banners: 2 original brand slides + 5 weekly program banners
  const fixedSlides: BrandSlide[] = [
    {
      id: 'venue-identity',
      type: 'BRAND',
      title: 'RESET ROOFTOP LOUNGE',
      subtitle: 'Midtown Houston',
      description: 'Craft cocktails, elevated rooftop dining, and panoramic skyline views.',
      image_url: '/images/reset.jpeg',
      buttonText: 'Explore Menu',
      buttonLink: '/menu'
    },
    {
      id: 'static-brand-slide',
      type: 'BRAND',
      title: 'YOUR NEXT EVENT, ELEVATED',
      subtitle: 'Private Events & Buyouts',
      description: 'Boardroom views, not boardrooms. Host client dinners, corporate mixers, and rooftop receptions.',
      image_url: '/private_page/2.jpeg',
      buttonText: 'Venue Rental',
      buttonLink: '/private-events'
    },
    {
      id: 'fixed-wednesday-happy-hour',
      type: 'BRAND',
      title: 'WEDNESDAY HAPPY HOUR',
      subtitle: 'Every Wednesday • 4:00 PM – 8:00 PM',
      description: 'Half-priced signature craft cocktails, chef-curated small plates, and panoramic sunset skyline views.',
      image_url: '/images/event-3.png',
      buttonText: 'Explore Happy Hour',
      buttonLink: '/events'
    },
    {
      id: 'fixed-thursday-house-rooftop',
      type: 'BRAND',
      title: 'HOUSE ON THE ROOFTOP',
      subtitle: 'Every Thursday • 4:00 PM – 12:00 AM',
      description: 'Deep melodic house, global rhythms, elevated mixology, and skyline lounge energy above Midtown.',
      image_url: '/images/event-2.png',
      buttonText: 'Explore Thursday',
      buttonLink: '/events'
    },
    {
      id: 'fixed-friday-exchange',
      type: 'BRAND',
      title: 'THE FRIDAY EXCHANGE',
      subtitle: 'Every Friday • 10:30 PM – 2:00 AM',
      description: 'Houston\'s premier weekend kickoff. Guest headline DJs, VIP bottle presentations, and rooftop energy.',
      image_url: '/images/def_banner.png',
      buttonText: 'Reserve Entry & VIP',
      buttonLink: '/events'
    },
    {
      id: 'fixed-saturday-millennials-only',
      type: 'BRAND',
      title: 'MILLENNIALS ONLY',
      subtitle: 'Every Saturday • 9:00 PM – 2:00 AM',
      description: 'The ultimate 90s & 2000s throwback rooftop experience. Timeless singalong anthems, bottle service, and skyline views.',
      image_url: '/images/event-1.png',
      buttonText: 'Get Tickets & Tables',
      buttonLink: '/events'
    },
    {
      id: 'fixed-sunday-reset-sunday',
      type: 'BRAND',
      title: 'RESET SUNDAYS',
      subtitle: 'Every Sunday • 4:00 PM – 12:00 AM',
      description: 'Houston\'s favorite soulful rooftop day party. Live acoustic R&B vocalists, global sounds, and golden hour vibes.',
      image_url: '/images/16.png',
      buttonText: 'Join The Vibe',
      buttonLink: '/events'
    }
  ]

  // 2. Map up to 3 Featured Events from DB to EventSlides (managed via admin dashboard)
  const eventSlides: EventSlide[] = (events || []).slice(0, 3).map(e => ({
    ...e,
    type: 'EVENT' as const
  }))

  // 3. Combine: 7 Fixed Banners + up to 3 Featured Events from Admin
  const allSlides: Slide[] = [...fixedSlides, ...eventSlides]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInquireOpen, setIsInquireOpen] = useState(false)
  const [selectedHeroEvent, setSelectedHeroEvent] = useState<Event | null>(null)

  // Touch gesture support for mobile swiping
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allSlides.length)
  }, [allSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length)
  }, [allSlides.length])

  useEffect(() => {
    if (allSlides.length <= 1) return

    const duration = currentIndex === 0 ? 8000 : 4000
    const timer = setTimeout(nextSlide, duration)

    return () => clearTimeout(timer)
  }, [nextSlide, allSlides.length, currentIndex])

  useEffect(() => setIsLoaded(true), [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchEndX(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 45
    const isRightSwipe = distance < -45

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  const currentSlide = allSlides[currentIndex]

  const getEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const handleEventSlideClick = (slide: EventSlide) => {
    if (onEventClick) {
      onEventClick(slide as unknown as Event)
    } else {
      setSelectedHeroEvent(slide as unknown as Event)
    }
  }

  return (
    <section
      className="relative h-[100dvh] min-h-[580px] max-h-[1050px] w-full overflow-hidden bg-black flex flex-col justify-between items-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      {/* TOP RIGHT LOGO WATERMARK (Desktop only to prevent clashing with mobile navbar) */}
      <div className="hidden md:block absolute top-8 right-12 z-20 opacity-70 mix-blend-overlay pointer-events-none">
        <img src="/logos/r_logo.png" alt="Reset HTX" className="w-12 md:w-16" />
      </div>

      {/* BACKGROUND SLIDES */}
      {allSlides.map((slide, index) => {
        let bgImage = slide.image_url || ''
        if (slide.type === 'EVENT') {
          bgImage = slide.featured_image_url || slide.image_url || ''
        }

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div className="relative w-full h-full">
              {bgImage ? (
                <Image
                  src={bgImage}
                  alt="Reset HTX Luxury Rooftop"
                  fill
                  className={`object-cover transition-transform duration-10000 ease-linear ${index === currentIndex ? 'scale-105' : 'scale-100'
                    }`}
                  priority={index === 0}
                />
              ) : (
                <div className="w-full h-full bg-[#0d0d0f]" />
              )}
              {/* Luxury gradient overlays: Vignette + bottom shadow */}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/75" />
              <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-black/40 to-black/90 pointer-events-none" />
            </div>
          </div>
        )
      })}

      {/* TOP SAFE SPACING (Below Fixed Navbar) */}
      <div className="pt-20 sm:pt-24 md:pt-28 shrink-0 w-full" />

      {/* CENTER EDITORIAL CONTENT (Centered vertically, responsive padding and fluid typography) */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl px-4 sm:px-6 z-20 text-center my-auto py-2 sm:py-6">
        <div key={currentSlide.id} className="flex flex-col items-center w-full max-w-3xl mx-auto">
          
          {/* Slide Tag / Pill: responsive font, tracking & auto-truncate */}
          <div className="inline-flex max-w-[92vw] items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] sm:text-xs font-semibold sm:font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] mb-3 sm:mb-5 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="shrink-0 font-heading">{currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} // {allSlides.length < 10 ? `0${allSlides.length}` : allSlides.length}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] shrink-0" />
            <span className="truncate">{currentSlide.type === 'EVENT' ? (currentSlide.category || 'FEATURED EVENT') : (currentSlide.subtitle || 'RESET HTX')}</span>
          </div>

          {/* BRAND SLIDE CONTENT */}
          {currentSlide.type === 'BRAND' && (
            <>
              <h1 className="font-heading text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-normal sm:tracking-tight uppercase leading-[1.08] sm:leading-[0.95] mb-3 sm:mb-5 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000">
                {currentSlide.title}
              </h1>

              <p className="font-sans text-zinc-300 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-8 font-light line-clamp-3 sm:line-clamp-none px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-150">
                {currentSlide.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto animate-in fade-in slide-in-from-bottom-9 duration-1000 delay-300">
                {currentSlide.buttonLink ? (
                  <Link
                    href={currentSlide.buttonLink}
                    className="w-full sm:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(212,175,55,0.35)] tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-xs uppercase text-center cursor-pointer"
                  >
                    {currentSlide.buttonText || 'Explore'}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (onInquire) onInquire()
                      else setIsInquireOpen(true)
                    }}
                    className="w-full sm:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(212,175,55,0.35)] tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-xs uppercase text-center cursor-pointer"
                  >
                    Plan Your Event
                  </button>
                )}
                <Link
                  href="/menu"
                  className="w-full sm:w-auto border border-white/25 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-xs uppercase text-center"
                >
                  View Dining Menu
                </Link>
              </div>
            </>
          )}

          {/* EVENT SLIDE CONTENT */}
          {currentSlide.type === 'EVENT' && (
            <>
              <h1 className="font-heading text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-normal sm:tracking-tight uppercase leading-[1.08] sm:leading-[0.95] mb-3 sm:mb-5 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000">
                {currentSlide.title}
              </h1>

              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-zinc-200 text-[11px] sm:text-xs md:text-sm font-sans tracking-wider sm:tracking-widest uppercase mb-3 sm:mb-6 bg-black/60 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full border border-white/15 max-w-[92vw] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                <span className="text-[#D4AF37]">🗓 {getEventDate(currentSlide.date)}</span>
                <span className="text-zinc-600">✦</span>
                <span>⏰ {formatEventTime(currentSlide.time, currentSlide.end_time)}</span>
                {currentSlide.ticket_price ? (
                  <>
                    <span className="text-zinc-600">✦</span>
                    <span className="text-[#D4AF37] font-bold">${currentSlide.ticket_price}</span>
                  </>
                ) : null}
              </div>

              {(currentSlide.featured_description || currentSlide.description) && (
                <p className="font-sans text-zinc-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-5 sm:mb-8 line-clamp-2 font-light px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-150">
                  {currentSlide.featured_description || currentSlide.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto animate-in fade-in slide-in-from-bottom-9 duration-1000 delay-250">
                <button
                  onClick={() => handleEventSlideClick(currentSlide)}
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-white text-black font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(212,175,55,0.35)] tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-xs uppercase cursor-pointer"
                >
                  Get Tickets / RSVP
                </button>
                <button
                  onClick={() => handleEventSlideClick(currentSlide)}
                  className="w-full sm:w-auto border border-white/25 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full transition-all tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-xs uppercase cursor-pointer"
                >
                  Experience Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* LUXURY PREV / NEXT ARROWS (Desktop) */}
      {allSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md items-center justify-center text-white/60 hover:text-white hover:border-[#D4AF37] hover:bg-black/80 transition-all cursor-pointer group"
          >
            <span className="text-xl group-hover:-translate-x-0.5 transition-transform">‹</span>
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md items-center justify-center text-white/60 hover:text-white hover:border-[#D4AF37] hover:bg-black/80 transition-all cursor-pointer group"
          >
            <span className="text-xl group-hover:translate-x-0.5 transition-transform">›</span>
          </button>
        </>
      )}

      {/* MOBILE BOTTOM CONTROLS: Interactive Dots & Slide Count */}
      <div className="sm:hidden z-30 w-full px-4 pb-5 pt-2 shrink-0 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-2 py-1">
          {allSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 h-1.5 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase text-zinc-400 font-sans">
          <span className="text-[#D4AF37] font-semibold">Hours:</span> Wed–Fri 4P–2A · Sat–Sun 2P–2A
        </div>
      </div>

      {/* DESKTOP FLOATING QUICK-FACTS INFORMATION BAR AT BASE OF HERO */}
      <div className="hidden sm:block z-30 w-full bg-black/70 backdrop-blur-md border-t border-white/10 py-3.5 px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-400 font-sans">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold">Hours:</span>
            <span>Wed–Fri 4P–2A · Sat–Sun 2P–2A</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold">Vibe:</span>
            <span>Skyline Views · Craft Cocktails · Elevated Dining</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold">Dress Code:</span>
            <span>Upscale Casual</span>
          </div>
          <div className="flex items-center gap-3">
            {allSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 font-heading text-[11px] font-bold cursor-pointer ${idx === currentIndex ? 'text-[#D4AF37] border-b border-[#D4AF37] pb-0.5' : 'text-zinc-600 hover:text-white'
                  }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <InquireModal
        isOpen={isInquireOpen}
        onClose={() => setIsInquireOpen(false)}
      />

      <EventModal
        event={selectedHeroEvent}
        isOpen={!!selectedHeroEvent}
        onClose={() => setSelectedHeroEvent(null)}
      />

    </section>
  )
}