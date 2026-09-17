import type { Metadata } from 'next'
import HomeClient from './components/HomeClient'
import { createClient } from '@/utils/supabase/server'
import { getApprovedTestimonials } from './actions/testimonials'
import JsonLd from './components/JsonLd'
import { getLocalBusinessSchema, getFaqSchema, HOMEPAGE_FAQS } from '@/lib/schemas'
import { isEventPastOrEnded } from './utils/format'

export const metadata: Metadata = {
  title: "Reset HTX | Rooftop Lounge, Craft Cocktails & Dining in Midtown Houston",
  description: "Experience Reset HTX — Midtown Houston's premier rooftop lounge. Join us for weekday happy hours, elevated rooftop dining, private events, and curated weekend nightlife.",
  alternates: {
    canonical: '/',
  },
}

// Refresh the page data every hour
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  // Get today's date in Houston (Central) time to include today's events
  const todayCentral = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })

  // Wrapper helpers to safely catch network exceptions
  const fetchFeatured = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select('*, category')
        .eq('is_featured', true)
        .gte('date', todayCentral)
        .order('date', { ascending: true })
      
      const activeUpcoming = (data || []).filter(e => !isEventPastOrEnded(e.date, e.time, e.end_time))
      return activeUpcoming.slice(0, 3)
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
        .gte('date', todayCentral)
        .order('date', { ascending: true })
      
      const activeUpcoming = (data || []).filter(e => !isEventPastOrEnded(e.date, e.time, e.end_time))
      return activeUpcoming.slice(0, 4)
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
    <>
      <JsonLd schema={getLocalBusinessSchema()} />
      <JsonLd schema={getFaqSchema(HOMEPAGE_FAQS)} />
      <HomeClient
        featuredEvents={featuredEvents}
        upcomingEvents={upcomingEvents}
        allEvents={allEvents}
        testimonials={testimonials || []}
      />
    </>
  )
} 