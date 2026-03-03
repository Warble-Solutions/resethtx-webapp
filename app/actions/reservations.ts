'use server'

import { createClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer'

interface GeneralReservationInput {
    full_name: string
    email: string
    phone: string
    guests: number
    date: string
    time: string
    special_requests?: string
}

function generateBookingRef() {
    return 'RST-' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

export async function submitGeneralReservation({
    full_name,
    email,
    phone,
    guests,
    date,
    time,
    special_requests,
}: GeneralReservationInput) {
    const supabase = await createClient()

    // Validate required fields
    if (!full_name || !email || !phone || !guests || !date || !time) {
        return { success: false, error: 'All required fields must be filled.' }
    }

    // Validate date is not in the past
    const selectedDate = new Date(date + 'T12:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
        return { success: false, error: 'Please select a future date.' }
    }

    const bookingRef = generateBookingRef()

    // Insert into reservations table
    const { error: insertError } = await supabase.from('reservations').insert({
        full_name,
        email,
        phone,
        guests: guests.toString(),
        date,
        status: 'pending',
        special_requests: [
            time ? `Preferred time: ${time}` : '',
            special_requests || '',
        ]
            .filter(Boolean)
            .join(' | ') || null,
    })

    if (insertError) {
        console.error('Reservation insert error:', insertError)
        return { success: false, error: 'Failed to submit reservation. Please try again.' }
    }

    // Format date for emails
    const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resethtx.com'

    // Send confirmation email to guest
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        try {
            await transporter.sendMail({
                from: `"Reset HTX" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: `Reservation Request Received — ${formattedDate}`,
                html: `
                    <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; text-align: center;">
                        <div style="margin-bottom: 20px;">
                            <img src="${baseUrl}/logos/logo-main.png" alt="Reset HTX" style="max-width: 250px; height: auto;" />
                        </div>
                        <p style="font-size: 18px; color: #ccc;">Your Reservation Request is Received</p>
                        <div style="background: #111; border: 1px solid #333; padding: 20px; margin: 20px auto; border-radius: 8px; max-width: 500px; text-align: left;">
                            <h2 style="margin: 0 0 10px; color: #D4AF37; text-align: center;">General Dining</h2>
                            <p style="color: #888; margin: 0 0 20px; text-align: center;">${formattedDate}</p>
                            <p style="text-align: center; color: #D4AF37; font-size: 16px; font-weight: bold; margin-bottom: 20px;">Booking Ref: ${bookingRef}</p>
                            <hr style="border-color: #333; margin: 20px 0;" />
                            <p><strong>Guest:</strong> ${full_name}</p>
                            <p><strong>Party Size:</strong> ${guests} ${guests === 1 ? 'guest' : 'guests'}</p>
                            <p><strong>Preferred Time:</strong> ${time}</p>
                            ${special_requests ? `<p><strong>Special Requests:</strong> ${special_requests}</p>` : ''}
                        </div>
                        <p style="color: #888; font-size: 14px; margin-top: 20px;">
                            Your reservation is <strong style="color:#D4AF37;">pending confirmation</strong>. We'll reach out to confirm your booking shortly.
                        </p>
                        <div style="margin-top: 30px;">
                            <img src="${baseUrl}/logos/r_logo.png" alt="R Icon" style="max-width: 40px; height: auto; opacity: 0.8;" />
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 10px;">21+ to enter. Please present this email upon arrival.</p>
                    </div>
                `,
            })
        } catch (emailErr) {
            console.error('Guest confirmation email error:', emailErr)
        }

        // Send admin notification
        try {
            await transporter.sendMail({
                from: `"Reset HTX System" <${process.env.GMAIL_USER}>`,
                to: process.env.GMAIL_USER,
                subject: `🍽️ New Reservation Request — ${full_name} (${formattedDate})`,
                html: `
                    <h2>New General Dining Reservation</h2>
                    <p><strong>Booking Ref:</strong> ${bookingRef}</p>
                    <p><strong>Guest Name:</strong> ${full_name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Preferred Time:</strong> ${time}</p>
                    <p><strong>Party Size:</strong> ${guests}</p>
                    ${special_requests ? `<p><strong>Special Requests:</strong> ${special_requests}</p>` : ''}
                    <p style="margin-top: 20px;"><a href="${baseUrl}/admin/reservations" style="background: #D4AF37; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Admin Dashboard</a></p>
                `,
            })
        } catch (adminEmailErr) {
            console.error('Admin notification email error:', adminEmailErr)
        }
    }

    return { success: true, bookingRef }
}

export async function getEventByDate(date: string): Promise<{ hasEvent: boolean; eventTitle?: string; eventId?: string }> {
    const supabase = await createClient()

    try {
        const startOfDay = new Date(date + 'T00:00:00').toISOString()
        const endOfDay = new Date(date + 'T23:59:59').toISOString()

        const { data } = await supabase
            .from('events')
            .select('id, title')
            .gte('date', startOfDay)
            .lte('date', endOfDay)
            .limit(1)

        if (data && data.length > 0) {
            return { hasEvent: true, eventTitle: data[0].title, eventId: data[0].id }
        }

        return { hasEvent: false }
    } catch {
        return { hasEvent: false }
    }
}
