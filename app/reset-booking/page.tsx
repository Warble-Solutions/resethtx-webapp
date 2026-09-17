import type { Metadata } from 'next'
import ResetBookingClient from './ResetBookingClient'

export const metadata: Metadata = {
    title: 'Table Reservations & VIP Booking | Reset HTX Houston',
    description: 'Reserve a table or VIP bottle service section at Reset HTX in Midtown Houston. Enjoy rooftop dining, craft cocktails, live DJs, and skyline views.',
    alternates: {
        canonical: '/reservations',
    },
}

export default function ResetBookingPage() {
    return <ResetBookingClient />
}
