'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface PurchaseDetails {
    eventId: string
    userName: string
    userEmail: string
    userPhone: string
    userDob: string
    quantity: number
    couponCode?: string // Added couponCode
}

// NOTE: This currently mocks the Stripe integration
export async function purchaseTickets({ eventId, userName, userEmail, userPhone, userDob, quantity, couponCode }: PurchaseDetails) {
    const supabase = await createClient()

    // 0. Validate Age (Server-Side)
    const today = new Date()
    const birthDate = new Date(userDob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    if (age < 21) {
        return { success: false, error: 'You must be 21+ to purchase tickets.' }
    }

    // 1. Fetch Event Details
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('ticket_price, ticket_capacity, title')
        .eq('id', eventId)
        .single()

    if (eventError || !event) {
        return { success: false, error: 'Event not found' }
    }

    const totalPrice = event.ticket_price * quantity
    const isFree = totalPrice === 0

    // 2. Handle Free Tickets / RSVP
    if (isFree) {
        const { error: insertError } = await supabase
            .from('ticket_purchases')
            .insert({
                event_id: eventId,
                user_name: userName,
                user_email: userEmail,
                user_phone: userPhone,
                guest_dob: userDob,
                quantity: quantity,
                total_price: 0,
                status: 'free',
                payment_intent_id: null,
                coupon_code: couponCode || null
            })

        if (insertError) {
            console.error('RSVP Error:', insertError)
            return { success: false, error: 'Failed to process RSVP' }
        }

        return { success: true, message: 'RSVP Confirmed!' }
    }

    // 3. Handle Paid Tickets (Mock)
    // In a real implementation, this would create a Stripe Session and return the URL

    // Simulate successful payment record for now (or a "pending" record waiting for webhook)
    const { error: insertError } = await supabase
        .from('ticket_purchases')
        .insert({
            event_id: eventId,
            user_name: userName,
            user_email: userEmail,
            user_phone: userPhone,
            guest_dob: userDob,
            quantity: quantity,
            total_price: totalPrice,
            status: 'paid', // Mocking instant success
            payment_intent_id: 'mock_pi_' + Date.now(),
            coupon_code: couponCode || null
        })

    if (insertError) {
        console.error('Purchase Error:', insertError)
        return { success: false, error: 'Failed to process purchase' }
    }

    // Mocking a redirect URL
    return { success: true, message: 'Tickets Purchased!', redirectUrl: '/events/' + eventId + '?success=true' }
}
