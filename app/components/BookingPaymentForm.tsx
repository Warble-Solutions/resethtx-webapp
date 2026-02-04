'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { updatePaymentIntent } from '@/app/actions/checkout';

interface BookingPaymentFormProps {
    amount: number;
    clientSecret: string;
    onSuccess?: () => void;
    metadata: {
        userName: string;
        userEmail: string;
        userPhone: string;
        guestName?: string;
        guestEmail?: string;
    };
}

export default function BookingPaymentForm({ amount, clientSecret, onSuccess, metadata }: BookingPaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        // 1. Update PaymentIntent with latest Metadata (Double check)
        const paymentIntentId = clientSecret.split('_secret_')[0];
        const { success, error: updateError } = await updatePaymentIntent(paymentIntentId, metadata);

        if (!success) {
            setErrorMessage('Failed to setup payment: ' + updateError);
            setLoading(false);
            return;
        }

        // 2. Confirm Payment
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/result`,
            },
        });

        if (error) {
            setErrorMessage(error.message ?? 'Payment failed');
            setLoading(false);
        } else {
            // onSuccess not really needed if redirecting, but nice to have
            onSuccess?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Total Due</p>
                <p className="text-[#D4AF37] font-heading text-3xl font-bold">${amount.toFixed(2)}</p>
            </div>

            <PaymentElement options={{ layout: 'tabs' }} />

            {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                    {errorMessage}
                </div>
            )}

            <button
                disabled={!stripe || loading}
                className="w-full bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing Secure Payment...' : `Make Payment`}
            </button>
        </form>
    );
}
