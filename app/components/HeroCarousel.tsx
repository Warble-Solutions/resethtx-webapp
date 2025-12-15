'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  time: string
  image_url: string | null
  description: string | null
}

export default function HeroCarousel({ events }: { events: Event[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Cycle through events every 2.5 seconds
  useEffect(() => {
    if (events.length <= 1) return // Don't cycle if only 1 event

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [events.length])

  const currentEvent = events[currentIndex]
  
  // Format Date & Time for display
  const eventDate = new Date(currentEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  // Handle time formatting safely
  let timeDisplay = "7:00 PM"
  if (currentEvent.time) {
      const [h, m] = currentEvent.time.split(':')
      const hour = parseInt(h)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
      timeDisplay = `${displayHour}:${m} ${ampm}`
  }

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden group bg-black">
      
      {/* 1. BACKGROUND IMAGES (Stacked for Crossfade) */}
      {events.map((event, index) => (
        <div 
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/30" />
        </div>
      ))}

      {/* 2. TEXT CONTENT (Z-Index higher than backgrounds) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 mt-20">
        <div className="max-w-3xl">
            {/* Tagline */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] tracking-[0.3em] font-bold text-xs md:text-sm uppercase animate-fade-in">
                    Featured Event
                </span>
            </div>

            {/* Title - Key change forces simple fade animation on text switch */}
            <div key={currentEvent.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-6 leading-[0.9] uppercase drop-shadow-2xl">
                {currentEvent.title}
                </h1>

                <p className="text-slate-200 text-lg md:text-xl mb-8 font-sans max-w-xl border-l-2 border-[#D4AF37] pl-6 py-2 bg-black/30 backdrop-blur-sm">
                    {eventDate} @ {timeDisplay} <br />
                    <span className="text-sm text-slate-400 mt-1 block">
                        {currentEvent.description ? currentEvent.description.slice(0, 100) + '...' : ''}
                    </span>
                </p>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Link 
                        href={`/events`} // Or link to specific booking page
                        className="bg-[#D4AF37] text-black font-bold px-10 py-4 uppercase tracking-[0.2em] text-center hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    >
                        Get Tickets
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* 3. PROGRESS INDICATORS (Optional: Shows which slide is active) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {events.map((_, idx) => (
              <button 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 transition-all duration-500 rounded-full ${
                      idx === currentIndex ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/30 hover:bg-white'
                  }`} 
              />
          ))}
      </div>

    </section>
  )
}