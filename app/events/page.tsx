import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import EventsContent from './events-content'
import JsonLd from '@/app/components/JsonLd'
import { getEventSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: "Events Calendar & Nightlife Schedule | Reset HTX Houston",
  description: "Check upcoming events, themed nights, DJ sets, and live entertainment at Reset HTX in Midtown Houston. View our schedule and reserve your VIP table or tickets.",
  alternates: {
    canonical: '/events',
  },
}

// Refresh hourly
export const revalidate = 3600

export default async function EventsPage() {
  const supabase = await createClient()

  // Fetch events sorted by date ascending
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  const eventSchemas = (events || []).slice(0, 10).map(getEventSchema)

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black relative overflow-hidden pt-20 sm:pt-24 pb-8">
      {eventSchemas.length > 0 && <JsonLd schema={eventSchemas} />}

      {/* Atmospheric Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/3 to-transparent blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 relative z-10">
        <EventsContent events={events || []} />
      </div>
    </main>
  )
}