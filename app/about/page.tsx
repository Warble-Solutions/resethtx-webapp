import type { Metadata } from 'next'
import AboutClient from './AboutClient'
import JsonLd from '@/app/components/JsonLd'
import { faqs } from '@/app/components/FAQSection'
import { getFaqSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: "About Us | Reset HTX Rooftop Lounge & Kitchen Midtown Houston",
  description: "Learn about Reset HTX — Midtown Houston's premier rooftop lounge. Where business meets leisure, culinary craft meets luxury, and high-fidelity sound elevates your evening.",
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <main>
      <JsonLd schema={getFaqSchema(faqs)} />
      <AboutClient />
    </main>
  )
}