'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createManualAdminReservation } from '../actions-manual'
import TableSelectionModal from '@/app/components/TableSelectionModal'

interface Event {
    id: string
    title: string
    date: string
    image_url: string | null
}

export default function ManualReservationForm({ upcomingEvents }: { upcomingEvents: Event[] }) {
    const router = useRouter()
    
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedEventId, setSelectedEventId] = useState('')
    const [reservationType, setReservationType] = useState<'event' | 'general'>('general')
    
    // Form fields
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [guests, setGuests] = useState('1')
    const [time, setTime] = useState('18:00')
    const [specialRequests, setSpecialRequests] = useState('')
    
    // Table Selection State
    const [isTableModalOpen, setIsTableModalOpen] = useState(false)
    const [selectedTable, setSelectedTable] = useState<{ id: string, name: string, category: string } | null>(null)
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Derived state
    const eventsOnDate = selectedDate 
        ? upcomingEvents.filter(e => e.date.startsWith(selectedDate))
        : []
    
    const isEventMode = reservationType === 'event' && eventsOnDate.length > 0
    
    const handleDateChange = (date: string) => {
        setSelectedDate(date)
        setSelectedEventId('')
        setSelectedTable(null)
        const hasEvents = upcomingEvents.some(e => e.date.startsWith(date))
        setReservationType(hasEvents ? 'event' : 'general')
    }

    const handleEventChange = (eventId: string) => {
        setSelectedEventId(eventId)
        setSelectedTable(null) // Reset table when event changes
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        
        if (isEventMode && !selectedEventId) {
            setMessage({ type: 'error', text: 'Please select an event for this date.' })
            return
        }
        
        if (isEventMode && selectedEventId && !selectedTable) {
            setMessage({ type: 'error', text: 'You must select a table for event reservations.' })
            return
        }

        setIsSubmitting(true)

        const selectedEvent = eventsOnDate.find(e => e.id === selectedEventId)

        const res = await createManualAdminReservation({
            type: isEventMode ? 'event' : 'general',
            eventId: selectedEventId || undefined,
            eventName: selectedEvent?.title,
            tableId: selectedTable?.id,
            tableName: selectedTable?.name,
            tableCategory: selectedTable?.category,
            full_name: fullName,
            email,
            phone,
            guests,
            date: selectedDate,
            time: isEventMode ? undefined : time,
            special_requests: specialRequests
        })

        setIsSubmitting(false)

        if (res.success) {
            setMessage({ type: 'success', text: 'Reservation successfully created!' })
            // Reset form
            setFullName('')
            setEmail('')
            setPhone('')
            setGuests('1')
            setSpecialRequests('')
            setSelectedTable(null)
            
            // Redirect after 2s
            setTimeout(() => {
                router.push('/admin/reservations')
            }, 2000)
        } else {
            setMessage({ type: 'error', text: res.message || 'Failed to create reservation.' })
        }
    }

    return (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold font-heading text-white uppercase tracking-wider mb-8 border-b border-white/10 pb-4">
                Manual <span className="text-[#D4AF37]">Reservation</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- DATE & MODE SECTION --- */}
                <div className="bg-[#0a0a0a] p-6 rounded-lg border border-white/5 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reservation Date</label>
                        <input
                            type="date"
                            required
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors [color-scheme:dark]"
                        />
                    </div>

                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-top-2 space-y-6">
                            {eventsOnDate.length > 0 && (
                                <div className="flex bg-black rounded-lg border border-white/10 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setReservationType('event')}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${reservationType === 'event' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Event Booking
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReservationType('general')}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${reservationType === 'general' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        General Table
                                    </button>
                                </div>
                            )}

                            {isEventMode ? (
                                <div className="space-y-4">
                                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] p-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                                        Select Event for this Date
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Event</label>
                                        <div className="grid gap-3">
                                            {eventsOnDate.map(event => (
                                                <div 
                                                    key={event.id}
                                                    onClick={() => handleEventChange(event.id)}
                                                    className={`
                                                        flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all
                                                        ${selectedEventId === event.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-[#050505] hover:border-white/30'}
                                                    `}
                                                >
                                                    <div className="relative w-12 h-12 rounded bg-slate-900 overflow-hidden shrink-0 border border-white/10">
                                                        {event.image_url && <Image src={event.image_url} alt={event.title} fill className="object-cover" />}
                                                    </div>
                                                    <div className="flex-1 font-bold font-heading text-white">{event.title}</div>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedEventId === event.id ? 'border-[#D4AF37]' : 'border-white/30'}`}>
                                                        {selectedEventId === event.id && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedEventId && (
                                        <div className="mt-4 p-4 border border-[#D4AF37]/30 rounded-lg bg-[#050505]">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Table</label>
                                            {selectedTable ? (
                                                <div className="flex justify-between items-center bg-[#111] border border-[#D4AF37] p-4 rounded-lg">
                                                    <div>
                                                        <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{selectedTable.category}</div>
                                                        <div className="text-white font-bold font-heading text-xl">{selectedTable.name}</div>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setIsTableModalOpen(true)}
                                                        className="text-xs font-bold uppercase border border-white/20 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-colors"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsTableModalOpen(true)}
                                                    className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                                                    Select a Table
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {eventsOnDate.length === 0 && (
                                        <div className="bg-slate-800/30 border border-slate-700 p-3 rounded-lg text-slate-300 text-sm font-bold uppercase tracking-wider">
                                            No events on this date. Creating General Reservation.
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Time</label>
                                        <input
                                            type="time"
                                            required={!isEventMode}
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                    
                                    <div className="mt-4 p-4 border border-[#D4AF37]/30 rounded-lg bg-[#050505]">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Table (Optional)</label>
                                        {selectedTable ? (
                                            <div className="flex justify-between items-center bg-[#111] border border-[#D4AF37] p-4 rounded-lg">
                                                <div>
                                                    <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{selectedTable.category}</div>
                                                    <div className="text-white font-bold font-heading text-xl">{selectedTable.name}</div>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setIsTableModalOpen(true)}
                                                    className="text-xs font-bold uppercase border border-white/20 px-3 py-1.5 rounded hover:bg-white hover:text-black transition-colors"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsTableModalOpen(true)}
                                                className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                                                Select a Table
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- CUSTOMER INFO SECTION --- */}
                {selectedDate && (isEventMode ? (selectedEventId && selectedTable) : true) && (
                    <div className="bg-[#0a0a0a] p-6 rounded-lg border border-white/5 space-y-4 animate-in fade-in">
                        <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4">Guest Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Party Size</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Special Requests / Notes</label>
                            <textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                rows={3}
                                className="w-full bg-[#050505] border border-white/10 text-white rounded-lg p-3 focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="Any special instructions..."
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? 'Creating Reservation...' : 'Complete Reservation'}
                        </button>
                    </div>
                )}
            </form>

            <TableSelectionModal
                isOpen={isTableModalOpen}
                onClose={() => setIsTableModalOpen(false)}
                eventId={isEventMode ? selectedEventId : undefined}
                date={!isEventMode ? selectedDate : undefined}
                onSelectTable={(table) => setSelectedTable(table)}
            />
        </div>
    )
}
