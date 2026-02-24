'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

import getStripe from '@/utils/get-stripe';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = getStripe();

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');
    const quantity = searchParams.get('quantity') || '1';
    const amountParam = searchParams.get('amount'); // Optional override for testing

    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFree, setIsFree] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        // Create PaymentIntent as soon as the page loads
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amountParam ? parseInt(amountParam) : 2000,
                eventId: eventId,
                quantity: parseInt(quantity) // Pass quantity too if API supports it later
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.isFree) {
                    setIsFree(true);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                }
            })
            .catch(() => setError('Network Error'))
            .finally(() => setLoading(false));
    }, [eventId, amountParam, quantity]);

    if (!eventId) {
        return (
            <div className="min-h-screen bg-black text-white py-20 px-4">
                <h1 className="text-3xl font-bold text-center mb-10 text-[#D4AF37]">Complete Your Purchase</h1>
                <div className="text-center text-red-500 bg-red-500/10 p-4 rounded max-w-md mx-auto border border-red-500/20">
                    <p className="font-bold">Error</p>
                    <p className="text-sm mt-1 opacity-80">No event specified.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <h1 className="text-3xl font-bold text-center mb-10 text-[#D4AF37]">Complete Your Purchase</h1>

            {loading && (
                <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 bg-red-500/10 p-4 rounded max-w-md mx-auto border border-red-500/20">
                    <p className="font-bold">Payment System Offline</p>
                    <p className="text-sm mt-1 opacity-80">{error}</p>
                </div>
            )}

            {isFree && (
                <div className="text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                    <h3 className="text-2xl font-heading text-white mb-2">RSVP Confirmed</h3>
                    <p className="text-slate-400 text-sm mb-6">This event is free! Your spot has been reserved.</p>
                </div>
            )}

            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#D4AF37' } } }}>
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    );
}
