'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDailyGuestList(date: string) {
    const supabase = await createClient();

    try {
        // 1. Fetch all events (either specific date or ALL future events if date is empty)
        let eventQuery = supabase.from('events').select('id, title, date').order('date');

        if (date) {
            // Match specific date
            eventQuery = eventQuery.ilike('date', `${date}%`);
        } else {
            // Get all upcoming events (today onward)
            const today = new Date().toISOString().split('T')[0];
            eventQuery = eventQuery.gte('date', today);
        }

        const { data: events, error: eventsError } = await eventQuery;

        if (eventsError) {
            console.error('Error fetching events for guest list:', eventsError);
            return { success: false, error: 'Failed to find events for that date.' };
        }

        if (!events || events.length === 0) {
            return { success: true, data: [] }; // No events that day
        }

        const eventIds = events.map(e => e.id);

        // 2. Fetch all active tickets for those events
        const { data: tickets, error: ticketsError } = await supabase
            .from('ticket_purchases')
            .select('event_id, user_name, booking_ref, ticket_type, booking_details, quantity')
            .in('event_id', eventIds)
            .neq('status', 'cancelled')
            .order('user_name');

        if (ticketsError) {
            console.error('Error fetching tickets for guest list:', ticketsError);
            return { success: false, error: 'Failed to fetch tickets.' };
        }

        // 3. Group the tickets by Event ID
        const groupedData = events.map(event => {
            const eventTickets = tickets?.filter(t => t.event_id === event.id) || [];

            return {
                eventName: event.title,
                guests: eventTickets.map(t => ({
                    guest_name: t.user_name,
                    booking_ref: t.booking_ref || 'N/A',
                    ticket_type: t.ticket_type,
                    table_selection: t.booking_details?.tableSelection || t.booking_details?.tableId || 'N/A',
                    quantity: t.quantity
                }))
            };
        });

        // Filter out events that have no guests
        const activeEvents = groupedData.filter(event => event.guests.length > 0);

        return { success: true, data: activeEvents };

    } catch (error: any) {
        console.error('Guest List fetch error:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
