import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        const { amount, eventId, quantity, metadata, ticketType } = await request.json();

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Missing Stripe Keys' }, { status: 500 });
        }

        if (amount === 0) {
            return NextResponse.json({ clientSecret: null, isFree: true });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                eventId,
                ticketType: ticketType || 'standard_ticket',
                quantity: quantity || 1,
                ...metadata
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Internal Error:', error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
