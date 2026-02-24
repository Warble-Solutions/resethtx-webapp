/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState } from 'react'
import Image from 'next/image'
 
import Link from 'next/link'
import { formatTime } from '../utils/format'

import EventCard from './EventCard' // NEW

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
    ticket_price?: number // NEW
}

// 1. Update component signature to pass array
export default function EventsCalendar({ events, onEventClick }: { events: Event[], onEventClick?: (events: Event[]) => void }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset))
        setCurrentDate(new Date(newDate))
    }

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()
    const year = currentDate.getFullYear()

    const getEventsForDay = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        const dateStr = checkDate.toLocaleDateString('en-CA')
        return events.filter(e => e.date.startsWith(dateStr))
    }

    const selectedEvents = events.filter(e => {
        const sDate = selectedDate.toLocaleDateString('en-CA')
        return e.date.startsWith(sDate)
    })

    const selectedDateDisplay = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })


    // --- DYNAMIC SIDEBAR LOGIC ---
    const getVisibleCategories = () => {
        // 1. Determine which months to fetch categories from
        const today = new Date()
        const isCurrentMonthView = currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth()

        // Base range: Start of viewed month to end of viewed month
        const startFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        let endFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        // "End of Month" Rule: If today >= 25th and viewing current month, include next month
        if (isCurrentMonthView && today.getDate() >= 25) {
            endFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0) // Extend to end of next month
        }

        // 2. Filter events within range
        const relevantEvents = events.filter(e => {
            const eDate = new Date(e.date)
            // Use local dates for comparison to avoid timezone off-by-one issues on edge days
            // or simplify by comparing ISO strings but standard Date comparison usually fine if times match
            // Let's rely on simple timestamp comparison for range check
            return eDate >= startFilter && eDate <= endFilter
        })

        // 3. Extract unique categories
        const categories = Array.from(new Set(relevantEvents.map(e => e.category))).filter(Boolean) as string[]
        return categories
    }

    const displayedCategories = getVisibleCategories()

    return (
        <section className="bg-black py-10 md:py-20 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* --- LEFT COLUMN: LEGEND & TITLE --- */}
                <div className="lg:w-1/3 flex flex-col justify-start pt-4">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-2 text-white font-heading">
                        Plan Your <br />
                        <span className="text-[#D4AF37]">Night Out</span>
                    </h2>
                    <p className="text-slate-400 mt-6 mb-10 leading-relaxed max-w-sm font-sans hidden md:block">
                        There&apos;s always something happening at Reset. From midweek happy hours to weekend rooftop raves. Check the calendar to reserve your spot.
                    </p>

                    <div className="space-y-4 font-sans mb-8 lg:mb-0">
                        {displayedCategories.length > 0 ? (
                            displayedCategories.map((cat, idx) => (
                                <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className={`w-3 h-3 rounded-full ${idx % 2 === 0 ? 'bg-[#D4AF37]' : 'bg-white'}`}></div>
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">{cat}</span>
                                </div>
                            ))
                        ) : (
                            // Fallback if no categories found (e.g. empty month)
                            <div className="flex items-center gap-3 opacity-50">
                                <span className="text-sm text-slate-500 italic">Check calendar for details</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: THE GRID CALENDAR --- */}
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-2xl md:text-3xl text-white font-light tracking-widest font-heading">
                            {monthName} <span className="text-[#D4AF37] font-bold">{year}</span>
                        </h3>
                        <div className="flex gap-2 font-sans">
                            <button onClick={() => changeMonth(-1)} className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-white/5 rounded-full">←</button>
                            <button onClick={() => changeMonth(1)} className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-white/5 rounded-full">→</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 border-b border-white/10 mb-2 font-sans">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest text-center py-2">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 auto-rows-[1fr] border-l border-t border-white/10 bg-[#111]">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square border-r border-b border-white/10 bg-[#0a0a0a]" />
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
                                    }}
                                    className={`
                                        relative aspect-square border-r border-b border-white/10 group overflow-hidden cursor-pointer transition-colors
                                        ${isSelected ? 'bg-white/10' : 'bg-[#111]'}
                                    `}
                                >
                                    <span className={`absolute top-1 left-1 md:top-2 md:left-3 text-xs md:text-sm font-sans font-bold z-20 transition-colors ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-white drop-shadow-md'}`}>{day}</span>

                                    {/* --- MOBILE VIEW: DOT ONLY --- */}
                                    <div className="md:hidden w-full h-full flex items-center justify-center">
                                        {hasEvents && (
                                            <div className="flex gap-1 justify-center mt-3">
                                                {dayEvents.slice(0, 3).map((_, idx) => (
                                                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* --- DESKTOP VIEW: SPLIT OR FULL --- */}
                                    <div
                                        onClick={(e) => {
                                            onEventClick?.(dayEvents)
                                            e.stopPropagation()
                                        }}
                                        className="hidden md:flex w-full h-full absolute inset-0"
                                    >
                                        {hasEvents ? (
                                            dayEvents.length === 1 ? (
                                                // SINGLE EVENT (Full Size)
                                                <div className="relative w-full h-full cursor-pointer group/item">
                                                    {dayEvents[0].image_url && (
                                                        <Image src={dayEvents[0].image_url} alt={dayEvents[0].title} fill className="w-full h-full object-cover object-top opacity-60 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-500" />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                                    <div className="absolute bottom-2 left-2 right-2">
                                                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-0.5 truncate font-sans font-bold">
                                                            {formatTime(dayEvents[0].time)}
                                                        </p>
                                                        <p className="text-xs font-bold text-white leading-tight line-clamp-2 font-heading">{dayEvents[0].title}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                // MULTI EVENT (Split View)
                                                 
                                                dayEvents.slice(0, 2).map((ev, idx) => (
                                                    <div key={ev.id} className={`relative w-1/2 h-full cursor-pointer group/item border-r border-[#000] last:border-r-0`}>
                                                        {ev.image_url && (
                                                            <Image src={ev.image_url} alt={ev.title} fill className="w-full h-full object-cover object-center opacity-60 group-hover/item:opacity-100 transition-all duration-500" />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                                        <div className="absolute bottom-2 left-2 right-2">
                                                            <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] mb-0.5 truncate font-sans font-bold">
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
                </div>
            </div>

            {/* --- MOBILE ONLY: SELECTED DAY LIST --- */}
            <div className="md:hidden mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4 font-heading">
                    Events for <span className="text-[#D4AF37]">{selectedDateDisplay}</span>
                </h3>

                <div className="flex flex-col gap-6">
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map(event => (
                            // Wrapper to handle click -> modal if possible, OR just render card
                            <div key={event.id} onClick={() => onEventClick?.([event])}>
                                <EventCard
                                    title={event.title}
                                    date={new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                        <div className="py-8 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <p className="text-slate-400 text-sm">No events scheduled.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}