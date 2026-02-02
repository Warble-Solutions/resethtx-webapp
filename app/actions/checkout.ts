'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'

export async function updatePaymentIntent(paymentIntentId: string, metadata: any) {
    try {
        await stripe.paymentIntents.update(paymentIntentId, { metadata });
        return { success: true };
    } catch (error: any) {
        console.error('Error updating payment intent:', error);
        return { success: false, error: error.message };
    }
}

interface PurchaseDetails {
    eventId: string
    userName: string
    userEmail: string
    userPhone: string
    userDob: string
    quantity: number
    couponCode?: string
    bookingDetails?: any // NEW
    ticketType?: string // NEW
}

// NOTE: This currently mocks the Stripe integration
export async function purchaseTickets({ eventId, userName, userEmail, userPhone, userDob, quantity, couponCode, bookingDetails, ticketType }: PurchaseDetails) {
    const supabase = await createClient()

    // 0. Validate Age (Server-Side)
    const today = new Date()
    const birthDate = new Date(userDob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    if (age < 21) {
        return { success: false, error: 'You must be 21+ to purchase tickets.' }
    }

    // 1. Fetch Event Details (Partial fetch OK for simple validation)
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('ticket_price, ticket_capacity, title, table_price') // Added table_price
        .eq('id', eventId)
        .single()

    if (eventError || !event) {
        return { success: false, error: 'Event not found' }
    }

    // Calculate Price
    let totalPrice = 0
    if (ticketType === 'table_reservation') {
        // Table Reservation Logic: Price is fixed per table (mock logic) or passed?
        // Ideally should match event.table_price
        // For now, trust the fee associated with event or passed logic? 
        // Better: use event.table_price
        totalPrice = (event.table_price || 50) * quantity // quantity usually 1 for table
    } else {
        // Standard Ticket
        totalPrice = event.ticket_price * quantity
    }

    const isFree = totalPrice === 0

    // 2. Handle Free Tickets / RSVP
    if (isFree) {
        const { error: insertError } = await supabase
            .from('ticket_purchases')
            .insert({
                event_id: eventId,
                user_name: userName,
                user_email: userEmail,
                user_phone: userPhone,
                guest_dob: userDob,
                quantity: quantity,
                total_price: 0,
                status: 'free',
                payment_intent_id: null,
                coupon_code: couponCode || null,
                booking_details: bookingDetails || null, // NEW
                ticket_type: ticketType || 'standard_ticket' // NEW
            })

        if (insertError) {
            console.error('RSVP Error:', insertError)
            return { success: false, error: `Failed to process RSVP: ${insertError.message}` }
        }

        return { success: true, message: 'RSVP Confirmed!' }
    }

    // 3. Handle Paid Tickets (Mock)
    // In a real implementation, this would create a Stripe Session and return the URL

    // Simulate successful payment record for now (or a "pending" record waiting for webhook)
    const { error: insertError } = await supabase
        .from('ticket_purchases')
        .insert({
            event_id: eventId,
            user_name: userName,
            user_email: userEmail,
            user_phone: userPhone,
            guest_dob: userDob,
            quantity: quantity,
            total_price: totalPrice,
            status: 'paid', // Mocking instant success
            payment_intent_id: 'mock_pi_' + Date.now(),
            coupon_code: couponCode || null,
            booking_details: bookingDetails || null, // NEW
            ticket_type: ticketType || 'standard_ticket' // NEW
        })

    if (insertError) {
        console.error('Purchase Error:', insertError)
        return { success: false, error: 'Failed to process purchase' }
    }

    // 4. If Table Reservation, sync with event_bookings for availability
    if (ticketType === 'table_reservation' && bookingDetails?.tableId) {
        const { error: bookingError } = await supabase
            .from('event_bookings')
            .insert({
                event_id: eventId,
                table_id: bookingDetails.tableId,
                customer_name: userName,
                customer_email: userEmail,
                guest_phone: userPhone,
                guest_dob: userDob,
                status: 'confirmed' // Mark as taken
            })

        if (bookingError) {
            console.error('Table Booking Sync Error:', bookingError)
            // Optional: Refund/Compensate logic here if strict transaction needed
        }
    }

    // Mocking a redirect URL
    return { success: true, message: 'Tickets Purchased!', redirectUrl: '/events/' + eventId + '?success=true' }
}

export async function finalizeTicketPurchase(paymentIntentId: string) {
    const supabase = await createClient();

    try {
        // 1. Verify Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return { success: false, error: 'Payment not successful' };
        }

        // 2. Check if already recorded to avoid duplicates
        const { data: existing } = await supabase
            .from('ticket_purchases')
            .select('id')
            .eq('payment_intent_id', paymentIntentId)
            .single();

        if (existing) {
            return { success: true, message: 'Ticket already recorded' };
        }

        // 3. Extract metadata
        const { eventId, userName, userEmail, userPhone, quantity, ticketType } = paymentIntent.metadata || {};

        if (!eventId || !userName || !userEmail) {
            return { success: false, error: 'Missing metadata in payment intent' };
        }

        // 4. Insert Ticket
        const { error: insertError } = await supabase
            .from('ticket_purchases')
            .insert({
                event_id: eventId,
                user_name: userName,
                user_email: userEmail,
                user_phone: userPhone || null,
                quantity: parseInt(quantity || '1'),
                total_price: paymentIntent.amount / 100, // Convert back to dollars (or whatever unit DB expects)
                status: 'paid',
                payment_intent_id: paymentIntentId,
                ticket_type: ticketType || 'standard_ticket'
            });

        if (insertError) {
            console.error('Finalize Purchase Error:', insertError);
            return { success: false, error: 'Failed to record ticket: ' + insertError.message };
        }

        // 5. Fetch Event Details for Email
        const { data: eventData } = await supabase
            .from('events')
            .select('title, date')
            .eq('id', eventId)
            .single();

        const bookingDetails = {
            eventName: eventData?.title || 'Event',
            date: eventData?.date || new Date().toISOString(),
            ticketType: ticketType || 'standard_ticket',
            quantity: parseInt(quantity || '1'),
            totalAmount: paymentIntent.amount / 100,
            name: userName,
            email: userEmail // Return email too so client knows where to send
        };

        return { success: true, message: 'Ticket secured!', bookingDetails };

    } catch (error: any) {
        console.error('Finalize Error:', error);
        return { success: false, error: error.message };
    }
}
