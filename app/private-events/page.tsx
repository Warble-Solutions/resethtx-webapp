import type { Metadata } from 'next'
import PrivateEventsClient from './PrivateEventsClient'

export const metadata: Metadata = {
  title: "Private Events & Rooftop Venue Rental | Reset HTX Houston",
  description: "Host your corporate mixer, private dinner, cocktail reception, or full venue buyout at Reset HTX in Midtown Houston. Panoramic skyline views, custom menus, and AV-ready rooftop.",
  alternates: {
    canonical: '/private-events',
  },
}

export default function PrivateEventsPage() {
  return <PrivateEventsClient />
}
