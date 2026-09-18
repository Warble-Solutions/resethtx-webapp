'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatEventTime } from '../utils/format'
import InquireModal from '@/app/components/InquireModal'
import EventModal from '@/app/components/EventModal'

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

  const fixedSlides: BrandSlide[] = [
    {
      id: 'venue-identity',
      type: 'BRAND',
      title: 'RESET ROOFTOP LOUNGE',
      subtitle: 'Midtown Houston',
      description: 'Craft cocktails, elevated rooftop dining, and panoramic skyline views.',
      image_url: '/images/def_banner.png',
      buttonText: 'Explore Menu',
      buttonLink: '/menu'
    },
    {
      id: 'static-brand-slide',
      type: 'BRAND',
      title: 'YOUR NEXT EVENT, ELEVATED',
      subtitle: 'Private Events & Buyouts',
      description: 'Boardroom views, not boardrooms. Host client dinners, corporate mixers, and rooftop receptions.',
      image_url: '/images/12.png',
      buttonText: 'Venue Rental',
      buttonLink: '/private-events'
    },
    {
      id: 'fixed-wednesday-happy-hour',
      type: 'BRAND',
      title: 'WEDNESDAY HAPPY HOUR',
      subtitle: 'Every Wednesday • 4 PM – 8 PM',
      description: 'Half-priced signature craft cocktails, chef-curated small plates, and panoramic sunset skyline views.',
      image_url: '/images/event-3.png',
      buttonText: 'Explore Happy Hour',
      buttonLink: '/events'
    },
    {
      id: 'fixed-thursday-house-rooftop',
      type: 'BRAND',
      title: 'HOUSE ON THE ROOFTOP',
      subtitle: 'Every Thursday • 4 PM – 12 AM',
      description: 'Deep melodic house, global rhythms, elevated mixology, and skyline lounge energy above Midtown.',
      image_url: '/images/event-2.png',
      buttonText: 'Explore Thursday',
      buttonLink: '/events'
    },
    {
      id: 'fixed-friday-exchange',
      type: 'BRAND',
      title: 'THE FRIDAY EXCHANGE',
      subtitle: 'Every Friday • 10:30 PM – 2 AM',
      description: 'Houston\'s premier weekend kickoff. Guest headline DJs, VIP bottle presentations, and rooftop energy.',
      image_url: '/images/14.png',
      buttonText: 'Reserve Entry & VIP',
      buttonLink: '/events'
    },
    {
      id: 'fixed-saturday-millennials-only',
      type: 'BRAND',
      title: 'MILLENNIALS ONLY',
      subtitle: 'Every Saturday • 9 PM – 2 AM',
      description: 'The ultimate 90s & 2000s throwback rooftop experience. Timeless singalong anthems, bottle service, and skyline views.',
      image_url: '/images/event-1.png',
      buttonText: 'Get Tickets & Tables',
      buttonLink: '/events'
    },
    {
      id: 'fixed-sunday-reset-sunday',
      type: 'BRAND',
      title: 'RESET SUNDAYS',
      subtitle: 'Every Sunday • 4 PM – 12 AM',
      description: 'Houston\'s favorite soulful rooftop day party. Live acoustic R&B vocalists, global sounds, and golden hour vibes.',
      image_url: '/images/16.png',
      buttonText: 'Join The Vibe',
      buttonLink: '/events'
    }
  ]

  const eventSlides: EventSlide[] = (events || []).slice(0, 3).map(e => ({
    ...e,
    type: 'EVENT' as const
  }))

  const allSlides: Slide[] = [...fixedSlides, ...eventSlides]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInquireOpen, setIsInquireOpen] = useState(false)
  const [selectedHeroEvent, setSelectedHeroEvent] = useState<Event | null>(null)
  const [contentVisible, setContentVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Touch gesture support
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const goToSlide = useCallback((idx: number) => {
    setContentVisible(false)
    setTimeout(() => {
      setCurrentIndex(idx)
      setContentVisible(true)
    }, 300)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % allSlides.length)
  }, [currentIndex, allSlides.length, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + allSlides.length) % allSlides.length)
  }, [currentIndex, allSlides.length, goToSlide])

  // Auto-advance timer
  useEffect(() => {
    if (allSlides.length <= 1) return
    if (timerRef.current) clearTimeout(timerRef.current)
    const duration = currentIndex === 0 ? 7000 : 4500
    timerRef.current = setTimeout(nextSlide, duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [nextSlide, allSlides.length, currentIndex])

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
    if (distance > 45) nextSlide()
    else if (distance < -45) prevSlide()
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
      className="relative h-[100dvh] min-h-[550px] max-h-[1000px] w-full overflow-hidden bg-black flex flex-col justify-between items-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      {/* BACKGROUND SLIDES */}
      {allSlides.map((slide, index) => {
        let bgImage = slide.image_url || ''
        if (slide.type === 'EVENT') {
          bgImage = slide.featured_image_url || slide.image_url || ''
        }

        return (
          <div
            key={slide.id}
            className="absolute inset-0"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 10 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <div className="relative w-full h-full">
              {bgImage ? (
                <Image
                  src={bgImage}
                  alt="Reset HTX Luxury Rooftop"
                  fill
                  className="object-cover"
                  style={{
                    filter: 'brightness(1.05) contrast(1.05) saturate(1.15)',
                    transform: index === currentIndex ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 10s ease-out',
                  }}
                  priority={index === 0}
                />
              ) : (
                <div className="w-full h-full bg-[#0d0d0f]" />
              )}
              {/* Subtle dark tint layer across background to ensure high readability */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Gradient overlays for depth, navbar blending, and smooth bottom transition */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.3) 70%, #050505 100%)'
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)'
                }}
              />
            </div>
          </div>
        )
      })}

      {/* TOP SAFE SPACING */}
      <div className="pt-20 sm:pt-24 md:pt-28 shrink-0 w-full" />

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl px-4 sm:px-6 z-20 text-center my-auto py-2 sm:py-4">
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
          className="flex flex-col items-center w-full max-w-3xl mx-auto"
        >

          {/* Slide counter pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 sm:mb-5 shadow-lg"
            style={{ background: 'rgba(0,0,0,0.75)', borderColor: 'rgba(212,175,55,0.45)', color: '#D4AF37', backdropFilter: 'blur(12px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
            <span className="font-mono">{String(currentIndex + 1).padStart(2, '0')} / {String(allSlides.length).padStart(2, '0')}</span>
            <span style={{ color: '#555' }}>·</span>
            <span className="truncate max-w-[180px] sm:max-w-none">
              {currentSlide.type === 'EVENT' ? (currentSlide.category || 'FEATURED EVENT') : (currentSlide.subtitle || 'MIDTOWN HOUSTON')}
            </span>
          </div>

          {/* BRAND SLIDE */}
          {currentSlide.type === 'BRAND' && (
            <>
              <h1
                className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.05] mb-3 sm:mb-4"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.98), 0 2px 10px rgba(0,0,0,0.9)' }}
              >
                {currentSlide.title}
              </h1>

              <p
                className="font-sans text-zinc-100 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-5 sm:mb-7 font-normal line-clamp-3 px-2 sm:px-0"
                style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)' }}
              >
                {currentSlide.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                {currentSlide.buttonLink ? (
                  <Link
                    href={currentSlide.buttonLink}
                    className="w-full sm:w-auto btn-gold-shimmer py-3 sm:py-3.5 px-8 sm:px-10 rounded-full tracking-[0.18em] text-[11px] sm:text-xs uppercase text-center"
                  >
                    {currentSlide.buttonText || 'Explore'}
                  </Link>
                ) : (
                  <button
                    onClick={() => { if (onInquire) onInquire(); else setIsInquireOpen(true) }}
                    className="w-full sm:w-auto btn-gold-shimmer py-3 sm:py-3.5 px-8 sm:px-10 rounded-full tracking-[0.18em] text-[11px] sm:text-xs uppercase text-center cursor-pointer"
                  >
                    Plan Your Event
                  </button>
                )}
                <Link
                  href="/menu"
                  className="w-full sm:w-auto py-3 sm:py-3.5 px-8 sm:px-10 rounded-full tracking-[0.18em] text-[11px] sm:text-xs uppercase text-center font-bold text-white/90 hover:text-[#D4AF37] transition-colors"
                  style={{ background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
                >
                  View Dining Menu
                </Link>
              </div>
            </>
          )}

          {/* EVENT SLIDE */}
          {currentSlide.type === 'EVENT' && (
            <>
              <h1
                className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.05] mb-3 sm:mb-4"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.98), 0 2px 10px rgba(0,0,0,0.9)' }}
              >
                {currentSlide.title}
              </h1>

              <div
                className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-zinc-100 text-[11px] sm:text-xs tracking-widest uppercase mb-3 sm:mb-5 px-4 sm:px-6 py-2 rounded-full max-w-[92vw] shadow-lg"
                style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(212,175,55,0.4)', backdropFilter: 'blur(12px)' }}
              >
                <span className="text-[#D4AF37] font-bold">🗓 {getEventDate(currentSlide.date)}</span>
                <span style={{ color: '#555' }}>·</span>
                <span>⏰ {formatEventTime(currentSlide.time, currentSlide.end_time)}</span>
                {currentSlide.ticket_price ? (
                  <>
                    <span style={{ color: '#555' }}>·</span>
                    <span className="text-[#D4AF37] font-extrabold">${currentSlide.ticket_price}</span>
                  </>
                ) : null}
              </div>

              {(currentSlide.featured_description || currentSlide.description) && (
                <p
                  className="font-sans text-zinc-100 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-5 sm:mb-7 line-clamp-2 font-normal px-2 sm:px-0"
                  style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)' }}
                >
                  {currentSlide.featured_description || currentSlide.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                <button
                  onClick={() => handleEventSlideClick(currentSlide)}
                  className="w-full sm:w-auto btn-gold-shimmer py-3 sm:py-3.5 px-8 sm:px-10 rounded-full tracking-[0.18em] text-[11px] sm:text-xs uppercase cursor-pointer"
                >
                  Get Tickets / RSVP
                </button>
                <button
                  onClick={() => handleEventSlideClick(currentSlide)}
                  className="w-full sm:w-auto py-3 sm:py-3.5 px-8 sm:px-10 rounded-full tracking-[0.18em] text-[11px] sm:text-xs uppercase cursor-pointer text-white/90 font-bold hover:text-[#D4AF37] transition-colors"
                  style={{ background: 'rgba(10,10,12,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
                >
                  Experience Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PREV / NEXT ARROWS (Desktop) */}
      {allSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white cursor-pointer group transition-all"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
          >
            <span className="text-lg group-hover:-translate-x-0.5 transition-transform">‹</span>
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white cursor-pointer group transition-all"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
          >
            <span className="text-lg group-hover:translate-x-0.5 transition-transform">›</span>
          </button>
        </>
      )}

      {/* MOBILE BOTTOM */}
      <div className="sm:hidden z-30 w-full px-4 pb-4 pt-2 shrink-0 flex flex-col items-center gap-1.5" style={{ background: 'linear-gradient(to top, #050505, transparent)' }}>
        <div className="flex items-center justify-center gap-1.5 py-1">
          {allSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="transition-all duration-300 rounded-full cursor-pointer"
              style={{
                width: idx === currentIndex ? '24px' : '6px',
                height: '5px',
                background: idx === currentIndex ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                boxShadow: idx === currentIndex ? '0 0 8px rgba(212,175,55,0.7)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="text-[9px] tracking-[0.15em] uppercase text-zinc-400 font-sans">
          <span className="text-[#D4AF37] font-semibold">Hours:</span> Wed–Fri 4P–2A · Sat–Sun 2P–2A
        </div>
      </div>

      {/* DESKTOP BOTTOM STRIP — minimal, clean */}
      <div className="hidden sm:block z-30 w-full shrink-0 py-3 px-6" style={{ background: 'rgba(5,5,5,0.85)', borderTop: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-sans">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold">Open:</span>
            <span>Wed–Fri 4pm · Sat–Sun 2pm</span>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[#D4AF37] font-semibold">606 Dennis St</span>
            <span>· Midtown Houston</span>
          </div>
          <div className="flex items-center gap-1">
            {allSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all"
                style={{
                  background: idx === currentIndex ? '#D4AF37' : 'transparent',
                  color: idx === currentIndex ? '#000' : '#666',
                  boxShadow: idx === currentIndex ? '0 0 10px rgba(212,175,55,0.4)' : 'none',
                }}
              >
                {String(idx + 1).padStart(2, '0')}
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