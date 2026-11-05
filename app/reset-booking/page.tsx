import type { Metadata } from 'next'
import ResetBookingClient from './ResetBookingClient'

export const metadata: Metadata = {
    title: 'Book Now | Reset HTX',
    description: 'Book your table or tickets for upcoming events at Reset HTX — Houston\'s premier nightlife destination.',
}

export default function ResetBookingPage() {
    return <ResetBookingClient />
}
