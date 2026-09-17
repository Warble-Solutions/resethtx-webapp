'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
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
    const matching = events.filter((ev) => {
      const title = (ev.title || '').toLowerCase()
      const cat = (ev.category || '').toLowerCase()
      return prog.queryKeywords.some((kw) => title.includes(kw) || cat.includes(kw))
    })

    const activeFutureMatches = matching
      .filter((ev) => !isEventPastOrEnded(ev.date, ev.time, ev.end_time))
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))

    const bestEvent = activeFutureMatches.length > 0 ? activeFutureMatches[0] : null
    const upcomingFallbackDate = getNextWeekdayDate(prog.day)

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

    return { prog, bestEvent, eventPayload, cardImage, displayTime, priceDisplay }
  })

  const handleCardClick = (item: typeof programCards[0]) => {
    if (onEventClick) onEventClick(item.eventPayload)
  }

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
              CHAPTER // 03
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white">
              Weekly <span className="gold-gradient-text">Residencies</span>
            </h2>
          </div>
          <Link
            href="/events"
            className="btn-gold-shimmer inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            <span>Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory custom-scrollbar -mx-4 px-4">
          {programCards.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(item)}
              className="shrink-0 w-[280px] sm:w-[300px] snap-start flex flex-col rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(10,10,12,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Image */}
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={item.cardImage}
                  alt={item.prog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                  sizes="300px"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 50%)' }} />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: '#D4AF37', color: '#000' }}>
                    {item.prog.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    {item.prog.day}
                  </span>
                </div>

                {/* Title overlaid at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-heading text-base font-bold text-white uppercase group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {item.prog.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider font-sans mb-2">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.displayTime}</span>
                </div>
                <p className="text-zinc-400 text-[11px] font-sans leading-relaxed line-clamp-2 font-light mb-3 flex-1">
                  {item.prog.description}
                </p>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-white font-bold font-sans text-[11px] uppercase tracking-wider">{item.priceDisplay}</span>
                  <span className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                    RSVP →
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="w-4 shrink-0" />
        </div>
      </div>
    </section>
  )
}
