import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { sendOrderConfirmation, sendAdminBookingNotification } from '@/lib/mail';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('Missing Stripe Webhook Secret');
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed.', error.message);
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    const supabase = await createClient();

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;

        // Extract Metadata
        const guestName = metadata.guestName || metadata.userName || 'Guest';
        const guestEmail = metadata.guestEmail || metadata.userEmail || '';
        const eventId = metadata.eventId;
        const ticketType = metadata.ticketType || 'standard_ticket';
        const quantity = parseInt(metadata.quantity || '1');
        const userPhone = metadata.userPhone || null;
        const guestDob = metadata.guestDob || metadata.userDob || null;

        if (!eventId) {
            console.error('Missing eventId in metadata', metadata);
            return NextResponse.json({ received: true }); // Acknowledge to stop retries even if bad data
        }

        // 0. Idempotency Check: Don't insert duplicate tickets
        const { data: existingTicket } = await supabase
            .from('ticket_purchases')
            .select('id')
            .eq('payment_intent_id', paymentIntent.id)
            .single();

        if (existingTicket) {
<<<<<<< Updated upstream
            console.log(`Webhook: Ticket for ${paymentIntent.id} already exists. Skipping.`);
            return NextResponse.json({ received: true });
        }

        // 1. Generate booking ref for emails & DB
        const bookingRef = 'RST-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        // 2. Insert into ticket_purchases
=======
            console.log(`[Stripe Webhook] Duplicate payment_intent ignored: ${paymentIntent.id}`);
            return NextResponse.json({ received: true });
        }

        const booking_ref = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // 1. Insert into ticket_purchases
>>>>>>> Stashed changes
        const { error: ticketError } = await supabase
            .from('ticket_purchases')
            .insert({
                event_id: eventId,
                user_name: guestName,
                user_email: guestEmail,
                user_phone: userPhone,
                guest_dob: guestDob,
                quantity: quantity,
                total_price: paymentIntent.amount / 100,
                status: 'paid',
                payment_intent_id: paymentIntent.id,
                ticket_type: ticketType,
<<<<<<< Updated upstream
                booking_ref: bookingRef
=======
                booking_ref: booking_ref
>>>>>>> Stashed changes
            });

        if (ticketError) {
            console.error('Error saving ticket:', ticketError);
            return NextResponse.json({ error: 'Database Error' }, { status: 500 });
        }

        console.log(`Ticket saved for ${guestName}`);

        // 3. Fetch event details for emails
        const { data: eventData } = await supabase
            .from('events')
            .select('title, date')
            .eq('id', eventId)
            .single();

        // 4. Send confirmation emails
        const tableSelection = metadata.tableSelection || null;
        const emailDetails = {
            eventName: eventData?.title || 'Event',
            date: eventData?.date || new Date().toISOString(),
            ticketType: ticketType,
            quantity: quantity,
            totalAmount: paymentIntent.amount / 100,
            name: guestName,
            email: guestEmail,
            tableSelection: tableSelection,
            bookingRef: booking_ref,
        };

        try {
            await sendOrderConfirmation(guestEmail, emailDetails, paymentIntent.id);
            console.log(`✅ Webhook: Confirmation email sent to ${guestEmail}`);
        } catch (emailErr) {
            console.error('❌ Webhook: Customer email failed (non-fatal):', emailErr);
        }

        try {
            await sendAdminBookingNotification(emailDetails);
            console.log(`✅ Webhook: Admin notification sent`);
        } catch (emailErr) {
            console.error('❌ Webhook: Admin email failed (non-fatal):', emailErr);
        }

        // 5. If Table Reservation, Insert into reservations
        if (ticketType === 'table_reservation' || ticketType === 'table') {
            const { error: reservationError } = await supabase
                .from('reservations')
                .insert({
                    full_name: guestName,
                    email: guestEmail,
                    phone: userPhone,
                    guests: quantity.toString(),
                    date: new Date().toISOString().split('T')[0],
                    status: 'confirmed',
                    special_requests: `Paid via Stripe (${paymentIntent.id})`
                });

            if (reservationError) {
                console.error('Error saving reservation:', reservationError);
            } else {
                console.log(`Reservation synced for ${guestName}`);
            }
        }
    }

    return NextResponse.json({ received: true });
}
