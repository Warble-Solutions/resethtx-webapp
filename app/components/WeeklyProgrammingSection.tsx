'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import { formatEventTime, isEventPastOrEnded } from '../utils/format'

interface Event {
  id: string
  title: string
  date: string
  time: string | null
  end_time?: string | null
  image_url: string | null
  category?: string
  ticket_price?: number
  description?: string | null
  [key: string]: any
}

interface WeeklyProgrammingSectionProps {
  events?: Event[]
  onEventClick?: (event: Event) => void
}

interface ProgramConfig {
  day: string
  title: string
  badge: string
  defaultTime: string
  genre: string
  description: string
  defaultImage: string
  queryKeywords: string[]
}

const PROGRAM_DEFS: ProgramConfig[] = [
  {
    day: "Wednesday",
    title: "Sunset Golden Hour",
    badge: "Happy Hour",
    defaultTime: "4:00 PM – 8:00 PM",
    genre: "Top 40 & Global",
    description: "Half-priced craft cocktails, shareable small plates, and panoramic sunset skyline views.",
    defaultImage: "https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/1784146416403.jpg",
    queryKeywords: ["happy hour"]
  },
  {
    day: "Thursday",
    title: "Midtown Social",
    badge: "After-Work",
    defaultTime: "4:00 PM – 10:00 PM",
    genre: "Deep Grooves",
    description: "The preferred after-work destination for corporate mixers, client dinners, and skyline cocktails.",
    defaultImage: "https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/1772671983444.jpg",
    queryKeywords: ["midtown social", "meet me upstairs", "after-work"]
  },
  {
    day: "Friday",
    title: "The Friday Exchange",
    badge: "Nightlife",
    defaultTime: "10:30 PM – 2:00 AM",
    genre: "Hip-Hop & House",
    description: "Houston's premier weekend kickoff. International guest DJs, VIP bottle service, and rooftop energy.",
    defaultImage: "https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/1783550034377.jpg",
    queryKeywords: ["friday exchange"]
  },
  {
    day: "Saturday",
    title: "Skyline Saturdays",
    badge: "Nightlife",
    defaultTime: "9:00 PM – 2:00 AM",
    genre: "Open Format",
    description: "High-energy dual-level rooftop party. Birthday buyouts, bottle presentations, and skyline views.",
    defaultImage: "https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/1789487403480.jpg",
    queryKeywords: ["waistline", "sauna", "skyline"]
  },
  {
    day: "Sunday",
    title: "R&B Sundays",
    badge: "Live Music",
    defaultTime: "7:00 PM – 11:00 PM",
    genre: "Live R&B & Soul",
    description: "Houston's favorite soulful rooftop lounge. Live acoustic vocalists, smooth classics, and sunset unwinds.",
    defaultImage: "https://yhmvfouigexsqnxccpah.supabase.co/storage/v1/object/public/images/1783561721406.jpg",
    queryKeywords: ["r&b sundays", "reset sundays", "sunday"]
  }
]

// Helper to compute next upcoming date for a given weekday name
function getNextWeekdayDate(dayName: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const targetDay = days.indexOf(dayName)
  const nowHoustonStr = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
  const now = new Date(nowHoustonStr)
  let diff = (targetDay - now.getDay() + 7) % 7
  if (diff === 0) diff = 7
  const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff)
  return nextDate.toISOString().slice(0, 10)
}

export default function WeeklyProgrammingSection({
  events = [],
  onEventClick
}: WeeklyProgrammingSectionProps) {

  const programCards = PROGRAM_DEFS.map((prog, index) => {
    // 1. Find all matching database events
    const matching = events.filter((ev) => {
      const title = (ev.title || '').toLowerCase()
      const cat = (ev.category || '').toLowerCase()
      return prog.queryKeywords.some((kw) => title.includes(kw) || cat.includes(kw))
    })

    // 2. Select ONLY active upcoming events (strictly filter out any events that have already ended)
    const activeFutureMatches = matching
      .filter((ev) => !isEventPastOrEnded(ev.date, ev.time, ev.end_time))
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))

    const bestEvent = activeFutureMatches.length > 0 ? activeFutureMatches[0] : null
    const upcomingFallbackDate = getNextWeekdayDate(prog.day)

    // 3. Prepare concrete single event payload for EventModal (guarantees detailed view & active booking flow)
    const eventPayload: Event = bestEvent ? {
      ...bestEvent,
      title: bestEvent.title || prog.title,
      image_url: bestEvent.image_url || prog.defaultImage,
      category: bestEvent.category || prog.badge,
      description: bestEvent.description || prog.description,
      time: bestEvent.time || (prog.defaultTime.includes('–') ? prog.defaultTime.split('–')[0].trim() : "19:00:00"),
    } : {
      id: `prog-${index}`,
      title: prog.title,
      date: upcomingFallbackDate,
      time: prog.defaultTime.includes('–') ? prog.defaultTime.split('–')[0].trim() : "19:00:00",
      end_time: prog.defaultTime.includes('–') ? prog.defaultTime.split('–')[1].trim() : "02:00:00",
      image_url: prog.defaultImage,
      category: prog.badge,
      ticket_price: 0,
      description: prog.description
    }

    const cardImage = bestEvent?.image_url || prog.defaultImage
    const displayTime = bestEvent?.time ? formatEventTime(bestEvent.time, bestEvent.end_time) : prog.defaultTime
    const priceDisplay = (bestEvent?.ticket_price === 0 || !bestEvent?.ticket_price) ? "Free RSVP" : `$${bestEvent.ticket_price}`

    return {
      prog,
      bestEvent,
      eventPayload,
      cardImage,
      displayTime,
      priceDisplay
    }
  })

  const handleCardClick = (item: typeof programCards[0]) => {
    if (onEventClick) {
      onEventClick(item.eventPayload)
    }
  }

  return (
    <section className="py-24 md:py-28 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] mb-4">
              <Calendar className="w-3.5 h-3.5" />
              Weekly Programs & Residencies
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-white leading-tight">
              Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F0DEAA] to-[#D4AF37]">Residencies</span>
            </h2>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors group"
          >
            <span>View Full Monthly Schedule</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5 PROGRAM CARDS WITH PROGRAM IMAGES & UNIFORM BADGE SIZES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {programCards.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(item)}
              className="group flex flex-col rounded-2xl bg-zinc-950/85 border border-zinc-800/80 hover:border-[#D4AF37]/60 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-xl hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)] justify-between"
            >
              <div>
                {/* 1. PROGRAM IMAGE WITH UNIFORM BADGES */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={item.cardImage}
                    alt={item.prog.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />
                  
                  {/* Top Badges - ALL BADGES STRICTLY UNIFORM EXACT SIZE: w-28 h-7 */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    {/* Category Badge (Exact w-28 h-7) */}
                    <div className="w-28 h-7 flex items-center justify-center rounded-full bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider text-center shadow-lg shrink-0">
                      {item.prog.badge}
                    </div>

                    {/* Day Badge (Exact w-28 h-7) */}
                    <div className="w-28 h-7 flex items-center justify-center rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider text-center shadow-lg shrink-0">
                      {item.prog.day}
                    </div>
                  </div>
                </div>

                {/* 2. CARD BODY */}
                <div className="p-5 flex flex-col">
                  
                  {/* Schedule Time Line */}
                  <div className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-bold uppercase tracking-wider font-sans mb-2">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.displayTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-bold text-white uppercase group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-2 leading-snug">
                    {item.prog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-xs font-sans leading-relaxed line-clamp-2 font-light">
                    {item.prog.description}
                  </p>
                </div>
              </div>

              {/* 3. CARD FOOTER */}
              <div className="p-5 pt-0">
                <div className="pt-3.5 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-white font-bold font-sans text-xs uppercase tracking-wider">
                    {item.priceDisplay}
                  </span>
                  <span className="text-[#D4AF37] group-hover:text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1">
                    <span>Details & RSVP</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
