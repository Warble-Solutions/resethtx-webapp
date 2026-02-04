'use client'

import { useState } from 'react'

interface Customer {
    id: string
    name: string
    email: string
    phone: string
    totalSpend: number
    visitCount: number
    lastSeen: string
    dob?: string
}

export default function CustomerTable({ customers }: { customers: Customer[] }) {
    const [search, setSearch] = useState('')

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    const downloadCSV = () => {
        const headers = ['Name,Email,Phone,DOB,Total Spend,Visit Count,Last Seen']
        const rows = filtered.map(c =>
            `"${c.name}","${c.email}","${c.phone}","${c.dob || ''}",${c.totalSpend},${c.visitCount},"${c.lastSeen}"`
        )

        // Add BOM for Excel compatibility
        const csvString = '\uFEFF' + [headers, ...rows].join('\n')

        // Use Data URI with strict encoding
        // This avoids Blob/Object URL issues where Chrome might ignore the 'download' attribute
        const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString)

        const link = document.createElement("a")
        link.href = encodedUri
        link.setAttribute("download", "customers.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-black/50">
                <input
                    type="text"
                    placeholder="Search by Name or Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#D4AF37] w-full md:w-80"
                />

                <button
                    onClick={downloadCSV}
                    className="bg-white hover:bg-slate-200 text-black font-bold uppercase text-sm px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export CSV
                </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-black/50 text-xs uppercase font-bold text-slate-300">
                        <tr>
                            <th className="px-6 py-4">Customer Name</th>
                            <th className="px-6 py-4">Contact Info</th>
                            <th className="px-6 py-4">DOB</th>
                            <th className="px-6 py-4 text-center">Visits</th>
                            <th className="px-6 py-4 text-right">Total Spend</th>
                            <th className="px-6 py-4 text-right">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.length > 0 ? (
                            filtered.map((c) => (
                                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-white text-lg group-hover:text-[#D4AF37] transition-colors">{c.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white">{c.email}</span>
                                            <span className="text-xs text-slate-500">{c.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {c.dob || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono font-bold text-xs">{c.visitCount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-[#D4AF37] text-lg">
                                        ${c.totalSpend.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs">
                                        {new Date(c.lastSeen).toLocaleDateString('en-US')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-white/5">
                {filtered.length > 0 ? (
                    filtered.map((c) => (
                        <div key={c.id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-white text-lg">{c.name}</div>
                                    <div className="text-sm text-slate-400">{c.email}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[#D4AF37] font-bold text-lg">${c.totalSpend.toLocaleString()}</div>
                                    <div className="text-xs text-slate-500">{c.visitCount} visits</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/5">
                                <div>{c.phone}</div>
                                <div>Last Seen: {new Date(c.lastSeen).toLocaleDateString('en-US')}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-slate-500 italic">No customers found.</div>
                )}
            </div>

            <div className="p-4 bg-black/50 border-t border-white/10 text-right text-xs text-slate-500">
                Total Unique Customers: {filtered.length}
            </div>
        </div>
    )
}
