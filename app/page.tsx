import HomeClient from './components/HomeClient'
import { createClient } from '@/utils/supabase/server'

// Refresh the page data every hour
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  // 1. Fetch Featured Events (Next 5 upcoming events)
  const { data: featuredEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(5)

  // 2. Fetch All Events (For the Calendar section further down)
  const { data: allEvents } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  // 3. Fetch Testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <HomeClient
      featuredEvents={featuredEvents || []}
      allEvents={allEvents || []}
      testimonials={testimonials || []}
    />
  )
}