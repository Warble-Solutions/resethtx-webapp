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

  // 1. Create the Static Brand Slide
  const staticBaseSlide: BrandSlide = {
    id: 'static-brand-slide',
    type: 'BRAND',
    title: 'Celebrate With Us',
    subtitle: "Reset HTX",
    description: "Now accepting bookings for private parties, corporate events, and special occasions.",
    image_url: '/images/event-1.jpg'
  }

  // 2. Map Events to EventSlides
  const eventSlides: EventSlide[] = events.map(e => ({
    ...e,
    type: 'EVENT' as const
  }))

  // 3. Combine them
  const allSlides: Slide[] = [staticBaseSlide, ...eventSlides]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInquireOpen, setIsInquireOpen] = useState(false)
  const [selectedHeroEvent, setSelectedHeroEvent] = useState<Event | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allSlides.length)
  }, [allSlides.length])

  useEffect(() => {
    if (allSlides.length <= 1) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide, allSlides.length])

  useEffect(() => setIsLoaded(true), [])

  const currentSlide = allSlides[currentIndex]



  const getEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* NETWORK BUG WATERMARK */}
      <div className="absolute top-8 left-8 z-20 opacity-80 mix-blend-overlay pointer-events-none">
        <img src="/logos/r_logo.png" alt="R Logo" className="w-16 md:w-20" />
      </div>

      {/* BACKGROUND */}
      {allSlides.map((slide, index) => {
        // Determine Image Source
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
                  alt="Background"
                  fill
                  className={`object-cover transition-transform duration-10000 ease-linear ${index === currentIndex ? 'scale-110' : 'scale-100'
                    }`}
                  priority={index === 0}
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a]" />
              )}
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/80" />
            </div>
          </div>
        )
      })}

      {/* CONTENT CONTAINER - CENTERED POSITIONING */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4 z-20">
        <div key={currentSlide.id} className="flex flex-col items-center text-center">

          {/* --- BRAND SLIDE CONTENT --- */}
          {currentSlide.type === 'BRAND' && (
            <>
              <div className="flex flex-col items-center justify-end min-h-[300px]">
                <h2 className="font-display text-[#D4AF37] text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {currentSlide.subtitle}
                </h2>
                <h1 className="font-display text-4xl md:text-6xl font-normal text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 uppercase">
                  {currentSlide.title}
                </h1>
                <p className="font-sans text-slate-300 text-lg md:text-xl max-w-xl mb-0 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  {currentSlide.description}
                </p>
              </div>

              {/* BRAND BUTTONS */}
              <div className="flex gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <button
                  onClick={() => setIsInquireOpen(true)}
                  className="font-sans bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-widest text-sm uppercase inline-block"
                >
                  Plan Your Event
                </button>
              </div>
            </>
          )}

          {/* --- EVENT SLIDE CONTENT --- */}
          {currentSlide.type === 'EVENT' && (
            <>
              <div className="flex flex-col items-center justify-end min-h-[300px]">
                <h2 className="font-display text-[#D4AF37] text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {currentSlide.category || 'NIGHTLIFE'}
                </h2>
                <h1 className="font-display text-4xl md:text-6xl font-normal text-white mb-6 leading-tight tracking-tight uppercase drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {currentSlide.title}
                </h1>

                <div className="font-sans flex flex-col md:flex-row items-center gap-2 md:gap-6 text-slate-200 text-lg md:text-xl font-light tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                  <span className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">🗓</span> {getEventDate(currentSlide.date)}
                  </span>
                  <span className="hidden md:inline w-1 h-1 bg-slate-500 rounded-full"></span>
                  <span className="flex items-center gap-2">
                    <span className="text-[#D4AF37]">⏰</span> {formatEventTime(currentSlide.time, currentSlide.end_time)}
                  </span>
                </div>

                {currentSlide.description && (
                  <p className="font-sans text-slate-300 max-w-xl text-sm md:text-base leading-relaxed mb-0 line-clamp-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 hidden md:block">
                    {currentSlide.description}
                  </p>
                )}
              </div>

              {/* EVENT BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                {/* Primary: Get Tickets */}
                <Link
                  href={`/events/${currentSlide.id}#tickets`}
                  className="font-sans bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] uppercase tracking-widest text-sm text-center flex items-center justify-center"
                >
                  Get Tickets
                </Link>

                {/* Secondary: View Details */}
                <button
                  onClick={() => setSelectedHeroEvent(currentSlide as unknown as Event)}
                  className="px-8 py-3 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full text-sm text-center flex items-center justify-center"
                >
                  View Details
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {allSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-16 bg-[#D4AF37]' : 'w-4 bg-white/20 hover:bg-white'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

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