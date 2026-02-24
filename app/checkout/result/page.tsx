'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import getStripe from '@/utils/get-stripe';
import { finalizeTicketPurchase } from '@/app/actions/checkout';

export default function CheckoutResultPage() {
    const searchParams = useSearchParams();
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

    // Status state
    // Status state
    const [status, setStatus] = useState<'loading' | 'success' | 'processing' | 'error'>(paymentIntentClientSecret ? 'loading' : 'error');
    const [message, setMessage] = useState(paymentIntentClientSecret ? '' : 'No payment info found.');

    useEffect(() => {
        if (!paymentIntentClientSecret) return;

        getStripe().then((stripe) => {
            if (!stripe) return;

            stripe.retrievePaymentIntent(paymentIntentClientSecret).then(({ paymentIntent }) => {
                if (!paymentIntent) {
                    setStatus('error');
                    setMessage('Could not retrieve payment details.');
                    return;
                }

                switch (paymentIntent.status) {
                    case 'succeeded':
                        setMessage('Payment succeeded! Finalizing ticket...');
                        // Trigger server action to finalize
                        // Trigger server action to finalize
                        finalizeTicketPurchase(paymentIntent.id).then((result) => {
                            if (result.success) {
                                setStatus('success');
                                setMessage(result.message || 'Payment succeeded! Your ticket has been reserved.');

                                // Trigger Email if not sent
                                const sentKey = `email_sent_${paymentIntent.id}`;
                                if (!sessionStorage.getItem(sentKey) && result.bookingDetails) {
                                    fetch('/api/send-email', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            to: result.bookingDetails.email,
                                            details: result.bookingDetails
                                        })
                                    }).then(() => {
                                        sessionStorage.setItem(sentKey, 'true');
                                        console.log('Confirmation email triggered.');
                                    }).catch(err => console.error('Email trigger failed', err));
                                }
                            } else {
                                setStatus('error');
                                setMessage(result.error || 'Payment succeeded but ticket recording failed. Please contact support.');
                            }
                        });
                        break;
                    case 'processing':
                        setStatus('processing');
                        setMessage('Your payment is processing.');
                        break;
                    case 'requires_payment_method':
                        setStatus('error');
                        setMessage('Payment failed. Please try again.');
                        break;
                    default:
                        setStatus('error');
                        setMessage('Something went wrong.');
                        break;
                }
            });
        });
    }, [paymentIntentClientSecret]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-lg text-center">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-300">Verifying payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            ✓
                        </div>
                        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Success!</h1>
                        <p className="text-slate-300 mb-8">{message}</p>
                        <Link
                            href="/"
                            className="block w-full bg-[#D4AF37] text-black font-bold py-3 px-6 rounded hover:bg-white transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                )}

                {status === 'processing' && (
                    <div>
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-2xl font-bold text-blue-500 mb-2">Processing...</h1>
                        <p className="text-slate-300 mb-8">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            ✕
                        </div>
                        <h1 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h1>
                        <p className="text-slate-300 mb-8">{message}</p>
                        <Link
                            href="/checkout"
                            className="block w-full bg-slate-800 text-white font-bold py-3 px-6 rounded hover:bg-slate-700 transition-colors"
                        >
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
