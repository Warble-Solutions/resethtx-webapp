'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Define the Table interface
interface Table {
    id: string
    name: string
    capacity: number
    price: number
    category: string
    isBooked?: boolean
    x?: number
    y?: number
}

export async function getEventTables(eventId: string) {
    const supabase = await createClient()

    try {
        const { data: tables, error: tablesError } = await supabase
            .from('tables')
            .select('id, name, capacity, category, x, y')
            .order('name', { ascending: true })

        if (tablesError) throw tablesError

        const { data: bookings, error: bookingsError } = await supabase
            .from('event_bookings')
            .select('table_id')
            .eq('event_id', eventId)
            .eq('status', 'confirmed')

        if (bookingsError) throw bookingsError

        const bookedTableIds = new Set(bookings.map(b => b.table_id))

        const tablesWithStatus: Table[] = tables.map((table: any) => ({
            id: table.id,
            name: table.name || `Table ${table.id.slice(0, 4)}`,
            capacity: table.capacity || 2,
            price: 100, // Hardcoded default price as requested/assumed since column might depend on event settings or be missing
            category: table.category || 'Standard',
            isBooked: bookedTableIds.has(table.id),
            x: table.x,
            y: table.y
        }))

        return { success: true, tables: tablesWithStatus }

    } catch (error: any) {
        console.error('Error fetching tables:', error)
        return { success: false, tables: [], error: error.message || 'Unknown error' }
    }
}

import { validatePromo } from './promos'

export async function bookTable(eventId: string, tableId: string, name: string, email: string, phone: string, dob: string, promoCode: string) {
    const supabase = await createClient()

    try {
        // 1. Validate Age (Server-Side)
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        if (age < 21) {
            return { success: false, error: 'You must be 21+ to book a table.' }
        }

        // 2. Validate Promo
        if (!promoCode) {
            return { success: false, error: 'Valid promo code is required to complete booking.' }
        }

        const promoValidation = await validatePromo(promoCode)
        if (!promoValidation.valid) {
            return { success: false, error: promoValidation.message || 'Invalid promo code.' }
        }

        // 3. Insert Booking
        const { error: bookingError } = await supabase
            .from('event_bookings')
            .insert({
                event_id: eventId,
                table_id: tableId,
                customer_name: name,
                customer_email: email,
                guest_phone: phone,
                guest_dob: dob,
                status: 'confirmed'
            })

        if (bookingError) {
            // Check for Postgres Unique Violation Error (23505)
            if (bookingError.code === '23505') {
                return { success: false, error: 'This table was just taken. Please select another.' }
            }
            throw bookingError
        }

        // 4. Increment Promo Usage
        const { error: promoError } = await supabase.rpc('increment_promo_usage', { code_input: promoCode.toUpperCase() })
        if (promoError) {
            const { data: currentPromo } = await supabase.from('promo_codes').select('times_used').eq('code', promoCode.toUpperCase()).single()
            if (currentPromo) {
                await supabase.from('promo_codes').update({ times_used: (currentPromo.times_used || 0) + 1 }).eq('code', promoCode.toUpperCase())
            }
        }

        revalidatePath(`/events/${eventId}`)
        return { success: true }

    } catch (err) {
        console.error('Booking failed:', err)
        return { success: false, error: 'Failed to process booking.' }
    }
}

export async function cancelEventBooking(bookingId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('event_bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId)

        if (error) throw error

        revalidatePath('/admin/reservations')
        return { success: true }
    } catch (error: any) {
        console.error('Error cancelling booking:', error)
        return { success: false, error: error.message }
    }
}

export async function getEventForDate(date: string) {
    const supabase = await createClient()

    try {
        const startOfDay = new Date(date).toISOString()
        const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString()

        const { data, error } = await supabase
            .from('events')
            .select('id, date')
            .gte('date', startOfDay)
            .lte('date', endOfDay)
            .limit(1)

        if (error) throw error

        if (data && data.length > 0) {
            return { success: true, event: data[0] }
        }

        return { success: false, error: 'No event found' }
    } catch (error: any) {
        console.error('Error fetching event by date:', error)
        return { success: false, error: error.message }
    }
}

export async function getNextEvent() {
    const supabase = await createClient()

    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('id, date, title')
            .gte('date', new Date().toISOString())
            .order('date', { ascending: true })
            .limit(1)

        if (error) throw error

        if (events && events.length > 0) {
            return { success: true, event: events[0] }
        }

        return { success: false, error: 'No upcoming events found.' }
    } catch (error: any) {
        console.error('Error fetching next event:', error)
        return { success: false, error: error.message }
    }
}

export async function getEventById(eventId: string) {
    const supabase = await createClient()

    try {
        const { data: event, error } = await supabase
            .from('events')
            .select('id, date, title')
            .eq('id', eventId)
            .single()

        if (error) throw error

        if (event) {
            return { success: true, event }
        }

        return { success: false, error: 'Event not found' }
    } catch (error: any) {
        console.error('Error fetching event by id:', error)
        return { success: false, error: error.message }
    }
}

import { checkTableAvailability } from '@/utils/checkAvailability'

export async function getEventAvailability(eventId: string) {
    return await checkTableAvailability(eventId)
}

export async function getTakenTables(eventId: string) {
    const supabase = await createClient()

    try {
        // Query ticket_purchases for table reservations
        // We look for 'paid' status and ticket_type related to tables
        // 'booking_details' column is JSONB and likely stores { tableDetails: { id: ..., name: ... } } or similar
        // Based on checkout action: booking_details: tableSelection ? { tableSelection } : null

        // Wait, checkout.ts saves: special_requests: ... Table: {tableSelection}
        // And ticket_purchases uses booking_details: { tableSelection: "Table Name (ID)" }

        // Let's select booking_details
        const { data, error } = await supabase
            .from('ticket_purchases')
            .select('booking_details')
            .eq('event_id', eventId)
            .in('ticket_type', ['table', 'table_reservation'])
            .eq('status', 'paid')

        if (error) throw error

        // Extract table info. 
        // booking_details format from checkout: { tableSelection: "VIP Table (123-abc)" }
        // We need to return a list that the frontend can match against.
        // Frontend has 'tables' with 'id' and 'name'.
        // best to match by ID if possible.
        // The tableSelection string is "Name (ID)".

        const takenIdentifiers: string[] = []

        data?.forEach((row: any) => {
            const details = row.booking_details
            if (details && details.tableSelection) {
                // Parse "Name (ID)" -> Extract ID
                const match = details.tableSelection.match(/\(([^)]+)\)$/) // Match content inside last parenthesis
                if (match && match[1]) {
                    takenIdentifiers.push(match[1])
                } else {
                    // Fallback: push full string in case we match by name?
                    takenIdentifiers.push(details.tableSelection)
                }
            }
        })

        return { success: true, takenTables: takenIdentifiers }
    } catch (error: any) {
        console.error('Error fetching taken tables:', error)
        return { success: false, error: error.message }
    }
}
