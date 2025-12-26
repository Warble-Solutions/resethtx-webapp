'use client'

import { useState } from 'react'
import ReservationsTable from './ReservationsTable'
import { cancelEventBooking } from '@/app/actions/event-booking'

interface EventBooking {
    id: string
    customer_name: string
    customer_email: string
    status: string
    created_at: string
    events: {
        title: string
        date: string
    } | null | undefined
    tables: {
        table_number: number
        section_name: string
        seats?: number
    } | null | undefined
    // For Debugging:
    event_id?: string
    table_id?: string
}

export default function ReservationsClient({
    initialReservations,
    initialEventBookings
}: {
    initialReservations: any[]
    initialEventBookings: any[]
}) {
    const [activeTab, setActiveTab] = useState<'general' | 'events'>('general')
    const [eventBookings, setEventBookings] = useState<EventBooking[]>(initialEventBookings)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleCancelEventBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this event booking?')) return
        setLoadingId(id)
        const result = await cancelEventBooking(id)
        if (result.success) {
            // Optimistic update or wait for revalidate. 
            // Revalidate happens on server, but client state might need manual update if not refreshing router.
            setEventBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
        } else {
            alert(result.error)
        }
        setLoadingId(null)
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/20'
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/20'
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }
    }

    // Stats Calculation
    const pendingCount = initialReservations.filter((r: any) => r.status === 'pending').length
    const confirmedCount = initialReservations.filter((r: any) => r.status === 'confirmed').length
    const eventConfirmedCount = eventBookings.filter(b => b.status === 'confirmed').length

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Reservations</h1>
                    <p className="text-slate-400">Manage table bookings and guest requests.</p>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    {activeTab === 'general' ? (
                        <>
                            <div className="bg-[#111] border border-white/10 px-6 py-3 rounded-lg text-center">
                                <span className="block text-2xl font-bold text-white">{pendingCount}</span>
                                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold">Pending</span>
                            </div>
                            <div className="bg-[#111] border border-white/10 px-6 py-3 rounded-lg text-center">
                                <span className="block text-2xl font-bold text-white">{confirmedCount}</span>
                                <span className="text-[10px] text-green-500 uppercase tracking-wider font-bold">Confirmed</span>
                            </div>
                        </>
                    ) : (
                        <div className="bg-[#111] border border-white/10 px-6 py-3 rounded-lg text-center">
                            <span className="block text-2xl font-bold text-white">{eventConfirmedCount}</span>
                            <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold">Sold Tables</span>
                        </div>
                    )}
                </div>
            </div>

            {/* TABS */}
            <div className="flex gap-1 mb-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'general'
                        ? 'border-[#D4AF37] text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                >
                    General Dining
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'events'
                        ? 'border-[#D4AF37] text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Event Tables
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-[#050505] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                {activeTab === 'general' ? (
                    <ReservationsTable initialReservations={initialReservations} />
                ) : (
                    // EVENT BOOKINGS TABLE VIEW
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-[#111] text-xs uppercase font-bold text-slate-300">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-lg">Event</th>
                                    <th className="px-6 py-4">Table</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {eventBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            No event table bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    eventBookings.map((booking) => (
                                        <tr key={booking.id} className="bg-[#0a0a0a] hover:bg-[#111] transition-colors group">
                                            {/* EVENT */}
                                            <td className="px-6 py-6">
                                                <div className="font-bold text-white text-base mb-1">
                                                    {booking.events?.title || <span className="text-red-500">Unknown Event</span>}
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    {booking.events?.date ? new Date(booking.events.date).toLocaleDateString() : 'No Date'}
                                                </div>
                                            </td>

                                            {/* TABLE */}
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2 text-white font-bold">
                                                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                                                    {booking.tables?.table_number
                                                        ? `Table ${booking.tables.table_number}`
                                                        : <span className="text-red-500">Unknown Table</span>
                                                    }
                                                </div>
                                                <div className="text-xs text-slate-500 pl-4 mt-1">
                                                    {booking.tables?.section_name || 'Standard'}
                                                </div>
                                            </td>

                                            {/* CUSTOMER */}
                                            <td className="px-6 py-6">
                                                <div className="font-bold text-slate-200 mb-1">{booking.customer_name}</div>
                                                <a href={`mailto:${booking.customer_email}`} className="text-xs hover:text-[#D4AF37] transition-colors">
                                                    {booking.customer_email}
                                                </a>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-6 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {loadingId === booking.id ? (
                                                        <span className="text-xs text-slate-500 animate-pulse">Processing...</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCancelEventBooking(booking.id)}
                                                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/50 p-2 rounded transition-colors"
                                                            title="Cancel Booking"
                                                        >
                                                            ✕ Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
