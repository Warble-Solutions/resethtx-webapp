'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import EventModal from './EventModal'
import { formatEventTime } from '../utils/format'

// 1. Define the Interface
interface Event {
  id: string
  title: string
  date: string
  time: string | null
  end_time?: string | null
  image_url: string | null
  description: string | null
  tickets: number
  category?: string
  // Allow flexible props since we pass full event object to modal
  [key: string]: any
}

const getMonth = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('default', { month: 'short' }).toUpperCase()
}

const getDay = (dateString: string) => {
  const date = new Date(dateString)
  return date.getDate()
}

// 3. Component
export default function UpcomingEventsSection({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Display only first 3 events
  const featuredEvents = events ? events.slice(0, 3) : []

  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-heading text-5xl md:text-6xl text-white font-bold uppercase tracking-tight leading-none">
            UPCOMING <span className="text-[#D4AF37]">EVENTS</span>
          </h2>
          <Link
            href="/events"
            className="hidden md:inline-block text-[#D4AF37] text-xs font-bold tracking-widest hover:text-white transition-colors font-sans mb-2"
          >
            VIEW ALL -&gt;
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => {
              const dateObj = new Date(event.date)
              const dateStr = dateObj.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })

              return (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event)
                    setIsModalOpen(true)
                  }}
                  className="group relative flex flex-col bg-[#1e293b] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* 1. IMAGE SECTION (Top Half) */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800" />
                    )}

                    {/* Tag Overlay */}
                    <div className="absolute top-4 left-4 bg-[#D4AF37] rounded-full px-3 py-1 z-10 shadow-md">
                      <span className="text-[10px] font-bold text-black uppercase tracking-wider font-sans leading-none block">
                        {event.category || 'Nightlife'}
                      </span>
                    </div>
                  </div>

                  {/* 2. CONTENT SECTION (Bottom Half) */}
                  <div className="flex flex-col flex-grow p-6">

                    {/* Date Line */}
                    <div className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2 font-sans">
                      {dateStr} • {formatEventTime(event.time, event.end_time)}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-heading font-extrabold text-white uppercase leading-tight mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 font-sans mb-6">
                        {event.description}
                      </p>
                    )}

                    {/* Spacer to push footer down */}
                    <div className="flex-grow" />

                    {/* Footer Row */}
                    <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-2 group-hover:border-[#D4AF37]/30 transition-colors">
                      <span className="text-white font-bold font-sans text-lg">$20</span>
                      <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest font-sans group-hover:text-white transition-colors">
                        DETAILS -&gt;
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-3 text-center py-20 bg-[#1e293b] rounded-xl border border-white/5">
              <p className="text-slate-400 font-sans tracking-widest text-sm uppercase">No upcoming events found.</p>
            </div>
          )}
        </div>

        {/* Mobile View All Link */}
        <div className="md:hidden mt-10 text-center">
          <Link
            href="/events"
            className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold border-b border-[#D4AF37] pb-1"
          >
            view all events
          </Link>
        </div>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />

      </div>
    </section>
  )
}