import { createClient } from '@/utils/supabase/server'
import EventsContent from './events-content'

// Refresh hourly
export const revalidate = 3600

export default async function EventsPage() {
  const supabase = await createClient()

  // 1. Fetch only FUTURE events (sorted by date)
  const { data: events } = await supabase
    .from('events')
    .select('*')
    // .gte('date', new Date().toISOString()) // REMOVED to allow calendar to show full month history
    .order('date', { ascending: true })

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-6">
            Events <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#F0DEAA]">Calendar</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Secure your spot at the hottest nights in Houston. <br />
            Switch views below to find your date.
          </p>
        </div>

        {/* INTERACTIVE CONTENT (Tabs + Views) */}
        <EventsContent events={events || []} />

      </div>
    </main>
  )
}