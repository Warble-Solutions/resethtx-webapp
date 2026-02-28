import HomeClient from './components/HomeClient'
import { createClient } from '@/utils/supabase/server'
import { getApprovedTestimonials } from './actions/testimonials'

// Refresh the page data every hour
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  // Wrapper helpers to safely catch network exceptions
  const fetchFeatured = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*, category')
        .eq('is_featured', true)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5)
      return data || []
    } catch (err) {
      console.error('Featured Events Fetch Error:', err)
      return []
    }
  }

  const fetchUpcoming = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(4)
      return data || []
    } catch (err) {
      console.error('Upcoming Events Fetch Error:', err)
      return []
    }
  }

  const fetchAll = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      return data || []
    } catch (err) {
      console.error('All Events Fetch Error:', err)
      return []
    }
  }

  // Parallelize data fetching safely
  const [featuredEvents, upcomingEvents, allEvents, testimonials] = await Promise.all([
    fetchFeatured(),
    fetchUpcoming(),
    fetchAll(),
    getApprovedTestimonials()
  ])

  return (
    <HomeClient
      featuredEvents={featuredEvents}
      upcomingEvents={upcomingEvents}
      allEvents={allEvents}
      testimonials={testimonials || []}
    />
  )
}