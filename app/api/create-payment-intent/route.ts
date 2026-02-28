import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { checkTableAvailability } from '@/utils/checkAvailability';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const { amount, eventId, quantity, metadata, ticketType, name, email, userDob, tableId, tableName } = await request.json();

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Missing Stripe Keys' }, { status: 500 });
        }

        if (amount === 0) {
            return NextResponse.json({ clientSecret: null, isFree: true });
        }

        const supabase = await createClient();

        // EVENT TIME CUTOFF CHECK
        if (eventId) {
            const { data: eventData } = await supabase.from('events').select('date, time, is_sold_out').eq('id', eventId).single();
            if (eventData) {
                if (eventData.is_sold_out) {
                    return NextResponse.json({ error: 'Event is sold out' }, { status: 400 });
                }

                if (eventData.date) {
                    const datePart = eventData.date.includes('T') ? eventData.date.split('T')[0] : eventData.date;
                    const timePart = eventData.time || '00:00:00';
                    const [year, month, day] = datePart.split('-').map(Number);
                    const [hours, minutes, seconds] = timePart.split(':').map(Number);

                    const eventTimeMs = Date.UTC(year, month - 1, day, hours, minutes, seconds || 0);

                    const nowHoustonStr = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
                    const nowHouston = new Date(nowHoustonStr);
                    const nowHoustonMs = Date.UTC(
                        nowHouston.getFullYear(), nowHouston.getMonth(), nowHouston.getDate(),
                        nowHouston.getHours(), nowHouston.getMinutes(), nowHouston.getSeconds()
                    );

                    const cutoffMs = eventTimeMs - (60 * 60 * 1000);

                    if (nowHoustonMs > cutoffMs) {
                        return NextResponse.json({ error: 'Bookings are closed. Event starts in less than an hour or has ended.' }, { status: 400 });
                    }
                }
            }
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
