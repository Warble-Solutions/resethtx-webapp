'use server'

import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { sendCustomerCancellation, sendAdminCancellation } from '@/lib/mail'

interface CancelRequest {
    orderId: string;
    email: string;
}

export async function cancelBooking({ orderId, email }: CancelRequest) {
    const supabase = await createClient();

    try {
        // 1. Verify the booking exists and matches the email
        const { data: ticket, error: fetchError } = await supabase
            .from('ticket_purchases')
            .select('*, events(title, date)')
            .eq('payment_intent_id', orderId)
            .eq('user_email', email)
            .single();

        if (fetchError || !ticket) {
            console.error('Booking not found or email mismatch:', fetchError);
            return { success: false, error: 'Booking not found with that Order ID and Email.' };
        }

        if (ticket.status === 'cancelled') {
            return { success: false, error: 'This booking has already been cancelled.' };
        }

        // 2. Initiate Stripe Refund
        try {
            await stripe.refunds.create({
                payment_intent: orderId
            });
        } catch (stripeError: any) {
            console.error('Stripe Refund Error:', stripeError);
            return { success: false, error: 'Failed to process refund with our payment provider.' };
        }

        // 3. Update Database (ticket_purchases)
        const { error: updateError } = await supabase
            .from('ticket_purchases')
            .update({ status: 'cancelled' })
            .eq('id', ticket.id);

        if (updateError) {
            console.error('Failed to update ticket status:', updateError);
            // We refunded but couldn't update DB. This shouldn't happen but log it.
        }

        // 4. Update Database (if it was a table reservation)
        // ticket.booking_details might contain tableSelection
        if (ticket.ticket_type === 'table_reservation' || ticket.ticket_type === 'table') {
            // Attempt to find and cancel in event_bookings
            // NOTE: The original checkout binds customer_email and event_id
            const { error: bookingUpdateError } = await supabase
                .from('event_bookings')
                .update({ status: 'cancelled' })
                .eq('customer_email', email)
                .eq('event_id', ticket.event_id)
                .eq('status', 'confirmed'); // Only cancel active ones

            if (bookingUpdateError) {
                console.error('Failed to update event_bookings:', bookingUpdateError);
            }

            // Attempt to find and cancel in reservations table
            const { error: resUpdateError } = await supabase
                .from('reservations')
                .update({ status: 'cancelled' })
                .eq('email', email)
                .ilike('special_requests', `%${orderId}%`); // Simple heuristic since orderId was added to special_requests

            if (resUpdateError) {
                console.error('Failed to update reservations:', resUpdateError);
            }
        }

        // 5. Send Cancellation Emails
        const emailDetails = {
            eventName: ticket.events?.title || 'ResetHTX Event',
            name: ticket.user_name,
            email: ticket.user_email,
            orderId: orderId,
        };

        await sendCustomerCancellation(ticket.user_email, emailDetails);
        await sendAdminCancellation(emailDetails);

        return {
            success: true,
            message: 'Your booking was cancelled and your refund has been initiated. You will receive an email confirmation shortly.'
        };

    } catch (error: any) {
        console.error('Cancellation Action Error:', error);
        return { success: false, error: 'An unexpected error occurred while processing your cancellation.' };
    }
}
