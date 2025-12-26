'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReservation(formData: FormData) {
    const supabase = await createClient()

    const full_name = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const guests = formData.get('guests') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const special_requests = formData.get('special_requests') as string

    try {
        const { error } = await supabase.from('reservations').insert({
            full_name,
            email,
            phone,
            guests,
            date,
            time,
            special_requests,
            status: 'pending', // Default status
        })

        if (error) {
            console.error('Supabase Error:', error)
            return { success: false, message: 'Failed to create reservation. Please try again.' }
        }

        revalidatePath('/admin/reservations') // Optional: if there's an admin panel
        return { success: true, message: 'Reservation submitted successfully! We will contact you shortly.' }

    } catch (err) {
        console.error('Server Error:', err)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}
