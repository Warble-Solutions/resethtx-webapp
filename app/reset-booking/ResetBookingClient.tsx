'use client'

import { useState, useEffect } from 'react'
import { getEventByDate, type DayEvent } from '@/app/actions/reservations'
import EventModal from '@/app/components/EventModal'
import { getHoustonToday, getNextOpenDate, isClosedDay as isVenueClosed } from '@/lib/houston-date'

interface EventInfo {
    hasEvent: boolean
    events: DayEvent[]
}

export default function ResetBookingClient() {
    // Date selection — all dates are Houston calendar dates ("YYYY-MM-DD").
    // If today is Mon/Tue (closed), default to the next open day.
    const today = getHoustonToday()
    const [selectedDate, setSelectedDate] = useState(() => getNextOpenDate(today))
    const [eventInfo, setEventInfo] = useState<EventInfo>({ hasEvent: false, events: [] })
    const [checkingEvent, setCheckingEvent] = useState(false)

    // Reset HTX is closed on Mondays and Tuesdays
    const isClosedDay = isVenueClosed(selectedDate)

    // Event booking modal — lists all events on the selected day (stays on this page)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)

    // Check for event whenever date changes
    useEffect(() => {
        const check = async () => {
            setCheckingEvent(true)
            const result = await getEventByDate(selectedDate)
            setEventInfo(result)
            setCheckingEvent(false)
        }
        check()
    }, [selectedDate])

    return (
        <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[4px] mb-4">Reset HTX</p>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-4">
                        Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]">Visit</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Select a date to view upcoming events and book your table, tickets, or RSVP.
                    </p>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className={`inline-flex items-center gap-3 bg-zinc-900 border rounded-xl p-2 pr-5 transition-colors focus-within:border-[#D4AF37] ${isClosedDay ? 'border-amber-500/40' : 'border-white/10 hover:border-[#D4AF37]/50'}`}>
                        <div className={`p-3 rounded-lg ${isClosedDay ? 'bg-amber-500/10 text-amber-400' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-bold leading-tight">Select Date</span>
                            <input
                                type="date"
                                value={selectedDate}
                                min={today}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none text-white text-sm font-bold uppercase p-0 focus:ring-0 outline-none cursor-pointer [color-scheme:dark] w-[140px]"
                            />
                        </div>
                        {checkingEvent && (
                            <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin ml-2" />
                        )}
                    </div>

                    {isClosedDay && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium animate-in fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                            </svg>
                            <span>Venue is closed on Mondays &amp; Tuesdays. We are open Wed – Sun.</span>
                        </div>
                    )}
                </div>

                {/* ─── EVENT BOOKING CARD ─── */}
                <div
                    className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
                        ${eventInfo.hasEvent
                            ? 'border-[#D4AF37]/40 bg-[#0a0a0a] cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]'
                            : 'border-white/5 bg-[#050505] opacity-50'
                        }`}
                    onClick={() => eventInfo.hasEvent && setIsEventModalOpen(true)}
                >
                    <div className={`h-1 w-full ${eventInfo.hasEvent ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]' : 'bg-white/10'}`} />

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${eventInfo.hasEvent ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-white/5 text-slate-600'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                                </svg>
                            </div>
                            {eventInfo.hasEvent && (
                                <span className="px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                                    Event Night
                                </span>
                            )}
                        </div>

                        <h2 className={`font-heading text-2xl font-bold uppercase tracking-wide mb-2 ${eventInfo.hasEvent ? 'text-white' : 'text-slate-600'}`}>
                            Event Booking
                        </h2>

                        {eventInfo.hasEvent ? (
                            <>
                                <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                                    {eventInfo.events.length > 1
                                        ? `There are ${eventInfo.events.length} events happening on this night. Book your table, tickets or RSVP below.`
                                        : 'There\'s an event happening on this night. Book your table, tickets or RSVP below.'}
                                </p>
                                <ul className="mb-6 space-y-1">
                                    {eventInfo.events.map(ev => (
                                        <li key={ev.id} className="text-[#D4AF37] font-bold text-sm">🎉 {ev.title}</li>
                                    ))}
                                </ul>
                                <button
                                    onClick={e => { e.stopPropagation(); setIsEventModalOpen(true) }}
                                    className="w-full bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                >
                                    View Event &amp; Book
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                    No events scheduled for this date. Please select another date with an upcoming event to book.
                                </p>
                                <div className="w-full bg-white/5 text-slate-600 font-bold py-4 rounded-xl uppercase tracking-widest text-sm text-center cursor-not-allowed border border-white/5">
                                    No Events Tonight
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-slate-600 text-xs mt-10">
                    21+ to enter. · Reset HTX
                </p>

            </div>

            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                events={eventInfo.events}
            />
        </main>
    )
}
