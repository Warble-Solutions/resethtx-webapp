/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { checkTableAvailability } from '@/utils/checkAvailability';

export async function POST(request: Request) {
    try {
        const { amount, eventId, quantity, metadata, ticketType, name, email, userDob, tableId, tableName } = await request.json();

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Missing Stripe Keys' }, { status: 500 });
        }

        if (amount === 0) {
            return NextResponse.json({ clientSecret: null, isFree: true });
        }

        // INVENTORY CHECK
        if (ticketType === 'table_reservation' || ticketType === 'table') {
            const avail = await checkTableAvailability(eventId);
            if (avail.available <= 0) {
                return NextResponse.json({ error: 'Sold Out' }, { status: 400 });
            }
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                eventId,
                ticketType: ticketType || 'standard_ticket',
                quantity: quantity || 1,
                guestName: name || metadata?.guestName,
                guestEmail: email || metadata?.guestEmail,
                dob: userDob || metadata?.userDob,
                tableSelection: tableId ? `${tableName} (${tableId})` : metadata?.tableName,
                tableId: tableId || metadata?.tableId,
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
