'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createManualAdminReservation(data: {
    type: 'general' | 'event'
    eventId?: string
    eventName?: string
    tableId?: string
    tableName?: string
    tableCategory?: string
    full_name: string
    email: string
    phone: string
    guests: string
    date: string
    time?: string
    special_requests?: string
}) {
    const supabase = await createClient()

    try {
        const specialNotes = [
            'Manual Booking',
            data.special_requests
        ].filter(Boolean).join(' | ')

        if (data.type === 'general') {
            // General Reservation
            const { error } = await supabase.from('reservations').insert({
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                guests: data.guests,
                date: data.date,
                time: data.time || '18:00', // Default time if not provided
                status: 'confirmed',
                special_requests: specialNotes,
            })

            if (error) throw error

        } else if (data.type === 'event' && data.eventId) {
            // Event Reservation - Insert into ticket_purchases
            const bookingRef = 'RST-M-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            const { error: ticketError } = await supabase.from('ticket_purchases').insert({
                event_id: data.eventId,
                user_name: data.full_name,
                user_email: data.email,
                user_phone: data.phone,
                quantity: parseInt(data.guests || '1'),
                total_price: 0, // Manual admin booking
                status: 'paid',
                payment_intent_id: 'paid_in_person_admin',
                ticket_type: 'table_reservation',
                booking_details: data.tableId ? {
                    tableSelection: data.tableName,
                    tableId: data.tableId,
                    tableCategory: data.tableCategory
                } : null,
                booking_ref: bookingRef
            })

            if (ticketError) throw ticketError

            // Insert into reservations as fallback
            const { error: resError } = await supabase.from('reservations').insert({
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                guests: data.guests,
                date: data.date,
                status: 'confirmed',
                special_requests: `Manual Booking. Event: ${data.eventName || 'Event'}. Table: ${data.tableName || 'N/A'} | ` + (data.special_requests || '')
            })

            if (resError) throw resError

            // Sync with event_bookings
            if (data.tableId) {
                const { error: bookingError } = await supabase.from('event_bookings').insert({
                    event_id: data.eventId,
                    table_id: data.tableId,
                    customer_name: data.full_name,
                    customer_email: data.email,
                    guest_phone: data.phone,
                    status: 'confirmed'
                })
                if (bookingError) console.error('Error syncing event_bookings:', bookingError)
            }
        }

        revalidatePath('/admin/reservations')
        revalidatePath('/admin/guests')
        return { success: true, message: 'Reservation created successfully.' }
    } catch (err: any) {
        console.error('Manual reservation error:', err)
        return { success: false, message: err.message || 'An unexpected error occurred.' }
    }
}
