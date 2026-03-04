'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReservationStatus(id: string, status: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('reservations')
            .update({ status })
            .eq('id', id)

        if (error) {
            console.error('Error updating reservation:', error)
            return { success: false, message: 'Failed to update reservation status.' }
        }

        revalidatePath('/admin/reservations')
        return { success: true, message: 'Status updated successfully.' }
    } catch (err) {
        console.error('Unexpected error:', err)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}

export async function deleteReservation(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting reservation:', error)
            return { success: false, message: 'Failed to delete reservation.' }
        }

        revalidatePath('/admin/reservations')
        return { success: true, message: 'Reservation deleted successfully.' }
    } catch (err) {
        console.error('Unexpected error:', err)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}

export async function createReservation(data: {
    full_name: string
    email: string
    phone: string
    guests: string
    date: string
    time: string
    special_requests?: string
    status: string
}) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from('reservations').insert({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            guests: data.guests,
            date: data.date,
            time: data.time,
            table_id: null,
            status: data.status,
            special_requests: data.special_requests || null,
        })

        if (error) {
            console.error('Error creating reservation:', error)
            return { success: false, message: error.message }
        }

        revalidatePath('/admin/reservations')
        return { success: true, message: 'Reservation created successfully.' }
    } catch (err: any) {
        console.error('Unexpected error:', err)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}
