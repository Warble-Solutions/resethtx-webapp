/* eslint-disable @typescript-eslint/no-explicit-any */
// ... imports
// We'll rename ReservationsTable or use a new wrapper. Let's assume we update ReservationsTable to handle tabs or rename it.
// For now, let's keep it simple and update this page to fetch everything.

import { createClient } from '@/utils/supabase/server'
import ReservationsClient from './ReservationsClient'

export const revalidate = 60

export default async function ReservationsPage() {
    const supabase = await createClient()

    // 1. Parallel Fetch: General Reservations + Raw Bookings
    const [reservationsResult, bookingsResult] = await Promise.all([
        supabase
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false }),
        supabase
            .from('event_bookings')
            .select('*')
            .order('created_at', { ascending: false })
    ])

    const reservations = reservationsResult.data
    const rawBookings = bookingsResult.data

    // 2. Manual Join Logic (Optimized)
    let eventBookings: any[] = []

    if (rawBookings && rawBookings.length > 0) {
        // Collect IDs
        const eventIds = Array.from(new Set(rawBookings.map(b => b.event_id).filter(Boolean)))
        const tableIds = Array.from(new Set(rawBookings.map(b => b.table_id).filter(Boolean)))

        // Fetch Related Data in Parallel
        const [eventsResult, tablesResult] = await Promise.all([
            supabase.from('events').select('id, title, date').in('id', eventIds),
            supabase.from('tables').select('id, name, category, capacity').in('id', tableIds)
        ])

        // Create Lookups
        const eventMap = (eventsResult.data || []).reduce((acc: any, e: any) => { acc[e.id] = e; return acc }, {})
        const tableMap = (tablesResult.data || []).reduce((acc: any, t: any) => { acc[t.id] = t; return acc }, {})

        // Merge Data
        eventBookings = rawBookings.map(booking => ({
            ...booking,
            events: eventMap[booking.event_id] || null,
            tables: tableMap[booking.table_id] || null
        }))
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12">
            <ReservationsClient
                initialReservations={reservations || []}
                initialEventBookings={eventBookings}
            />
        </div>
    )
}
