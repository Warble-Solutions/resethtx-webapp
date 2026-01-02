'use client'

import { useState } from 'react'
import { updateReservationStatus, deleteReservation } from './actions'

interface Reservation {
    id: string
    full_name: string
    email: string
    phone: string
    guests: string
    date: string
    time: string
    special_requests: string | null
    status: string
    created_at: string
}

export default function ReservationsTable({ initialReservations }: { initialReservations: Reservation[] }) {
    const [reservations, setReservations] = useState(initialReservations)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    // NOTE: In a real app with revalidatePath, the page would reload with new data.
    // Ideally we trust the server reload, but for instant UI feedback we might want to update local state too
    // or just rely on router.refresh() if revalidatePath isn't sufficient for client-side state sync without navigation.
    // Since we are passing initialReservations from a Server Component, the most robust way is to just let the action handle revalidation
    // and the page update will propagate new props. However, simple revalidatePath might not trigger a full client re-render with new props automatically
    // unless we use useTransition / router.refresh().
    // For simplicity, I will just trust the server action returns success and then I might trigger a router.refresh() if needed,
    // but revalidatePath usually handles it on the next fetch.
    // Actually, standard pattern is server action -> revalidatePath -> UI updates.

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setLoadingId(id)
        const result = await updateReservationStatus(id, newStatus)
        if (!result.success) {
            alert(result.message)
        }
        setLoadingId(null)
        // The server action calls revalidatePath, so the page should update.
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reservation?')) return
        setLoadingId(id)
        const result = await deleteReservation(id)
        if (!result.success) {
            alert(result.message)
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

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-[#111] text-xs uppercase font-bold text-slate-300">
                    <tr>
                        <th className="px-6 py-4 rounded-tl-lg">Guest</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Notes</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {reservations.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No reservations found.
                            </td>
                        </tr>
                    ) : (
                        reservations.map((res) => (
                            <tr key={res.id} className="bg-[#0a0a0a] hover:bg-[#111] transition-colors group">
                                {/* GUEST */}
                                <td className="px-6 py-6">
                                    <div className="font-bold text-white text-base mb-1">{res.full_name}</div>
                                    <div className="flex flex-col gap-1 text-xs">
                                        <a href={`mailto:${res.email}`} className="hover:text-[#D4AF37] transition-colors">{res.email}</a>
                                        <a href={`tel:${res.phone}`} className="hover:text-[#D4AF37] transition-colors">{res.phone}</a>
                                    </div>
                                </td>

                                {/* DETAILS */}
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-2 text-slate-300 mb-1">
                                        <span className="text-[#D4AF37]">📅</span> {new Date(res.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300 mb-1">
                                        <span className="text-[#D4AF37]">⏰</span> {res.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span className="text-[#D4AF37]">👥</span> {res.guests}
                                    </div>
                                </td>

                                {/* NOTES */}
                                <td className="px-6 py-6 max-w-xs">
                                    {res.special_requests ? (
                                        <p className="italic text-slate-400 leading-relaxed line-clamp-2">"{res.special_requests}"</p>
                                    ) : (
                                        <span className="text-slate-700 opacity-50">-</span>
                                    )}
                                </td>

                                {/* STATUS */}
                                <td className="px-6 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusColor(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        {loadingId === res.id ? (
                                            <span className="text-xs text-slate-500 animate-pulse">Processing...</span>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                                                    className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black border border-green-500/50 p-2 rounded transition-colors"
                                                    title="Confirm"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                                                    className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black border border-yellow-500/50 p-2 rounded transition-colors"
                                                    title="Cancel"
                                                >
                                                    ✕
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(res.id)}
                                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/50 p-2 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    🗑
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
