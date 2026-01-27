'use client';

import { useState } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';

// ... imports
import { updatePaymentIntent } from '@/app/actions/checkout';

export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // User Details State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        // 1. Update PaymentIntent with User Details (Server-Side)
        const paymentIntentId = clientSecret.split('_secret_')[0];
        const { success, error: updateError } = await updatePaymentIntent(paymentIntentId, {
            userName: name,
            userEmail: email,
            userPhone: phone,
            // Assuming quantity/eventId were set during creation, or we can add them here if passed as props
        });

        if (!success) {
            setErrorMessage('Failed to update booking details: ' + updateError);
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
            setErrorMessage(error.message ?? 'An unknown error occurred');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-lg border border-white/10 max-w-md mx-auto space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
            </div>

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
