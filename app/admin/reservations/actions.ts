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
