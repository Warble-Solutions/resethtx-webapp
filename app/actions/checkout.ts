'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'
import { sendOrderConfirmation, sendAdminBookingNotification } from '@/lib/mail'

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
        .select('ticket_price, ticket_capacity, title, table_price, date, is_sold_out') // Added table_price and date and is_sold_out
        .eq('id', eventId)
        .single()

    if (eventError || !event) {
        return { success: false, error: 'Event not found' }
    }

    // 1.5 Validate Sold Out Status
    if (event.is_sold_out) {
        return { success: false, error: 'Sorry, this event is completely sold out.' }
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
        const bookingRef = 'RST-' + Math.random().toString(36).substr(2, 6).toUpperCase()

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
                ticket_type: ticketType || 'standard_ticket', // NEW
                booking_ref: bookingRef
            })

        if (insertError) {
            console.error('RSVP Error:', insertError)
            return { success: false, error: `Failed to process RSVP: ${insertError.message}` }
        }

        await sendOrderConfirmation(userEmail, {
            eventName: event.title,
            date: event.date || new Date().toISOString(),
            ticketType: 'General Admission / Free RSVP',
            quantity: quantity,
            totalAmount: '0.00',
            name: userName,
            tableSelection: 'N/A',
            bookingRef: bookingRef
        });

        await sendAdminBookingNotification({
            eventName: event.title,
            date: event.date || new Date().toISOString(),
            ticketType: 'Free RSVP',
            quantity: quantity,
            totalAmount: '0.00',
            name: userName,
            email: userEmail,
            bookingRef: bookingRef
        });

        return { success: true, message: 'RSVP Confirmed!' }
    }

    // 3. Handle Paid Tickets (Mock)
    // In a real implementation, this would create a Stripe Session and return the URL

    // Simulate successful payment record for now (or a "pending" record waiting for webhook)
    const bookingRef = 'RST-' + Math.random().toString(36).substr(2, 6).toUpperCase()

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
            ticket_type: ticketType || 'standard_ticket', // NEW
            booking_ref: bookingRef
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
        // 3. Extract metadata
        const { eventId, userName, userEmail, userPhone, quantity, ticketType, guestName, guestEmail, dob, tableSelection, tableId } = paymentIntent.metadata || {};

        const finalName = guestName || userName;
        const finalEmail = guestEmail || userEmail;

        if (!eventId || !finalName || !finalEmail) {
            return { success: false, error: 'Missing metadata in payment intent' };
        }

        // 4. Insert Ticket
        const bookingRef = 'RST-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const { error: insertError } = await supabase
            .from('ticket_purchases')
            .insert({
                event_id: eventId,
                user_name: finalName,
                user_email: finalEmail,
                user_phone: userPhone || null,
                quantity: parseInt(quantity || '1'),
                total_price: paymentIntent.amount / 100, // Convert back to dollars (or whatever unit DB expects)
                status: 'paid',
                payment_intent_id: paymentIntentId,
                ticket_type: ticketType || 'standard_ticket',
                guest_dob: dob || null,
                booking_details: tableSelection ? { tableSelection } : null,
                booking_ref: bookingRef
            });

        if (insertError) {
            console.error('Finalize Purchase Error:', insertError);
            return { success: false, error: 'Failed to record ticket: ' + insertError.message };
        }

        // 4.5. If Table Reservation, Insert into reservations (Client-Side Verification Fallback)
        if (ticketType === 'table_reservation' || ticketType === 'table') {
            const { error: reservationError } = await supabase
                .from('reservations')
                .insert({
                    full_name: finalName,
                    email: finalEmail,
                    phone: userPhone,
                    guests: quantity.toString(),
                    date: new Date().toISOString().split('T')[0], // Default to today/booking date since event date isn't easily avail in metadata
                    status: 'confirmed',
                    special_requests: `Paid via Stripe (${paymentIntentId}) - Verified Client-Side. Table: ${tableSelection || 'N/A'}`
                });

            // 4.6 Sync with event_bookings (CRITICAL for availability check)
            if (tableId) {
                const { error: bookingError } = await supabase
                    .from('event_bookings')
                    .insert({
                        event_id: eventId,
                        table_id: tableId,
                        customer_name: finalName,
                        customer_email: finalEmail,
                        guest_phone: userPhone,
                        guest_dob: dob,
                        status: 'confirmed'
                    });

                if (bookingError) {
                    console.error('Error syncing event_bookings:', bookingError)
                } else {
                    console.log(`Event booking synced for table ${tableId}`)
                }
            } else {
                console.warn("Table reservation but no Table ID found in metadata")
            }

            if (reservationError) {
                console.error('Error saving reservation (Client-Side):', reservationError);
                // Non-critical: Ticket is saved, so we don't fail the whole process
            } else {
                console.log(`Reservation synced (Client-Side) for ${finalName}`);
            }
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
            name: finalName,
            email: finalEmail,
            tableSelection: tableSelection,
            bookingRef: bookingRef
        };

        // Call this after Supabase insert is successful
        await sendOrderConfirmation(finalEmail, bookingDetails, paymentIntentId);
        await sendAdminBookingNotification(bookingDetails);

        return { success: true, message: 'Ticket secured!', bookingDetails };

    } catch (error: any) {
        console.error('Finalize Error:', error);
        return { success: false, error: error.message };
    }
}
