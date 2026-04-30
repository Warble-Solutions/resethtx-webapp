'use client'

import React, { useEffect, useState } from 'react'
import { getEventTables, getTakenTables } from '@/app/actions/event-booking'
import { getGeneralTablesAvailability } from '@/app/admin/reservations/actions-manual'

interface Table {
    id: string
    name: string
    capacity: number
    price: number
    category: string
    isBooked?: boolean
}

interface TableSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    eventId?: string
    date?: string
    showFeeNote?: boolean
    onSelectTable: (table: Table) => void
}

export default function TableSelectionModal({ isOpen, onClose, eventId, date, showFeeNote, onSelectTable }: TableSelectionModalProps) {
    const [tables, setTables] = useState<Table[]>([])
    const [takenTableIds, setTakenTableIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isOpen) return
        if (!eventId && !date) return

        const fetchTables = async () => {
            setLoading(true)
            
            if (eventId) {
                // Event Table Fetching
                const [tablesRes, takenRes] = await Promise.all([
                    getEventTables(eventId),
                    getTakenTables(eventId)
                ])

                if (tablesRes.success && tablesRes.tables) {
                    setTables(tablesRes.tables)
                } else {
                    setTables([])
                }

                if (takenRes.success && takenRes.takenTables) {
                    setTakenTableIds(new Set(takenRes.takenTables))
                } else {
                    setTakenTableIds(new Set())
                }
            } else if (date) {
                // General Table Fetching
                const generalRes = await getGeneralTablesAvailability(date)
                if (generalRes.success && generalRes.tables) {
                    setTables(generalRes.tables)
                    // The isBooked property is already set inside the backend action
                    setTakenTableIds(new Set()) 
                } else {
                    setTables([])
                    setTakenTableIds(new Set())
                }
            }
            
            setLoading(false)
        }

        fetchTables()
    }, [isOpen, eventId, date])

    if (!isOpen) return null

    // Strict Sort Order
    const categoryOrder = ['Lounge', 'Dance Floor', 'Dj Booth', 'Patio', 'Table Top']

    const groupedTables = tables.reduce((acc, table) => {
        const cat = table.category || 'Standard'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(table)
        return acc
    }, {} as Record<string, Table[]>)

    const presentCategories = Object.keys(groupedTables)
    const sortedCategories = [
        ...categoryOrder.filter(c => presentCategories.includes(c)),
        ...presentCategories.filter(c => !categoryOrder.includes(c) && c !== 'Standard'),
        ...(presentCategories.includes('Standard') ? ['Standard'] : [])
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#111] border border-[#D4AF37] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-wider">
                        Select a <span className="text-[#D4AF37]">Table</span>
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {showFeeNote && (
                    <div className="bg-black/50 p-4 md:p-6 border-b border-white/5">
                        <div className="flex gap-4">
                            <div className="mt-0.5 text-[#D4AF37]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Reservation Fee Required</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Table bookings require a <strong className="text-white">$50 reservation fee</strong>. This fee secures your spot and does not go towards your tab. Additionally, all table reservations require a <strong className="text-white">minimum purchase of 1 bottle</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#D4AF37] scrollbar-track-black">
                    {loading ? (
                        <div className="text-center text-[#D4AF37] py-20 animate-pulse font-bold uppercase tracking-widest">
                            Loading tables...
                        </div>
                    ) : tables.length === 0 ? (
                        <div className="text-center text-slate-400 py-20 uppercase font-bold tracking-wider">
                            No tables available for this date.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {sortedCategories.map(category => (
                                <div key={category}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <h3 className="text-[#D4AF37] font-bold text-xl uppercase tracking-widest whitespace-nowrap px-4 border-l-4 border-[#D4AF37]">
                                            {category}
                                        </h3>
                                        <div className="h-[1px] bg-white/10 w-full"></div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {groupedTables[category].map(table => {
                                            const isBooked = table.isBooked || takenTableIds.has(table.id)
                                            return (
                                                <button
                                                    key={table.id}
                                                    onClick={() => {
                                                        if (!isBooked) {
                                                            onSelectTable(table)
                                                            onClose()
                                                        }
                                                    }}
                                                    disabled={isBooked}
                                                    className={`
                                                        relative p-4 rounded-xl border transition-all duration-300 text-left group flex flex-col justify-between min-h-[100px]
                                                        ${isBooked
                                                            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed grayscale'
                                                            : 'border-zinc-800 bg-[#0a0a0a] text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105'
                                                        }
                                                    `}
                                                >
                                                    {!isBooked && (
                                                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#D4AF37]" />
                                                    )}
                                                    <div>
                                                        <div className="font-heading font-bold text-lg mb-1 leading-tight">{table.name}</div>
                                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-300">
                                                            Max {table.capacity} Guests
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
