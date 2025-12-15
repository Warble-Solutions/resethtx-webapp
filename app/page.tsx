import HeroSection from './components/HeroSection'
import EventsCalendar from './components/EventsCalendar'
import TestimonialsSection from './components/TestimonialsSection' // <--- Import this
import { createClient } from '@/utils/supabase/server'

export const revalidate = 3600 

export default async function Home() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      <HeroSection />
      
      <EventsCalendar events={events || []} />
      
      {/* Testimonials are now Live! */}
      <TestimonialsSection />
    </main>
  )
}