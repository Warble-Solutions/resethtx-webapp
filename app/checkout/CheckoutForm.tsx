'use client';

import { useState } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/result`,
            },
        });

        if (error) {
            setErrorMessage(error.message ?? 'An unknown error occurred');
            setLoading(false);
        }
        // If successful, redirect occurs automatically to return_url
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-lg border border-white/10 max-w-md mx-auto">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            <button
                disabled={!stripe || loading}
                className="w-full mt-6 bg-[#D4AF37] text-black font-bold py-3 px-6 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}
