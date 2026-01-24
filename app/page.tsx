import HomeClient from './components/HomeClient'
import { createClient } from '@/utils/supabase/server'
import { getApprovedTestimonials } from './actions/testimonials'

// Refresh the page data every hour
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  // Parallelize data fetching
  const [featuredResult, upcomingEventsResult, allEventsResult, testimonials] = await Promise.all([
    // 1. Fetch Featured Events (Carousel)
    supabase
      .from('events')
      .select('*, category')
      .eq('is_featured', true)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(5),

    // 2. NEW: Fetch Upcoming Events (List Section - Next 4)
    supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString()) // Only future
      .order('date', { ascending: true })    // Closest first
      .limit(4),

    // 3. Fetch All Events (Calendar)
    supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true }),

    // 4. Fetch Testimonials
    getApprovedTestimonials()
  ])

  const featuredEvents = featuredResult.data
  const upcomingEvents = upcomingEventsResult.data
  const allEvents = allEventsResult.data

  return (
    <HomeClient
      featuredEvents={featuredEvents || []}
      upcomingEvents={upcomingEvents || []}
      allEvents={allEvents || []}
      testimonials={testimonials || []}
    />
  )
}