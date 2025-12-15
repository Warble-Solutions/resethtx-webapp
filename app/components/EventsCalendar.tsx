'use client'

import { useState } from 'react'
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
import Image from 'next/image'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  time: string
  image_url: string | null
  description: string | null
  tickets: number
}

export default function EventsCalendar({ events }: { events: Event[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // 1. Calendar Logic
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // 2. Helper: Find events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day))
  }

  // 3. Handlers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  
  const monthLabel = format(currentMonth, 'MMMM yyyy')

  return (
    <section className="bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 className="text-[#D4AF37] tracking-[0.3em] font-bold text-sm mb-2 uppercase">
                    Save the Date
                </h2>
                <h3 className="font-heading text-5xl md:text-6xl font-bold uppercase">
                    Upcoming <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#F0DEAA]">Events</span>
                </h3>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-6">
                <button onClick={prevMonth} className="p-3 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all rounded-none">
                    ←
                </button>
                <span className="font-heading text-2xl w-48 text-center">{monthLabel}</span>
                <button onClick={nextMonth} className="p-3 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all rounded-none">
                    →
                </button>
            </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT SIDE: List View */}
            <div className="lg:w-1/4 flex flex-col gap-6">
                <div className="p-6 border border-white/10 bg-[#0a0a0a]">
                    <h4 className="font-heading text-2xl mb-6 text-[#D4AF37]">Next Up</h4>
                    <div className="flex flex-col gap-6">
                        {events
                           .filter(e => new Date(e.date) >= new Date())
                           .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                           .slice(0, 3)
                           .map(event => (
                            <div key={event.id} className="group cursor-pointer border-b border-white/10 pb-4 last:border-0">
                                <span className="text-xs font-bold text-slate-400 block mb-1">
                                    {format(new Date(event.date), 'EEE, MMM d')}
                                </span>
                                <h5 className="font-heading text-xl group-hover:text-[#D4AF37] transition-colors mb-2 truncate">
                                    {event.title}
                                </h5>
                                <Link href="/events" className="text-xs font-bold tracking-widest uppercase text-white/50 group-hover:text-white transition-colors flex items-center gap-2">
                                    Book Now <span>→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <Link href="/events" className="block w-full py-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-center font-bold tracking-widest uppercase text-sm transition-all duration-300">
                            View Full List
                        </Link>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Calendar Grid */}
            <div className="lg:w-3/4">
                <div className="grid grid-cols-7 border-b border-r border-white/10 bg-[#0a0a0a]">
                    {/* Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 border-t border-l border-white/10 text-center font-bold text-slate-500 text-sm tracking-widest uppercase">
                            {day}
                        </div>
                    ))}

                    {/* Cells */}
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getEventsForDay(day)
                        const isCurrentMonth = isSameMonth(day, currentMonth)
                        const isTodayDate = isToday(day)

                        return (
                            <div 
                                key={day.toISOString()} 
                                onClick={() => dayEvents.length > 0 && setSelectedDate(day)}
                                className={`
                                    h-[160px] flex flex-col border-t border-l border-white/10 relative group transition-colors duration-300
                                    ${!isCurrentMonth ? 'bg-black/40 text-white/20' : 'bg-[#0a0a0a]'}
                                    ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-white/5' : ''}
                                `}
                            >
                                {/* Date Number */}
                                <div className="p-2 flex justify-end">
                                    <span className={`
                                        text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full
                                        ${isTodayDate ? 'bg-[#D4AF37] text-black' : ''}
                                    `}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                {/* Event Split Blocks */}
                                <div className="flex-1 flex flex-col w-full min-h-0">
                                    {dayEvents.map((event) => (
                                        <div 
                                            key={event.id} 
                                            className="relative flex-1 w-full overflow-hidden border-t border-white/5 group/event"
                                        >
                                            {/* Image */}
                                            {event.image_url && (
                                                <Image 
                                                    src={event.image_url} 
                                                    alt={event.title} 
                                                    fill 
                                                    className="object-cover opacity-60 grayscale group-hover/event:grayscale-0 group-hover/event:opacity-100 transition-all duration-500"
                                                />
                                            )}
                                            
                                            {/* Gradient & Text Overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/90 to-transparent flex items-end p-2">
                                                <p className="font-heading text-xs md:text-sm text-white truncate w-full leading-tight">
                                                    {event.title}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* --- MODAL POPUP (Updated) --- */}
        {selectedDate && (
            <div 
                // 1. CLICK OUTSIDE: Add click handler to overlay
                onClick={() => setSelectedDate(null)}
                // 2. REDUCED BLUR: lighter bg and less blur
                className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
            >
                <div 
                    // 3. STOP PROPAGATION: prevent clicks inside from closing
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0a0a0a] border border-[#D4AF37] max-w-2xl w-full p-8 relative shadow-[0_0_50px_rgba(212,175,55,0.2)] cursor-default"
                >
                    <button 
                        onClick={() => setSelectedDate(null)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white"
                    >
                        ✕
                    </button>
                    
                    <h3 className="font-heading text-3xl mb-6 text-[#D4AF37] border-b border-white/10 pb-4">
                        Events on {format(selectedDate, 'MMMM do')}
                    </h3>

                    <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {getEventsForDay(selectedDate).map(event => (
                            <div key={event.id} className="flex gap-6 items-start group">
                                <div className="w-24 h-24 relative shrink-0 bg-slate-900 border border-white/10">
                                    {event.image_url && <Image src={event.image_url} alt={event.title} fill className="object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-heading text-2xl text-white mb-2">{event.title}</h4>
                                    <p className="text-slate-400 text-sm mb-4">{event.description || 'No description available.'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#D4AF37] font-bold text-sm">
                                            {event.time ? format(new Date(`2000-01-01T${event.time}`), 'h:mm a') : 'TBA'}
                                        </span>
                                        <button className="bg-[#D4AF37] text-black text-xs font-bold px-6 py-2 uppercase tracking-widest hover:bg-white transition-colors">
                                            Get Tickets
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </section>
  )
}