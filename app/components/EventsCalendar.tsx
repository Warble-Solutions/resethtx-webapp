'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, Clock } from 'lucide-react'
import { formatTime } from '../utils/format'
import EventCard from './EventCard'

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    end_time?: string | null
    image_url: string | null
    featured_image_url?: string | null
    description?: string | null
    section_name?: string
    category?: string
    ticket_price?: number
    [key: string]: any
}

function safeExtractDateParts(dateStr: string): [number, number, number] | null {
    if (!dateStr) return null
    try {
        const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.trim()
        const parts = cleanStr.split('-').map(Number)
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
            return [parts[0], parts[1], parts[2]]
        }
        return null
    } catch {
        return null
    }
}

export default function EventsCalendar({
    events,
    onEventClick
}: {
    events: Event[]
    onEventClick?: (events: Event[]) => void
}) {
    const [currentDate, setCurrentDate] = useState(() => {
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
        const upcoming = [...events]
            .filter(e => (e.date ? e.date.slice(0, 10) >= todayStr : false))
            .sort((a, b) => a.date.localeCompare(b.date))
        if (upcoming.length > 0) {
            const parts = safeExtractDateParts(upcoming[0].date)
            if (parts) {
                return new Date(parts[0], parts[1] - 1, 1)
            }
        }
        return new Date()
    })

    const [selectedDate, setSelectedDate] = useState(() => {
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
        const upcoming = [...events]
            .filter(e => (e.date ? e.date.slice(0, 10) >= todayStr : false))
            .sort((a, b) => a.date.localeCompare(b.date))
        if (upcoming.length > 0) {
            const parts = safeExtractDateParts(upcoming[0].date)
            if (parts) {
                return new Date(parts[0], parts[1] - 1, parts[2])
            }
        }
        return new Date()
    })

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
        setCurrentDate(newDate)
    }

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()
    const year = currentDate.getFullYear()

    const getEventsForDay = (day: number) => {
        const targetYear = currentDate.getFullYear()
        const targetMonth = currentDate.getMonth() + 1
        return events.filter(e => {
            const parts = safeExtractDateParts(e.date)
            if (!parts) return false
            return parts[0] === targetYear && parts[1] === targetMonth && parts[2] === day
        })
    }

    const selectedEvents = events.filter(e => {
        const parts = safeExtractDateParts(e.date)
        if (!parts) return false
        return (
            parts[0] === selectedDate.getFullYear() &&
            parts[1] === selectedDate.getMonth() + 1 &&
            parts[2] === selectedDate.getDate()
        )
    })

    const selectedDateDisplay = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    })

    // Dynamic Category Extraction
    const getVisibleCategories = () => {
        const targetYear = currentDate.getFullYear()
        const targetMonth = currentDate.getMonth() + 1
        const relevantEvents = events.filter(e => {
            const parts = safeExtractDateParts(e.date)
            if (!parts) return false
            return parts[0] === targetYear && parts[1] === targetMonth
        })
        const categories = Array.from(new Set(relevantEvents.map(e => e.category))).filter(Boolean) as string[]
        return categories.length > 0 ? categories : ['Nightlife', 'Live Music', 'Happy Hour']
    }

    const displayedCategories = getVisibleCategories()

    return (
        <section className="bg-[#050505] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/20 relative overflow-hidden">
            {/* Ambient Gold Halo Aura */}
            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-[#D4AF37]/8 blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">

                {/* --- LEFT COLUMN: HAUTE EDITORIAL INTRO --- */}
                <div className="lg:w-1/3 flex flex-col justify-between pt-2">
                    <div>
                        {/* Chapter Stamp */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4 backdrop-blur-md">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>CHAPTER // 01 · THE AGENDA</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.02] mb-5 text-white font-heading tracking-tight drop-shadow-xl">
                            Plan Your <br />
                            <span className="gold-gradient-text">
                                Night Out
                            </span>
                        </h2>

                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-sm font-sans mb-8 font-light">
                            From golden-hour happy hours and craft cocktail tastings to late-night headliner DJ sets under the stars.
                        </p>

                        {/* Program Category Pills */}
                        <div className="space-y-3 font-sans mb-8">
                            <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-mono font-semibold">WEEKLY RESIDENCIES</div>
                            <div className="flex flex-wrap gap-2">
                                {displayedCategories.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0a0c] border border-[#D4AF37]/25 text-xs text-zinc-200 font-medium hover:border-[#D4AF37] transition-colors"
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${idx % 2 === 0 ? 'bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]' : 'bg-white'}`} />
                                        <span>{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Link to Full Events */}
                    <div className="pt-6 border-t border-white/10 hidden lg:block">
                        <Link
                            href="/events"
                            className="btn-gold-shimmer inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold"
                        >
                            <span>Explore Full Calendar</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ARCHITECTURAL CALENDAR MATRIX --- */}
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-mono">SCHEDULE MATRIX</span>
                            <h3 className="text-2xl md:text-3xl text-white font-bold tracking-wider font-heading">
                                {monthName} <span className="gold-gradient-text">{year}</span>
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 font-sans">
                            <button
                                onClick={() => changeMonth(-1)}
                                aria-label="Previous Month"
                                className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-[#0a0a0c] hover:bg-black rounded-full cursor-pointer shadow-lg"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                aria-label="Next Month"
                                className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-[#0a0a0c] hover:bg-black rounded-full cursor-pointer shadow-lg"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-[#D4AF37]/20 mb-3 font-sans">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-[10px] md:text-xs text-[#D4AF37] uppercase tracking-[0.2em] text-center py-2.5 font-bold">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day Matrix Frame */}
                    <div className="grid grid-cols-7 auto-rows-[1fr] border-l border-t border-[#D4AF37]/25 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square border-r border-b border-white/5 bg-black/80" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const dayEvents = getEventsForDay(day)
                            const hasEvents = dayEvents.length > 0

                            const isSelected = selectedDate.getDate() === day &&
                                selectedDate.getMonth() === currentDate.getMonth() &&
                                selectedDate.getFullYear() === currentDate.getFullYear()

                            return (
                                <div
                                    key={day}
                                    onClick={() => {
                                        const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                                        setSelectedDate(newSelected)
                                        if (hasEvents) {
                                            onEventClick?.(dayEvents)
                                        }
                                    }}
                                    className={`
                                        relative aspect-square border-r border-b border-[#D4AF37]/15 group overflow-hidden cursor-pointer transition-all duration-300
                                        ${isSelected ? 'bg-[#D4AF37]/15 ring-2 ring-[#D4AF37] z-20 shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-[#0a0a0d] hover:bg-zinc-900'}
                                    `}
                                >
                                    <span className={`absolute top-1.5 left-2 md:top-2.5 md:left-3 text-[11px] md:text-xs font-sans font-bold z-20 transition-colors ${isSelected ? 'text-[#D4AF37] font-black' : 'text-zinc-300 group-hover:text-white drop-shadow-md'}`}>
                                        {day}
                                    </span>

                                    {/* --- MOBILE VIEW: INDICATOR DOTS --- */}
                                    <div className="md:hidden w-full h-full flex items-center justify-center">
                                        {hasEvents && (
                                            <div className="flex gap-1 justify-center mt-3">
                                                {dayEvents.slice(0, 3).map((_, idx) => (
                                                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* --- DESKTOP VIEW: POSTER THUMBNAILS --- */}
                                    <div className="hidden md:flex w-full h-full absolute inset-0">
                                        {hasEvents ? (
                                            dayEvents.length === 1 ? (
                                                <div className="relative w-full h-full cursor-pointer group/item">
                                                    {dayEvents[0].image_url && (
                                                        <Image
                                                            src={dayEvents[0].image_url}
                                                            alt={dayEvents[0].title}
                                                            fill
                                                            className="w-full h-full object-cover object-top opacity-90 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-500"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                                    <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10">
                                                        <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] mb-0.5 truncate font-sans font-extrabold drop-shadow-md">
                                                            {formatTime(dayEvents[0].time)}
                                                        </p>
                                                        <p className="text-[11px] font-bold text-white leading-tight line-clamp-2 font-heading drop-shadow-md">
                                                            {dayEvents[0].title}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                dayEvents.slice(0, 2).map((ev) => (
                                                    <div key={ev.id} className="relative w-1/2 h-full cursor-pointer group/item border-r border-black last:border-r-0">
                                                        {ev.image_url && (
                                                            <Image
                                                                src={ev.image_url}
                                                                alt={ev.title}
                                                                fill
                                                                className="w-full h-full object-cover object-center opacity-90 group-hover/item:opacity-100 transition-all duration-500"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                                                        <div className="absolute bottom-1 left-1 right-1 z-10">
                                                            <p className="text-[8px] uppercase tracking-wider text-[#D4AF37] truncate font-sans font-bold drop-shadow-md">
                                                                {formatTime(ev.time)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        ) : (
                                            <div className="w-full h-full hover:bg-white/5 transition-colors cursor-default" />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile Link to Full Events */}
                    <div className="mt-5 text-center lg:hidden">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37] hover:text-white transition-colors"
                        >
                            <span>Explore Full Calendar & Tickets</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- MOBILE ONLY: SELECTED DAY EVENT CARDS --- */}
            <div className="md:hidden mt-8 pt-8 border-t border-white/10 max-w-7xl mx-auto">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 font-heading">
                    Events for <span className="text-[#D4AF37]">{selectedDateDisplay}</span>
                </h3>

                <div className="flex flex-col gap-4">
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map(event => (
                            <div key={event.id} onClick={() => onEventClick?.([event])} className="cursor-pointer">
                                <EventCard
                                    title={event.title}
                                    date={new Date(event.date.slice(0, 10) + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    time={event.time || ''}
                                    endTime={event.end_time}
                                    description={event.description || ''}
                                    imageUrl={event.image_url || ''}
                                    price={(event.ticket_price === 0 || !event.ticket_price) ? 'Free' : `$${event.ticket_price}`}
                                    tag={event.category || 'Nightlife'}
                                    link="#"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="py-6 text-center bg-zinc-950 rounded-xl border border-white/5 border-dashed">
                            <p className="text-zinc-500 text-xs">No public events scheduled for this day.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}