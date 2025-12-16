'use client'

import { useState } from 'react'
import Image from 'next/image'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'

interface Event {
  id: string
  title: string
  date: string
  time: string | null
  image_url: string | null
  description: string | null
  tickets: number
}

export default function EventsCalendar({ events }: { events: Event[] }) {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Calendar Logic
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
    <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs mb-2">Save The Date</h2>
                <h3 className="font-heading text-4xl md:text-5xl text-white">
                    {viewMode === 'calendar' ? format(currentMonth, 'MMMM yyyy') : 'Upcoming Schedule'}
                </h3>
            </div>

            <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${viewMode === 'calendar' ? 'bg-[#C59D24] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Calendar
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-[#C59D24] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    List View
                </button>
            </div>
        </div>

        {/* --- CALENDAR VIEW --- */}
        {viewMode === 'calendar' && (
            <div className="animate-in fade-in duration-500">
                <div className="flex justify-end mb-4 gap-2">
                    <button onClick={prevMonth} className="px-4 py-2 border border-white/20 hover:border-[#C59D24] text-white hover:text-[#C59D24] transition-colors rounded text-sm uppercase font-bold">← Prev</button>
                    <button onClick={nextMonth} className="px-4 py-2 border border-white/20 hover:border-[#C59D24] text-white hover:text-[#C59D24] transition-colors rounded text-sm uppercase font-bold">Next →</button>
                </div>

                <div className="grid grid-cols-7 border border-white/10 bg-[#0a0a0a]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 border-b border-r border-white/10 text-center font-bold text-slate-500 text-xs tracking-widest uppercase bg-white/5">
                            {day}
                        </div>
                    ))}

                    {calendarDays.map((day) => {
                        const dayEvents = getEventsForDay(day)
                        const isCurrent = isSameMonth(day, currentMonth)
                        
                        return (
                            <div key={day.toISOString()} className={`min-h-[160px] flex flex-col border-b border-r border-white/10 relative ${!isCurrent ? 'bg-black/40 opacity-50' : ''}`}>
                                <div className="absolute top-2 right-2 z-10 pointer-events-none">
                                    <span className={`text-xs font-bold flex items-center justify-center w-6 h-6 rounded-full shadow-lg ${isToday(day) ? 'bg-[#C59D24] text-black' : 'bg-black/50 text-slate-300'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                
                                <div className="flex-1 flex flex-col w-full h-full pt-0"> 
                                    {dayEvents.length > 0 ? (
                                        dayEvents.map(ev => (
                                            <div 
                                                key={ev.id} 
                                                onClick={() => setSelectedEvent(ev)} 
                                                className="relative flex-1 w-full min-h-[60px] overflow-hidden group border-t border-white/10 first:border-t-0 hover:z-20 cursor-pointer"
                                            >
                                                {/* Background Image */}
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
                                                
                                                {/* Text Overlay */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                                                    <span className="text-[#C59D24] text-[10px] font-bold uppercase leading-none mb-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                        {formatTime(ev.time)}
                                                    </span>
                                                    <p className="font-heading text-xs md:text-sm text-white truncate w-full leading-tight shadow-black drop-shadow-md group-hover:text-[#C59D24] transition-colors">
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

        {/* --- LIST VIEW --- */}
        {viewMode === 'list' && (
            <div className="space-y-4 animate-in fade-in duration-500">
                {events.map((event) => (
                    <div key={event.id} className="group flex flex-col md:flex-row items-center gap-6 bg-[#0a0a0a] border border-white/10 p-4 rounded-xl hover:border-[#C59D24]/50 transition-all cursor-pointer" onClick={() => setSelectedEvent(event)}>
                        <div className="shrink-0 w-20 h-20 bg-white/5 rounded-lg flex flex-col items-center justify-center border border-white/5 group-hover:border-[#C59D24] transition-colors">
                            <span className="text-[#C59D24] text-xs font-bold uppercase">{format(new Date(event.date), 'MMM')}</span>
                            <span className="text-2xl font-heading font-bold text-white">{format(new Date(event.date), 'd')}</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-[#C59D24] text-xs font-bold uppercase mb-1">{formatTime(event.time)}</p>
                            <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#C59D24] transition-colors">{event.title}</h3>
                        </div>
                        <button className="text-sm font-bold uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-[#C59D24] hover:text-black hover:border-[#C59D24] transition-all">
                            Details
                        </button>
                    </div>
                ))}
            </div>
        )}

        {/* --- MODAL --- */}
        {selectedEvent && (
            <div 
                onClick={() => setSelectedEvent(null)}
                className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
            >
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0a0a0a] border border-[#C59D24] max-w-2xl w-full flex flex-col shadow-[0_0_50px_rgba(197,157,36,0.2)] rounded-xl overflow-hidden relative"
                >
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-white text-white hover:text-black transition-colors">✕</button>
                    
                    {/* Image Header */}
                    <div className="relative h-48 w-full bg-slate-900">
                        {selectedEvent.image_url && <Image src={selectedEvent.image_url} alt={selectedEvent.title} fill className="object-cover" />}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black to-transparent">
                            <h3 className="font-heading text-3xl text-white">{selectedEvent.title}</h3>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                            <div>
                                <p className="text-[#C59D24] text-sm font-bold uppercase tracking-widest mb-1">Date</p>
                                <p className="text-white">{format(new Date(selectedEvent.date), 'EEEE, MMMM do, yyyy')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[#C59D24] text-sm font-bold uppercase tracking-widest mb-1">Time</p>
                                <p className="text-white">{formatTime(selectedEvent.time)}</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">{selectedEvent.description || "Join us for an unforgettable night."}</p>
                        <button className="w-full bg-[#C59D24] hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest text-sm transition-all shadow-lg shadow-[#C59D24]/20">
                            Get Tickets / Reserve
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </section>
  )
}