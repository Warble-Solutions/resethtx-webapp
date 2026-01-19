import HomeClient from './components/HomeClient'
import { createClient } from '@/utils/supabase/server'
import { getApprovedTestimonials } from './actions/testimonials'

// Refresh the page data every hour
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  // Parallelize data fetching
  const [featuredResult, allEventsResult, testimonials] = await Promise.all([
    // 1. Fetch Featured Events
    supabase
      .from('events')
      .select('*, category')
      .eq('is_featured', true)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(5),

    // 2. Fetch All Events
    supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true }),

    // 3. Fetch Testimonials
    getApprovedTestimonials()
  ])

  const featuredEvents = featuredResult.data
  const allEvents = allEventsResult.data

  return (
    <HomeClient
      featuredEvents={featuredEvents || []}
      allEvents={allEvents || []}
      testimonials={testimonials || []}
    />
  )
}