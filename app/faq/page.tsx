import type { Metadata } from 'next'
import FAQSection, { faqs } from '../components/FAQSection'
import JsonLd from '../components/JsonLd'
import { getFaqSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Reset HTX Houston",
  description: "Find answers about dress code, age requirements (21+), table minimums, cover charges, valet parking, and private events at Reset HTX in Midtown Houston.",
  alternates: {
    canonical: '/faq',
  },
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <JsonLd schema={getFaqSchema(faqs)} />
      <FAQSection />
    </div>
  )
}
