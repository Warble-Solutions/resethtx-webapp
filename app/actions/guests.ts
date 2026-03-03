'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDailyGuestList(date: string) {
    const supabase = await createClient();

    try {
        const today = new Date().toISOString().split('T')[0];

        // ─── 1. Fetch Events ──────────────────────────────────────────────────
        let eventQuery = supabase.from('events').select('id, title, date').order('date');
        if (date) {
            eventQuery = eventQuery.ilike('date', `${date}%`);
        } else {
            eventQuery = eventQuery.gte('date', today);
        }
        const { data: events, error: eventsError } = await eventQuery;
        if (eventsError) {
            console.error('Error fetching events for guest list:', eventsError);
            return { success: false, error: 'Failed to find events for that date.' };
        }

        // ─── 2. Fetch Event Tickets ───────────────────────────────────────────
        let eventGroups: any[] = [];
        if (events && events.length > 0) {
            const eventIds = events.map(e => e.id);
            const { data: tickets, error: ticketsError } = await supabase
                .from('ticket_purchases')
                .select('event_id, user_name, booking_ref, ticket_type, booking_details, quantity')
                .in('event_id', eventIds)
                .neq('status', 'cancelled')
                .order('user_name');

            if (!ticketsError) {
                eventGroups = events
                    .map(event => ({
                        eventName: event.title,
                        eventDate: event.date,
                        guests: (tickets?.filter(t => t.event_id === event.id) || []).map(t => ({
                            guest_name: t.user_name,
                            booking_ref: t.booking_ref || 'N/A',
                            ticket_type: t.ticket_type,
                            table_selection: t.booking_details?.tableSelection || t.booking_details?.tableId || 'N/A',
                            quantity: t.quantity,
                        })),
                    }))
                    .filter(e => e.guests.length > 0);
            }
        }

        // ─── 3. Fetch General Table Reservations ──────────────────────────────
        let reservationQuery = supabase
            .from('reservations')
            .select('full_name, email, guests, date, status, special_requests')
            .neq('status', 'cancelled')
            .order('date');

        if (date) {
            reservationQuery = reservationQuery.eq('date', date);
        } else {
            reservationQuery = reservationQuery.gte('date', today);
        }

        const { data: reservations } = await reservationQuery;

        // Group reservations by date
        const reservationsByDate: Record<string, any[]> = {};
        if (reservations && reservations.length > 0) {
            for (const r of reservations) {
                const key = r.date || 'Unknown Date';
                if (!reservationsByDate[key]) reservationsByDate[key] = [];

                // Extract booking ref from special_requests: "Booking Ref: RST-XXXXXX | ..."
                const refMatch = r.special_requests?.match(/Booking Ref: (RST-\w+)/);
                const bookingRef = refMatch?.[1] || 'N/A';

                // Extract preferred time
                const timeMatch = r.special_requests?.match(/Preferred time: ([^|]+)/);
                const time = timeMatch?.[1]?.trim() || 'N/A';

                reservationsByDate[key].push({
                    guest_name: r.full_name,
                    booking_ref: bookingRef,
                    ticket_type: `Table Booking · ${time}`,
                    table_selection: 'N/A',
                    quantity: r.guests || 1,
                });
            }
        }

        // Convert to the same group shape as events
        const reservationGroups = Object.entries(reservationsByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateKey, guests]) => ({
                eventName: 'General Table Bookings',
                eventDate: dateKey + 'T00:00:00',
                guests,
            }));

        // ─── 4. Merge and return ──────────────────────────────────────────────
        const allData = [...eventGroups, ...reservationGroups];

        if (allData.length === 0) {
            return { success: true, data: [] };
        }

        return { success: true, data: allData };

    } catch (error: any) {
        console.error('Guest List fetch error:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
