import { Suspense } from 'react'
import { finalizeGeneralReservation } from '@/app/actions/reservations'
import Link from 'next/link'

interface PageProps {
    searchParams: Promise<{ payment_intent?: string; payment_intent_client_secret?: string; redirect_status?: string }>
}

async function ResultContent({ searchParams }: PageProps) {
    const params = await searchParams
    const paymentIntentId = params.payment_intent
    const redirectStatus = params.redirect_status

    // Payment was cancelled or failed before being confirmed
    if (!paymentIntentId || redirectStatus !== 'succeeded') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="font-heading text-3xl text-white uppercase tracking-widest mb-3">Payment Failed</h2>
                    <p className="text-slate-400 mb-8">
                        Your payment was not completed. No charge was made. Please try again.
                    </p>
                    <Link
                        href="/reset-booking"
                        className="inline-block px-8 py-3 bg-white hover:bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        )
    }

    // Finalize: verify Stripe PaymentIntent → insert to DB → send emails
    const result = await finalizeGeneralReservation(paymentIntentId)

    if (!result.success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="font-heading text-3xl text-white uppercase tracking-widest mb-3">Something Went Wrong</h2>
                    <p className="text-slate-400 mb-2">
                        Your payment was received but we encountered an error saving your reservation.
                    </p>
                    <p className="text-slate-500 text-sm mb-8">
                        Please contact us and reference your payment ID:<br />
                        <span className="text-slate-400 font-mono text-xs">{paymentIntentId}</span>
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    const { bookingRef, details } = result
    const formattedDate = details?.date
        ? new Date(details.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        })
        : ''

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
            <div className="max-w-md w-full text-center">

                {/* Success Icon */}
                <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[4px] mb-3">Reservation Confirmed</p>
                <h2 className="font-heading text-4xl text-white uppercase tracking-widest mb-3">See You Soon!</h2>
                <p className="text-slate-400 mb-8">
                    Your $50 reservation fee has been paid and your table is secured. A confirmation email is on its way.
                </p>

                {/* Booking card */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden mb-8 text-left">
                    {/* Gold bar */}
                    <div className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#F0DEAA]" />
                    <div className="p-6">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Booking Reference</div>
                        <div className="text-2xl font-heading font-bold text-[#D4AF37] mb-5">{bookingRef}</div>

                        <div className="space-y-3 text-sm">
                            {details?.full_name && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Guest</span>
                                    <span className="text-white font-semibold">{details.full_name}</span>
                                </div>
                            )}
                            {formattedDate && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date</span>
                                    <span className="text-white font-semibold">{formattedDate}</span>
                                </div>
                            )}
                            {details?.time && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Time</span>
                                    <span className="text-white font-semibold">{details.time}</span>
                                </div>
                            )}
                            {details?.guests && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Party Size</span>
                                    <span className="text-white font-semibold">{details.guests} {details.guests === 1 ? 'guest' : 'guests'}</span>
                                </div>
                            )}
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="text-slate-500">Reservation Fee</span>
                                <span className="text-green-400 font-bold">$50.00 Paid ✓</span>
                            </div>
                        </div>
                    </div>
                </div>

                {details?.email && (
                    <p className="text-xs text-slate-600 mb-6">
                        Confirmation sent to <span className="text-slate-400">{details.email}</span>
                    </p>
                )}

                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default function ResetBookingResultPage(props: PageProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Confirming your reservation...</p>
                </div>
            </div>
        }>
            <ResultContent {...props} />
        </Suspense>
    )
}
