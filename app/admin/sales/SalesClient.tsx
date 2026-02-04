'use client'

import { useState } from 'react'
import TransactionTable from '../components/TransactionTable'
import EventSalesCard from '../components/EventSalesCard'
import GuestListModal from '../components/GuestListModal'

export default function SalesClient({ transactions, events }: { transactions: any[], events: any[] }) {
    const [activeTab, setActiveTab] = useState<'transactions' | 'events'>('transactions')

    // Guest List Modal State
    const [selectedEvent, setSelectedEvent] = useState<{ id: string, title: string } | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase tracking-tight text-white mb-2">
                        Sales & <span className="text-[#D4AF37]">Guest Lists</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">Manage transactions, track revenue, and monitor guest lists.</p>
                </div>

                {/* Tabs */}
                <div className="flex w-full md:w-auto bg-[#111] p-1 rounded-lg border border-white/10 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'transactions'
                            ? 'bg-[#D4AF37] text-black shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'events'
                            ? 'bg-[#D4AF37] text-black shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        By Event
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'transactions' ? (
                    <TransactionTable transactions={transactions} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <EventSalesCard
                                key={event.id}
                                event={event}
                                onClick={() => {
                                    setSelectedEvent({ id: event.id, title: event.title })
                                    setIsModalOpen(true)
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <GuestListModal
                isOpen={isModalOpen}
                eventId={selectedEvent?.id || ''}
                eventName={selectedEvent?.title || ''}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
