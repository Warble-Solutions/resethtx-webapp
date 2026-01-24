'use client'

import { useEffect, useState } from 'react'
import { getEventGuestList } from '../sales/actions'

interface Guest {
    name: string
    email: string
    phone: string
    type: string
    status: string
}

interface GuestListModalProps {
    eventId: string
    eventName: string
    isOpen: boolean
    onClose: () => void
}

export default function GuestListModal({ eventId, eventName, isOpen, onClose }: GuestListModalProps) {
    const [guests, setGuests] = useState<Guest[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (isOpen && eventId) {
            setLoading(true)
            getEventGuestList(eventId)
                .then(data => setGuests(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        }
    }, [isOpen, eventId])

    if (!isOpen) return null

    const filtered = guests.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-4xl bg-[#111] border border-white/10 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-heading uppercase tracking-wide">Guest List</h2>
                        <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest">{eventName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/10 bg-[#0a0a0a]">
                    <input
                        type="text"
                        placeholder="Search Guest Name or Email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
                        autoFocus
                    />
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-0">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500">Loading guest list...</div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-black/50 text-xs uppercase font-bold text-slate-300 sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-3">Guest Name</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.length > 0 ? (
                                    filtered.map((g, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white text-lg">{g.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold border ${g.type.includes('VIP') || g.type.includes('Table')
                                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                        : 'bg-slate-700/30 text-slate-300 border-slate-700/50'
                                                    }`}>
                                                    {g.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="flex flex-col">
                                                    <span>{g.email}</span>
                                                    <span className="text-slate-500">{g.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* Future: Check-in button */}
                                                    <span className="text-green-500 font-bold uppercase text-xs">
                                                        {g.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No guests found matching search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/50 text-right text-xs text-slate-500">
                    Total Guests: {filtered.length}
                </div>
            </div>
        </div>
    )
}
