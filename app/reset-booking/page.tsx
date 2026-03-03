import type { Metadata } from 'next'
import ResetBookingClient from './ResetBookingClient'

export const metadata: Metadata = {
    title: 'Book Now | Reset HTX',
    description: 'Book your table at Reset HTX — Houston\'s premier nightlife destination. Reserve for a live event or general dining.',
}

export default function ResetBookingPage() {
    return <ResetBookingClient />
}
