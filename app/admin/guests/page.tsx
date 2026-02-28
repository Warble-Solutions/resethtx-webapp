'use client';

import { useState, useEffect } from 'react';
import { getDailyGuestList } from '@/app/actions/guests';
import { generateDailyGuestListPDF } from '@/lib/generatePdf';

export default function GuestListPage() {
    const [selectedDate, setSelectedDate] = useState<string>(''); // Empty = All Upcoming
    const [guestsData, setGuestsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Fetch data whenever selectedDate changes
    useEffect(() => {
        const fetchGuests = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await getDailyGuestList(selectedDate);
                if (response.success) {
                    setGuestsData(response.data || []);
                } else {
                    setError(response.error || 'Failed to fetch guest list data.');
                }
            } catch (err) {
                console.error('Fetch err:', err);
                setError('An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGuests();
    }, [selectedDate]);

    const handleDownloadPdf = () => {
        if (guestsData.length === 0) {
            alert('No data to download.');
            return;
        }
        const titleDate = selectedDate ? selectedDate : 'All_Upcoming_Dates';
        generateDailyGuestListPDF(titleDate, guestsData);
    };

    const handleClearDate = () => {
        setSelectedDate('');
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Guest Lists</h1>
                    <p className="text-slate-400 mt-1">
                        {selectedDate ? `Displaying guests for ${new Date(selectedDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}` : 'Displaying all upcoming active guests.'}
                    </p>
                </div>

                {/* Controls Area */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
                    <div className="flex relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-300 font-medium py-2.5 px-3 rounded-lg focus:outline-none focus:border-[#D4AF37] w-full"
                        />
                        {selectedDate && (
                            <button
                                onClick={handleClearDate}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                title="Clear date selection"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleDownloadPdf}
                        disabled={isLoading || guestsData.length === 0}
                        className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium py-2.5 px-5 rounded-lg transition-all shadow-lg whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <svg className="animate-spin h-8 w-8 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : error ? (
                <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded-lg text-center">
                    {error}
                </div>
            ) : guestsData.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-12 text-center">
                    <p className="text-slate-400 text-lg">No guests found for this selection.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {guestsData.map((eventData, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">{eventData.eventName}</h2>
                                    <p className="text-xs text-[#D4AF37] mt-1 font-mono">{eventData.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : 'No Date'}</p>
                                </div>
                                <span className="text-sm text-slate-400 font-medium px-3 py-1 bg-slate-800 rounded-full">
                                    {eventData.guests.length} Guests
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Guest Name</th>
                                            <th className="px-6 py-3 font-semibold">Ticket Type</th>
                                            <th className="px-6 py-3 font-semibold">Table</th>
                                            <th className="px-6 py-3 font-semibold text-center">Qty</th>
                                            <th className="px-6 py-3 font-semibold text-right">Booking Ref</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {eventData.guests.map((guest: any, guestIdx: number) => (
                                            <tr key={guestIdx} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {guest.guest_name}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {guest.ticket_type.replace('_', ' ')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {guest.table_selection === 'N/A' ? (
                                                        <span className="text-slate-500">N/A</span>
                                                    ) : (
                                                        <span className="text-[#D4AF37] font-medium">{guest.table_selection}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium">
                                                    {guest.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs font-mono text-slate-500">
                                                    {guest.booking_ref}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
