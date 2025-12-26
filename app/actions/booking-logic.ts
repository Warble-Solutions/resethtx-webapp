'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEventAvailability(eventId: string) {
    const supabase = await createClient()

    // Fetch all confirmed bookings for this event to identify taken tables
    const { data, error } = await supabase
        .from('event_bookings')
        .select('table_id')
        .eq('event_id', eventId)
        .eq('status', 'confirmed')

    if (error) {
        console.error('Error fetching availability:', error)
        return []
    }

    // Return array of table IDs that are already booked
    return data.map(booking => booking.table_id)
}

interface CustomerDetails {
    customer_name: string
    customer_email: string
}

export async function bookEventTable(eventId: string, tableId: string, customerDetails: CustomerDetails) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('event_bookings')
            .insert({
                event_id: eventId,
                table_id: tableId,
                customer_name: customerDetails.customer_name,
                customer_email: customerDetails.customer_email,
                status: 'confirmed'
            })

        if (error) {
            // Postgres Error Code 23505 = Unique Violation
            if (error.code === '23505') {
                return { success: false, message: 'Table just taken, please select another.' }
            }

            console.error('Booking Error:', error)
            return { success: false, message: 'Failed to book table. Please try again.' }
        }

        // Revalidate relevant paths so the UI updates to show the table as taken
        revalidatePath(`/events`)
        revalidatePath(`/admin/events`)

        return { success: true, message: 'Table booked successfully!' }

    } catch (err) {
        console.error('Server Booking Error:', err)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}
