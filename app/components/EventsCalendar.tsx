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
        <section className="bg-black py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative overflow-hidden">
            {/* Ambient Gold Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14 relative z-10">

                {/* --- LEFT COLUMN: LEGEND & TITLE --- */}
                <div className="lg:w-1/3 flex flex-col justify-between pt-2">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-3">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>Rooftop Calendar</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-none mb-4 text-white font-heading tracking-tight">
                            Plan Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F6E8B1] to-[#D4AF37]">
                                Night Out
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-sans mb-8 font-light">
                            There's always something happening at Reset. From midweek golden-hour happy hours to late-night rooftop headline DJs.
                        </p>

                        {/* Category Badges */}
                        <div className="space-y-3 font-sans mb-8">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">This Month's Programs</div>
                            <div className="flex flex-wrap gap-2">
                                {displayedCategories.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-medium"
                                    >
                                        <span className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? 'bg-[#D4AF37]' : 'bg-white'}`} />
                                        <span>{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Link to Full Events Page */}
                    <div className="pt-4 border-t border-white/10 hidden lg:block">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#D4AF37] hover:text-white transition-colors group"
                        >
                            <span>Explore Full Calendar & Tickets</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: THE GRID CALENDAR --- */}
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl md:text-3xl text-white font-light tracking-widest font-heading">
                            {monthName} <span className="text-[#D4AF37] font-bold">{year}</span>
                        </h3>
                        <div className="flex items-center gap-2 font-sans">
                            <button
                                onClick={() => changeMonth(-1)}
                                aria-label="Previous Month"
                                className="w-9 h-9 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-zinc-900 hover:bg-black rounded-full cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => changeMonth(1)}
                                aria-label="Next Month"
                                className="w-9 h-9 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-zinc-900 hover:bg-black rounded-full cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-white/10 mb-2 font-sans">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest text-center py-2 font-semibold">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day Matrix */}
                    <div className="grid grid-cols-7 auto-rows-[1fr] border-l border-t border-white/10 bg-zinc-950 rounded-lg overflow-hidden">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square border-r border-b border-white/10 bg-black/60" />
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
                                        relative aspect-square border-r border-b border-white/10 group overflow-hidden cursor-pointer transition-colors
                                        ${isSelected ? 'bg-white/10 ring-1 ring-[#D4AF37]' : 'bg-zinc-950 hover:bg-zinc-900'}
                                    `}
                                >
                                    <span className={`absolute top-1 left-1.5 md:top-2 md:left-2.5 text-[11px] md:text-xs font-sans font-bold z-20 transition-colors ${isSelected ? 'text-[#D4AF37]' : 'text-zinc-400 group-hover:text-white drop-shadow-md'}`}>
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
                                                            className="w-full h-full object-cover object-top opacity-70 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                                                        <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] mb-0.5 truncate font-sans font-bold">
                                                            {formatTime(dayEvents[0].time)}
                                                        </p>
                                                        <p className="text-[11px] font-bold text-white leading-tight line-clamp-2 font-heading">
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
                                                                className="w-full h-full object-cover object-center opacity-70 group-hover/item:opacity-100 transition-all duration-500"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                                        <div className="absolute bottom-1 left-1 right-1">
                                                            <p className="text-[8px] uppercase tracking-wider text-[#D4AF37] truncate font-sans font-bold">
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