import type { Metadata } from 'next'
import DressCodeClient from './DressCodeClient'

export const metadata: Metadata = {
  title: "Dress Code & Guest Standards | Reset HTX Midtown Houston",
  description: "Review the dress code guidelines for Reset HTX rooftop lounge and nightlife in Midtown Houston. Discover encouraged attire, prohibited items, and entry protocols.",
  alternates: {
    canonical: '/dress-code',
  },
}

export default function DressCodePage() {
  return <DressCodeClient />
}
