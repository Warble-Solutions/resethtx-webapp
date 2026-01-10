'use client'

import { useState } from 'react'
import Image from 'next/image'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import EventModal from '../components/EventModal'

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    image_url: string | null
    description: string | null
    tickets: number
    is_external_event?: boolean
    external_url?: string
    ticket_price?: number
    ticket_capacity?: number
    category?: string // Added category field
}

export default function EventsContent({ events }: { events: Event[] }) {
    // 1. CHANGE: Default view is now 'calendar'
    const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'grid'>('calendar')
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    // --- CALENDAR LOGIC ---
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const getEventsForDay = (day: Date) => events.filter(e => isSameDay(new Date(e.date), day))

    const formatTime = (timeString: string | null) => {
        if (!timeString) return 'TBA'
        const [h, m] = timeString.split(':')
        const hour = parseInt(h)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
        return `${displayHour}:${m} ${ampm}`
    }

    return (
        <div>
            {/* --- TABS NAVIGATION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="text-2xl font-bold text-white border-l-4 border-[#D4AF37] pl-4 font-heading">
                    {viewMode === 'calendar' ? format(currentMonth, 'MMMM yyyy') : 'All Upcoming Events'}
                </h2>

                <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
                    {/* 2. CHANGE: Reordered array to ['calendar', 'list', 'grid'] */}
                    {['calendar', 'list', 'grid'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode as any)}
                            className={`
                        px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all
                        ${viewMode === mode
                                    ? 'bg-[#D4AF37] text-black shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }
                    `}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- VIEW 1: CALENDAR VIEW (Moved to Top) --- */}
            {viewMode === 'calendar' && (
                <div className="animate-in fade-in duration-500">
                    {/* Calendar Controls */}
                    <div className="flex justify-end mb-4 gap-2">
                        <button onClick={prevMonth} className="px-4 py-2 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition-colors rounded">← Prev</button>
                        <button onClick={nextMonth} className="px-4 py-2 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition-colors rounded">Next →</button>
                    </div>

                    <div className="grid grid-cols-7 border border-white/10 bg-[#0a0a0a]">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-4 border-b border-r border-white/10 text-center font-bold text-slate-500 text-sm tracking-widest uppercase bg-white/5">
                                {day}
                            </div>
                        ))}

                        {calendarDays.map((day) => {
                            const dayEvents = getEventsForDay(day)
                            const isCurrent = isSameMonth(day, currentMonth)

                            return (
                                <div key={day.toISOString()} className={`min-h-[160px] flex flex-col border-b border-r border-white/10 relative ${!isCurrent ? 'bg-black/40 opacity-50' : ''}`}>
                                    <div className="absolute top-2 right-2 z-10">
                                        <span className={`text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full shadow-md ${isToday(day) ? 'bg-[#D4AF37] text-black' : 'bg-black/50 text-slate-300'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex flex-col w-full h-full pt-8">
                                        {dayEvents.length > 0 ? (
                                            dayEvents.map(ev => (
                                                <div
                                                    key={ev.id}
                                                    onClick={() => setSelectedEvent(ev)}
                                                    className="relative flex-1 w-full min-h-[60px] overflow-hidden group border-t border-white/10 first:border-t-0 hover:z-20 cursor-pointer"
                                                >
                                                    {ev.image_url ? (
                                                        <Image
                                                            src={ev.image_url}
                                                            alt={ev.title}
                                                            fill
                                                            className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-slate-900" />
                                                    )}

                                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                                                        <span className="text-[#D4AF37] text-[10px] font-bold uppercase leading-none mb-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                            {formatTime(ev.time)}
                                                        </span>
                                                        <p className="font-heading text-xs md:text-sm text-white truncate w-full leading-tight shadow-black drop-shadow-md">
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
            )}

            {/* --- VIEW 2: LIST VIEW --- */}
            {viewMode === 'list' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-500">
                    {events.map((event) => (
                        <div key={event.id} className="group flex flex-col md:flex-row items-center gap-6 bg-[#0a0a0a] border border-white/10 p-4 rounded-xl hover:border-[#D4AF37]/50 transition-all">
                            {/* Date Box */}
                            <div className="shrink-0 w-full md:w-24 h-24 bg-white/5 rounded-lg flex flex-col items-center justify-center border border-white/5 group-hover:border-[#D4AF37] transition-colors">
                                <span className="text-[#D4AF37] text-sm font-bold uppercase">{format(new Date(event.date), 'MMM')}</span>
                                <span className="text-3xl font-heading font-bold text-white">{format(new Date(event.date), 'd')}</span>
                            </div>

                            {/* Image (Small) */}
                            <div className="relative w-full md:w-40 h-24 rounded-lg overflow-hidden hidden md:block">
                                {event.image_url && <Image src={event.image_url} alt={event.title} fill className="object-cover" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">
                                    {event.category || 'Nightlife'}
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">{formatTime(event.time)}</p>
                                <h3 className="text-xl font-heading font-bold text-white">{event.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-1">{event.description}</p>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => setSelectedEvent(event)}
                                className="w-full md:w-auto bg-white text-black hover:bg-[#D4AF37] font-bold py-3 px-8 rounded-lg transition-colors text-sm uppercase tracking-wide"
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* --- VIEW 3: GRID VIEW --- */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                {event.image_url ? (
                                    <Image src={event.image_url} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">No Image</div>
                                )}
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-[#D4AF37] text-white px-4 py-2 rounded text-center">
                                    <span className="block text-xs font-bold uppercase text-[#D4AF37]">{format(new Date(event.date), 'MMM')}</span>
                                    <span className="block text-2xl font-bold font-heading">{format(new Date(event.date), 'd')}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">
                                    {event.category || 'Nightlife'}
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{formatTime(event.time)}</p>
                                <h3 className="text-2xl font-heading font-bold text-white leading-tight mb-4">{event.title}</h3>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <span className="text-slate-500 text-xs uppercase font-bold">{event.tickets > 0 ? `${event.tickets} Tickets` : 'Sold Out'}</span>
                                    <button className="text-white hover:text-[#D4AF37] font-bold text-sm uppercase tracking-wide transition-colors">Details →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- POPUP MODAL --- */}
            {/* --- POPUP MODAL --- */}
            <EventModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />
        </div>
    )
}