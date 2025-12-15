import HeroCarousel from './components/HeroCarousel' // <--- Only import this for the top section
import UpcomingEventsSection from './components/UpcomingEventsSection'
import EventsCalendar from './components/EventsCalendar'
import TestimonialsSection from './components/TestimonialsSection'
import SonicLandscapeSection from './components/SonicLandscapeSection'
import PlanYourNightSection from './components/PlanYourNightSection'
import { createClient } from '@/utils/supabase/server'

// Refresh the page data every hour
export const revalidate = 3600 

export default async function Home() {
  const supabase = await createClient()
  
  // 1. Fetch Featured Events (Next 5 upcoming events)
  // These will be passed to the HeroCarousel
  const { data: featuredEvents } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString()) // Only future events
    .order('date', { ascending: true })
    .limit(5)

  // 2. Fetch All Events (For the Calendar section further down)
  const { data: allEvents } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      
      {/* SMART HERO: 
         We pass the events to the carousel. 
         - If 'featuredEvents' has data, it shows the Cinematic Carousel.
         - If 'featuredEvents' is empty, it automatically falls back to the static HeroSection.
      */}
      <HeroCarousel events={featuredEvents || []} />
      
      {/* Trending Now Section */}
      <UpcomingEventsSection events={featuredEvents || []} />

      {/* Main Calendar */}
      <EventsCalendar events={allEvents || []} />
      
      <TestimonialsSection />

      <SonicLandscapeSection />

      <PlanYourNightSection />

    </main>
  )
}