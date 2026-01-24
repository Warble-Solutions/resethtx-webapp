'use server'

import { createClient } from '@/utils/supabase/server'

export async function getGlobalTransactions() {
    const supabase = await createClient()

    // Fetch ticket purchases
    const { data: tickets, error: ticketError } = await supabase
        .from('ticket_purchases')
        .select(`
      id,
      created_at,
      user_name,
      total_price,
      quantity,
      status,
      events (title)
    `)
        .order('created_at', { ascending: false })

    if (ticketError) {
        console.error('Error fetching tickets:', ticketError)
        return []
    }

    // Fetch table bookings (that are paid/confirmed)
    // Note: event_bookings table as per schema doesn't have price directly, 
    // but tables table does. We need to join.
    const { data: bookings, error: bookingError } = await supabase
        .from('event_bookings')
        .select(`
      id,
      created_at,
      customer_name,
      status,
      events (title),
      tables (price, category, name)
    `)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })

    if (bookingError) {
        console.error('Error fetching bookings:', JSON.stringify(bookingError, null, 2))
        return []
    }

    // Normalize and merge
    const ticketTransactions = tickets.map(t => ({
        id: t.id,
        type: 'Ticket',
        customer_name: t.user_name,
        event_name: t.events?.title || 'Unknown Event',
        amount: t.total_price || 0,
        date: t.created_at,
        details: `${t.quantity}x Ticket(s)`,
        status: t.status
    }))

    const tableTransactions = bookings.map(b => ({
        id: b.id,
        type: `Table (${b.tables?.category || 'Standard'})`,
        customer_name: b.customer_name,
        event_name: b.events?.title || 'Unknown Event',
        amount: b.tables?.price || 0,
        date: b.created_at,
        details: b.tables?.name || 'Reserved Table',
        status: b.status
    }))

    const allTransactions = [...ticketTransactions, ...tableTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return allTransactions
}

export async function getEventSalesStats() {
    const supabase = await createClient()

    // Get all events
    const { data: events, error: eventError } = await supabase
        .from('events')
        .select('id, title, date, image_url')
        .order('date', { ascending: false })

    if (eventError) return []

    // Get sales stats (this could be optimized with a complex SQL query or View, 
    // but for now we'll do promise.all for simplicity unless user has huge data)

    const eventsWithStats = await Promise.all(events.map(async (event) => {
        // Tickets
        const { data: tickets } = await supabase
            .from('ticket_purchases')
            .select('quantity, total_price')
            .eq('event_id', event.id)
            .eq('status', 'paid') // Assuming 'free' don't count towards revenue, but count towards tickets?
            // Actually, let's include all non-cancelled for counts, but only paid for revenue.
            // Simplified: fetch all valid ones
            .in('status', ['paid', 'free'])

        // Tables
        const { data: bookings } = await supabase
            .from('event_bookings')
            .select('tables(price)')
            .eq('event_id', event.id)
            .eq('status', 'confirmed')

        const ticketCount = tickets?.reduce((sum, t) => sum + (t.quantity || 1), 0) || 0
        const ticketRevenue = tickets?.reduce((sum, t) => sum + (t.total_price || 0), 0) || 0

        // @ts-ignore
        const tableRevenue = bookings?.reduce((sum, b) => sum + (b.tables?.price || 0), 0) || 0

        return {
            ...event,
            ticketsSold: ticketCount,
            totalRevenue: ticketRevenue + tableRevenue
        }
    }))

    return eventsWithStats
}

export async function getEventGuestList(eventId: string) {
    const supabase = await createClient()

    const { data: tickets } = await supabase
        .from('ticket_purchases')
        .select('user_name, user_email, user_phone, quantity, status')
        .eq('event_id', eventId)
        .neq('status', 'cancelled')

    const { data: bookings } = await supabase
        .from('event_bookings')
        .select('customer_name, customer_email, tables(name, category)')
        .eq('event_id', eventId)
        .eq('status', 'confirmed')

    const guests = [
        ...(tickets || []).map(t => ({
            name: t.user_name,
            email: t.user_email,
            phone: t.user_phone || '-',
            type: `Ticket (${t.quantity})`,
            status: t.status
        })),
        ...(bookings || []).map(b => ({
            name: b.customer_name,
            email: b.customer_email,
            phone: '-',
            // @ts-ignore
            type: `Table: ${b.tables?.name} (${b.tables?.category})`,
            status: 'confirmed'
        }))
    ]

    return guests
}
