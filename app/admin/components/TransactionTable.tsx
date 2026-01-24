'use client'

import { useState } from 'react'

interface Transaction {
    id: string
    type: string
    customer_name: string
    event_name: string
    amount: number
    date: string
    details: string
    status: string
}

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
    const [search, setSearch] = useState('')
    const [filterEvent, setFilterEvent] = useState('')

    // Get unique event names for filter
    const eventNames = Array.from(new Set(transactions.map(t => t.event_name)))

    const filtered = transactions.filter(t => {
        const matchesSearch = t.customer_name.toLowerCase().includes(search.toLowerCase())
        const matchesEvent = filterEvent ? t.event_name === filterEvent : true
        return matchesSearch && matchesEvent
    })

    return (
        <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Search Customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#D4AF37] w-full md:w-64 text-sm"
                />

                <select
                    value={filterEvent}
                    onChange={(e) => setFilterEvent(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#D4AF37] w-full md:w-64 text-sm"
                >
                    <option value="">All Events</option>
                    {eventNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-black/50 text-xs uppercase font-bold text-slate-300">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-right">Date</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.length > 0 ? (
                            filtered.map((t) => (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{t.customer_name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${t.type.includes('Table')
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white">{t.event_name}</td>
                                    <td className="px-6 py-4">{t.details}</td>
                                    <td className="px-6 py-4 text-right font-bold text-[#D4AF37]">
                                        ${t.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs">
                                        {new Date(t.date).toLocaleDateString('en-US')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${t.status === 'paid' || t.status === 'confirmed' ? 'text-green-500 bg-green-500/10' : 'text-slate-500 bg-slate-500/10'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 italic">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
