/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

 
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cancelBooking } from '@/app/actions/cancel';

function CancelFormContent() {
    const searchParams = useSearchParams();

    // Read from URL if available
    const urlRef = searchParams.get('ref');
    const urlEmail = searchParams.get('email');

    const [bookingRef, setBookingRef] = useState(urlRef || '');
    const [email, setEmail] = useState(urlEmail || '');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleCancel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingRef || !email) {
            setStatus('error');
            setMessage('Please enter both your Booking Reference ID and Email Address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await cancelBooking({ bookingRef, email });
            if (response.success) {
                setStatus('success');
                setMessage(response.message || 'Your booking has been cancelled successfully.');
            } else {
                setStatus('error');
                setMessage(response.error || 'Failed to cancel booking. Please check your details.');
            }
         
        } catch (error: unknown) {
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="max-w-md w-full bg-[#111] border border-[#333] p-8 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center tracking-wider">CANCEL BOOKING</h1>

            <p className="text-gray-400 text-sm mb-6 text-center">
                Enter your Booking Reference ID and the email address used for the booking. If eligible, your refund will be processed automatically to your original payment method.
            </p>

            {status === 'success' ? (
                <div className="bg-green-900/40 border border-green-500/50 text-green-200 p-4 rounded-md mb-6 text-center">
                    {message}
                </div>
            ) : (
                <form onSubmit={handleCancel} className="space-y-4">
                    {status === 'error' && (
                        <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-md text-sm">
                            {message}
                        </div>
                    )}

                    <div>
                        <label htmlFor="bookingRef" className="block text-sm font-medium text-gray-300 mb-1">
                            Booking Reference ID
                        </label>
                        <input
                            type="text"
                            id="bookingRef"
                            value={bookingRef}
                            onChange={(e) => setBookingRef(e.target.value)}
                            placeholder="RST-..."
                            className="w-full bg-[#222] border border-[#444] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                            disabled={status === 'loading'}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-[#222] border border-[#444] rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                            disabled={status === 'loading'}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3 px-4 rounded-md transition-colors mt-6 disabled:opacity-50 flex justify-center items-center"
                    >
                        {status === 'loading' ? (
                            <span className="flex gap-2 items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Cancel My Booking'
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div className="text-gray-400">Loading cancellation form...</div>}>
                <CancelFormContent />
            </Suspense>
        </div>
    );
}
