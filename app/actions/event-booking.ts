'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Define the Table interface
interface Table {
    id: string
    name: string
    capacity: number
    price: number // Assuming tables might have a reservation price
    category: string // e.g., 'VIP', 'Standard', 'Booth'
    isBooked?: boolean
}

export async function getEventTables(eventId: string) {
    const supabase = await createClient()

    try {
        // 1. Fetch all available physical tables
        const { data: tables, error: tablesError } = await supabase
            .from('tables')
            .select('*')
            .order('table_number', { ascending: true }) // Changed from 'name' to 'table_number' if that's the column

        console.log('Server Action: Raw Tables Fetch:', { count: tables?.length, first: tables?.[0], error: tablesError })

        if (tablesError) throw tablesError

        // 2. Fetch all confirmed bookings for this specific event
        const { data: bookings, error: bookingsError } = await supabase
            .from('event_bookings')
            .select('table_id')
            .eq('event_id', eventId)
            .eq('status', 'confirmed')

        if (bookingsError) throw bookingsError

        // 3. Create a set of booked table IDs for efficient lookup
        const bookedTableIds = new Set(bookings.map(b => b.table_id))

        // 4. Map the availability status onto the tables
        // Adapting to actual DB schema: { id, table_number, seats, status }
        const tablesWithStatus: Table[] = tables.map(table => ({
            id: table.id,
            name: table.table_number || `Table ${table.id.slice(0, 4)}`, // Map table_number to name
            capacity: table.seats || 2, // Map seats to capacity
            price: table.price || 100, // Default price if missing
            category: table.category || 'Standard', // Default category if missing
            isBooked: bookedTableIds.has(table.id)
        }))

        return { success: true, tables: tablesWithStatus }

    } catch (error: any) {
        console.error('Error fetching tables:', error)
        return { success: false, tables: [], error: error.message || 'Unknown error' }
    }
}

import { validatePromo } from './promos'

export async function bookTable(eventId: string, tableId: string, name: string, email: string, promoCode: string) {
    const supabase = await createClient()

    try {
        // 1. Validate Promo (Server-Side Enforcement)
        if (!promoCode) {
            return { success: false, error: 'Valid promo code is required to complete booking.' }
        }

        const promoValidation = await validatePromo(promoCode)
        if (!promoValidation.valid) {
            return { success: false, error: promoValidation.message || 'Invalid promo code.' }
        }

        // 2. Insert Booking
        const { error: bookingError } = await supabase
            .from('event_bookings')
            .insert({
                event_id: eventId,
                table_id: tableId,
                customer_name: name,
                customer_email: email,
                status: 'confirmed'
            })

        if (bookingError) {
            // Check for Postgres Unique Violation Error (23505)
            if (bookingError.code === '23505') {
                return { success: false, error: 'This table was just taken. Please select another.' }
            }
            throw bookingError
        }

        // 3. Increment Promo Usage (Non-blocking or blocking, here blocking for safety)
        // We use rpc or simple update. Simple update is fine for now.
        // Assuming we want to increment irrespective of concurrency for this simple app.
        const { error: promoError } = await supabase.rpc('increment_promo_usage', { code_input: promoCode.toUpperCase() })

        // Fallback if RPC doesn't exist (User didn't specify RPC creation, so I will try standard update)
        // Note: Standard update has race conditions, but acceptable for this scope.
        if (promoError) {
            // Try standard update if RPC fails (likely does not exist)
            const { data: currentPromo } = await supabase.from('promos').select('times_used').eq('code', promoCode.toUpperCase()).single()
            if (currentPromo) {
                await supabase.from('promos').update({ times_used: (currentPromo.times_used || 0) + 1 }).eq('code', promoCode.toUpperCase())
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
