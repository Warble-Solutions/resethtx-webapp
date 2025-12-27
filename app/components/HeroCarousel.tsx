'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from './HeroSection'

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
  featured_image_url: string | null
  description: string | null
}

type Slide = BrandSlide | EventSlide

interface Event {
  id: string
  title: string
  date: string
  time: string | null
  image_url: string | null
  featured_image_url: string | null
  description: string | null
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

  // Helper for Event Time Display
  const getEventTime = (timeStr: string | null) => {
    if (!timeStr) return "9:00 PM"
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    return `${displayHour}:${m} ${ampm}`
  }

  const getEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

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
              <h2 className="font-display text-[#D4AF37] text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {currentSlide.subtitle}
              </h2>
              <h1 className="font-display text-4xl md:text-6xl font-normal text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 uppercase">
                {currentSlide.title}
              </h1>
              <p className="font-sans text-slate-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                {currentSlide.description}
              </p>
              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <button
                  onClick={onInquire}
                  className="font-sans bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-widest text-sm uppercase"
                >
                  INQUIRE NOW
                </button>
              </div>
            </>
          )}

          {/* --- EVENT SLIDE CONTENT --- */}
          {currentSlide.type === 'EVENT' && (
            <>


              <h1 className="font-display text-4xl md:text-6xl font-normal text-white mb-6 leading-tight tracking-tight uppercase drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {currentSlide.title}
              </h1>

              <div className="font-sans flex flex-col md:flex-row items-center gap-2 md:gap-6 text-slate-200 text-lg md:text-xl font-light tracking-wide mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <span className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">🗓</span> {getEventDate(currentSlide.date)}
                </span>
                <span className="hidden md:inline w-1 h-1 bg-slate-500 rounded-full"></span>
                <span className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">⏰</span> {getEventTime(currentSlide.time)}
                </span>
              </div>

              {/* Removed description from Featured Event to align visually closer to Brand slide structure if needed, or keep it consistent text-lg */}
              {currentSlide.description && (
                <p className="font-sans text-slate-300 max-w-xl text-sm md:text-base leading-relaxed mb-10 line-clamp-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 hidden md:block">
                  {currentSlide.description}
                </p>
              )}

              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                <button
                  onClick={() => onEventClick?.(currentSlide as unknown as Event)}
                  className="font-sans bg-[#D4AF37] text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] uppercase tracking-widest text-sm"
                >
                  Get Tickets
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

    </section>
  )
}