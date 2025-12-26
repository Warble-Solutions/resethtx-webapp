'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    image_url: string | null
    featured_image_url?: string | null
    description?: string | null
    section_name?: string
}

export default function EventsCalendar({ events, onEventClick }: { events: Event[], onEventClick?: (event: Event) => void }) {
    const [currentDate, setCurrentDate] = useState(new Date())

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

    const getEventForDay = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        // Adjust logic to match local date string
        const dateStr = checkDate.toLocaleDateString('en-CA') // YYYY-MM-DD format
        return events.find(e => e.date.startsWith(dateStr))
    }

    return (
        <section className="bg-black py-20 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* --- LEFT COLUMN: LEGEND & TITLE --- */}
                <div className="lg:w-1/3 flex flex-col justify-start pt-4">
                    <h2 className="text-5xl font-bold uppercase leading-tight mb-2 text-white font-heading">
                        Plan Your <br />
                        <span className="text-[#D4AF37]">Night Out</span>
                    </h2>
                    <p className="text-slate-400 mt-6 mb-10 leading-relaxed max-w-sm font-sans">
                        There's always something happening at Reset. From midweek happy hours to weekend rooftop raves. Check the calendar to reserve your spot.
                    </p>
                    <div className="space-y-4 font-sans">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Live DJ Sets</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Happy Hour Specials</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Private Events</span>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: THE GRID CALENDAR --- */}
                <div className="lg:w-2/3">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-3xl text-white font-light tracking-widest font-heading">
                            {monthName} <span className="text-[#D4AF37] font-bold">{year}</span>
                        </h3>
                        <div className="flex gap-2 font-sans">
                            <button onClick={() => changeMonth(-1)} className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-white/5 rounded-full">←</button>
                            <button onClick={() => changeMonth(1)} className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white flex items-center justify-center transition-all bg-white/5 rounded-full">→</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 border-b border-white/10 mb-2 font-sans">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-xs text-slate-500 uppercase tracking-widest text-center py-2">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 auto-rows-[1fr] border-l border-t border-white/10 bg-[#111]">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square border-r border-b border-white/10 bg-[#0a0a0a]" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const event = getEventForDay(day)
                            return (
                                <div key={day} className="relative aspect-square border-r border-b border-white/10 group overflow-hidden bg-[#111]">
                                    <span className="absolute top-2 left-3 text-sm font-sans font-bold text-slate-500 z-10 group-hover:text-white transition-colors">{day}</span>
                                    {event ? (
                                        <div
                                            onClick={() => onEventClick?.(event)}
                                            className="absolute inset-0 block w-full h-full cursor-pointer"
                                        >
                                            {event.image_url && (
                                                <Image src={event.image_url} alt={event.title} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-0.5 truncate font-sans font-bold">
                                                    {event.time ? event.time.slice(0, 5) : 'TBA'}
                                                </p>
                                                <p className="text-xs font-bold text-white leading-tight line-clamp-2 font-heading">{event.title}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full hover:bg-white/5 transition-colors cursor-default" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}