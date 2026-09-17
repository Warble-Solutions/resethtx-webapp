'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns'
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  List as ListIcon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Crown
} from 'lucide-react'
import EventModal from '../components/EventModal'
import { formatEventTime, isEventPastOrEnded } from '../utils/format'

interface Event {
  id: string
  title: string
  date: string
  time: string | null
  end_time?: string | null
  image_url: string | null
  featured_image_url?: string | null
  description: string | null
  featured_description?: string
  tickets: number
  is_external_event?: boolean
  external_url?: string
  ticket_price?: number
  ticket_capacity?: number
  category?: string
  is_sold_out?: boolean
}

interface EventsContentProps {
  events: Event[]
}

/**
 * Safely parses any date format (YYYY-MM-DD, ISO string, etc.) into a local Date
 * without RangeError or UTC timezone shifting bugs.
 */
const safeParseEventDate = (dateStr: string | null | undefined): Date => {
  if (!dateStr) return new Date()
  const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.trim()
  const parts = datePart.split('-').map(Number)
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2])
  }
  const fallback = new Date(dateStr)
  return isNaN(fallback.getTime()) ? new Date() : fallback
}

export default function EventsContent({ events }: EventsContentProps) {
  // Default to Calendar view as requested by user ("like before")
  const [viewMode, setViewMode] = useState<'calendar' | 'grid' | 'list'>('calendar')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // 1. Strictly active upcoming events only
  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => !isEventPastOrEnded(event.date, event.time, event.end_time))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [events])

  // 2. Next featured event spotlight (top featured event section)
  const spotlightEvent = upcomingEvents[0] || null

  // 3. Category filtering
  const categoryFilteredEvents = useMemo(() => {
    return upcomingEvents.filter((ev) => {
      if (selectedCategory === 'All') return true
      const cat = (ev.category || '').toLowerCase()
      if (selectedCategory === 'Nightlife') return cat.includes('nightlife') || cat.includes('party') || !cat
      if (selectedCategory === 'Live Music') return cat.includes('live') || cat.includes('r&b') || cat.includes('music')
      if (selectedCategory === 'Happy Hour') return cat.includes('happy') || cat.includes('sunset')
      return true
    })
  }, [upcomingEvents, selectedCategory])

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: upcomingEvents.length,
      Nightlife: upcomingEvents.filter((e) => {
        const cat = (e.category || '').toLowerCase()
        return cat.includes('nightlife') || cat.includes('party') || !cat
      }).length,
      'Live Music': upcomingEvents.filter((e) => {
        const cat = (e.category || '').toLowerCase()
        return cat.includes('live') || cat.includes('r&b') || cat.includes('music')
      }).length,
      'Happy Hour': upcomingEvents.filter((e) => {
        const cat = (e.category || '').toLowerCase()
        return cat.includes('happy') || cat.includes('sunset')
      }).length,
    }
  }, [upcomingEvents])

  // 4. Calendar state and dates
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (upcomingEvents.length > 0) {
      const d = safeParseEventDate(upcomingEvents[0].date)
      return new Date(d.getFullYear(), d.getMonth(), 1)
    }
    return new Date()
  })

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1))
  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1))

  const getEventsForDay = (day: Date) => {
    return events.filter((e) => isSameDay(safeParseEventDate(e.date), day))
  }

  // Format date helper using safe parser
  const getFormattedEventDate = (dateStr: string) => {
    const d = safeParseEventDate(dateStr)
    return format(d, 'EEEE, MMMM d, yyyy')
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ========================================================================= */}
      {/* 1. TOP FEATURED EVENT SPOTLIGHT SECTION */}
      {/* ========================================================================= */}
      {spotlightEvent && (
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-zinc-950/90 shadow-[0_15px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-[#D4AF37] group">
          <div className="relative h-[380px] sm:h-[400px] md:h-[440px] w-full overflow-hidden">
            {/* Background Image */}
            {spotlightEvent.image_url ? (
              <Image
                src={spotlightEvent.featured_image_url || spotlightEvent.image_url}
                alt={spotlightEvent.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#0e0e12]" />
            )}

            {/* Dark Opulent Vignettes & Gradients */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

            {/* Spotlight Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end z-10">
              
              {/* Badge Row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Event
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  {spotlightEvent.category || 'Curated Nightlife'}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white tracking-tight leading-[1.05] mb-3 drop-shadow-2xl">
                {spotlightEvent.title}
              </h2>

              {/* Details Pill (Date & Time) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-300 font-sans mb-3.5">
                <span className="inline-flex items-center gap-1.5 text-white font-medium">
                  <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
                  {getFormattedEventDate(spotlightEvent.date)}
                </span>
                <span className="hidden sm:inline text-zinc-600">✦</span>
                <span className="inline-flex items-center gap-1.5 text-white font-medium">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  {formatEventTime(spotlightEvent.time, spotlightEvent.end_time)}
                </span>
                {spotlightEvent.ticket_price ? (
                  <>
                    <span className="hidden sm:inline text-zinc-600">✦</span>
                    <span className="text-[#D4AF37] font-bold">
                      ${spotlightEvent.ticket_price}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline text-zinc-600">✦</span>
                    <span className="text-[#D4AF37] font-semibold">Free RSVP Available</span>
                  </>
                )}
              </div>

              {/* Description preview */}
              {spotlightEvent.description && (
                <p className="font-sans text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-5 line-clamp-2 font-light">
                  {spotlightEvent.description}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setSelectedEvent(spotlightEvent)}
                  className="bg-[#D4AF37] hover:bg-white text-black font-bold py-3 px-8 rounded-full text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(212,175,55,0.35)] text-center cursor-pointer"
                >
                  {spotlightEvent.is_sold_out ? 'Sold Out' : 'Reserve Entry / Tickets'}
                </button>
                <button
                  onClick={() => setSelectedEvent(spotlightEvent)}
                  className="border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white font-bold py-3 px-7 rounded-full text-xs uppercase tracking-[0.2em] transition-all text-center cursor-pointer backdrop-blur-sm"
                >
                  Experience Details
                </button>
                <Link
                  href="/reservations"
                  className="hidden md:inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 transition-colors ml-auto"
                >
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  VIP Table Booking
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SCHEDULE TOOLBAR (Title, Month Nav & View Switcher) */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-white/10 pt-2">
        
        {/* Left: Section title & Month Navigation */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] block">
              Midtown Houston Schedule
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white tracking-tight leading-none">
              {viewMode === 'calendar' ? format(currentMonth, 'MMMM yyyy') : 'All Upcoming Residencies'}
            </h2>
          </div>

          {/* Month Switcher Controls */}
          {viewMode === 'calendar' && (
            <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-full border border-white/15 ml-0 sm:ml-2">
              <button
                onClick={prevMonth}
                aria-label="Previous Month"
                className="p-1 hover:text-[#D4AF37] transition-colors rounded-full cursor-pointer text-zinc-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-heading text-xs sm:text-sm font-bold uppercase text-white tracking-wider px-1">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={nextMonth}
                aria-label="Next Month"
                className="p-1 hover:text-[#D4AF37] transition-colors rounded-full cursor-pointer text-zinc-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: View Mode Switcher */}
        <div className="inline-flex items-center self-start md:self-center p-1 bg-zinc-950 rounded-full border border-white/15 shadow-inner">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips for Grid & List views */}
      {viewMode !== 'calendar' && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          {(['All', 'Nightlife', 'Live Music', 'Happy Hour'] as const).map((cat) => {
            const count = categoryCounts[cat]
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CALENDAR VIEW (With Full Event Posters Filling the Day Cells) */}
      {/* ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/90 shadow-2xl overflow-x-auto animate-in fade-in duration-300">
          <div className="min-w-[720px] md:min-w-full">
            
            {/* Weekday Header Row */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-zinc-900/90">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="py-2.5 text-center font-bold text-zinc-400 text-[11px] sm:text-xs tracking-[0.2em] uppercase border-r border-white/5 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 7-Day Month Grid: Proportional cell heights so posters look balanced */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day) => {
                const dayEvents = getEventsForDay(day)
                const isCurrent = isSameMonth(day, currentMonth)
                const today = isToday(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-[13.5vh] min-h-[115px] sm:min-h-[125px] max-h-[150px] flex flex-col border-b border-r border-white/10 relative transition-colors ${
                      !isCurrent ? 'bg-black/60 opacity-35' : 'bg-[#08080a]'
                    }`}
                  >
                    {/* Date Badge: Top Right */}
                    <div className="absolute top-1.5 right-1.5 z-20 pointer-events-none">
                      <span
                        className={`text-[10px] sm:text-xs font-bold flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md ${
                          today
                            ? 'bg-[#D4AF37] text-black font-extrabold shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                            : 'bg-black/75 backdrop-blur-md text-white border border-white/20'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>

                    {/* Day Events: Full Poster filling the day block */}
                    <div className="flex-1 flex flex-col w-full h-full">
                      {dayEvents.length > 0 ? (
                        dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="relative flex-1 w-full h-full overflow-hidden group cursor-pointer border-t border-white/10 first:border-t-0 hover:z-10"
                          >
                            {ev.image_url ? (
                              <Image
                                src={ev.image_url}
                                alt={ev.title}
                                fill
                                className="object-cover opacity-85 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-zinc-900" />
                            )}

                            {/* Sleek bottom overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent flex flex-col justify-end p-1.5 sm:p-2 pointer-events-none">
                              <span className="text-[#D4AF37] text-[9px] sm:text-[10px] font-bold uppercase block leading-none mb-0.5 truncate drop-shadow">
                                {formatEventTime(ev.time, ev.end_time)}
                              </span>
                              <p className="font-heading text-[10px] sm:text-xs font-bold text-white truncate w-full leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                {ev.title}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {categoryFilteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryFilteredEvents.map((event) => {
                const eventDate = safeParseEventDate(event.date)
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="group bg-zinc-950/80 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-[#D4AF37]/70 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container with Date Pill */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                        {event.image_url ? (
                          <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                            Reset HTX
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                        {/* Floating Date Badge */}
                        <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 text-white px-2.5 py-1 rounded-xl text-center shadow-lg">
                          <span className="block text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">
                            {format(eventDate, 'MMM')}
                          </span>
                          <span className="block text-lg font-heading font-bold leading-none">
                            {format(eventDate, 'd')}
                          </span>
                        </div>

                        {/* Category badge */}
                        <div className="absolute bottom-2.5 left-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[#D4AF37]">
                            {event.category || 'Curated Nightlife'}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1.5 font-sans">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{formatEventTime(event.time, event.end_time)}</span>
                        </div>

                        <h3 className="text-lg font-heading font-bold text-white leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-zinc-400 text-xs font-sans line-clamp-2 leading-relaxed font-light">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-5 pt-0">
                      <div className="flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-zinc-300 text-xs font-medium font-sans">
                          {event.is_sold_out ? (
                            <span className="text-red-400 font-bold">Sold Out</span>
                          ) : event.ticket_price ? (
                            <span className="text-[#D4AF37] font-bold">${event.ticket_price}</span>
                          ) : (
                            <span className="text-zinc-400">RSVP Available</span>
                          )}
                        </span>
                        <span className="text-white group-hover:text-[#D4AF37] font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl text-zinc-500 text-xs">
              No upcoming experiences in this category. Switch category or view the calendar.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LIST VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-3.5 animate-in fade-in duration-300">
          {categoryFilteredEvents.length > 0 ? (
            categoryFilteredEvents.map((event) => {
              const eventDate = safeParseEventDate(event.date)
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="group flex flex-col md:flex-row items-stretch md:items-center gap-5 bg-zinc-950/80 border border-zinc-800/80 p-4 sm:p-5 rounded-2xl hover:border-[#D4AF37]/60 transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] cursor-pointer"
                >
                  {/* Date Column */}
                  <div className="shrink-0 w-full md:w-24 h-16 md:h-24 bg-black/70 rounded-xl flex md:flex-col items-center justify-center gap-2 md:gap-0 border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors">
                    <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest font-sans">
                      {format(eventDate, 'MMM')}
                    </span>
                    <span className="text-2xl font-heading font-bold text-white leading-none">
                      {format(eventDate, 'd')}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider hidden md:block">
                      {format(eventDate, 'EEE')}
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative w-full md:w-36 h-36 md:h-24 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                        Reset HTX
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="flex-1">
                    <div className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span>{event.category || 'Curated Nightlife'}</span>
                      {event.is_sold_out && (
                        <span className="bg-red-500/20 border border-red-500/40 text-red-400 px-2 py-0.5 rounded text-[10px]">
                          SOLD OUT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase mb-1 font-sans">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{formatEventTime(event.time, event.end_time)}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-zinc-400 text-xs sm:text-sm font-sans line-clamp-1 font-light">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex items-center justify-end w-full md:w-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                      }}
                      className="w-full md:w-auto bg-[#D4AF37] text-black hover:bg-white font-bold py-2.5 px-6 rounded-full transition-all text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    >
                      {event.ticket_price ? `Tickets $${event.ticket_price}` : 'RSVP Now'}
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl text-zinc-500 text-xs">
              No upcoming experiences in this category. Switch category or view the calendar.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. VIP BOTTLE SERVICE CONCIERGE CALLOUT */}
      {/* ========================================================================= */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-[#D4AF37]/40 text-center overflow-hidden shadow-2xl mt-8">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Midtown VIP Table Service</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white mb-2">
            Reserve Your Private VIP Skyline Section
          </h3>

          <p className="text-zinc-300 text-xs sm:text-sm font-sans mb-6 max-w-md mx-auto font-light">
            Elevate your evening with dedicated bottle presentations, plush skyline seating, and expedited entry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/reservations"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.18em] text-xs rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              Reserve VIP Table
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 border border-white/20 text-white font-bold uppercase tracking-[0.18em] text-xs rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. EVENT MODAL (Ticket Purchase / RSVP / Details) */}
      {/* ========================================================================= */}
      <EventModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

    </div>
  )
}