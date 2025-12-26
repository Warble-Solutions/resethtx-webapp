// ... imports
// We'll rename ReservationsTable or use a new wrapper. Let's assume we update ReservationsTable to handle tabs or rename it.
// For now, let's keep it simple and update this page to fetch everything.

import { createClient } from '@/utils/supabase/server'
import ReservationsClient from './ReservationsClient'

export const revalidate = 60

export default async function ReservationsPage() {
    const supabase = await createClient()

    // 1. Fetch General Reservations
    const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

    // 2. Fetch Event Bookings with Joins
    const { data: eventBookings, error } = await supabase
        .from('event_bookings')
        .select(`
            *,
            events ( title, date ),
            tables ( table_number, section_name, seats )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching event bookings:', error)
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12">
            <ReservationsClient
                initialReservations={reservations || []}
                initialEventBookings={eventBookings || []}
            />
        </div>
    )
}
