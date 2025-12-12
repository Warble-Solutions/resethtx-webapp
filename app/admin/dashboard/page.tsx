import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all data
  const [
    { count: eventsCount },
    { count: menuCount },
    { count: staffCount },
    { data: tables },
    { data: nextEvent }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }),
    supabase.from('employees').select('*', { count: 'exact', head: true }),
    supabase.from('tables').select('*'),
    supabase.from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(1)
      .single()
  ])

  // Package the stats to pass to the client
  const stats = {
    eventsCount: eventsCount || 0,
    menuCount: menuCount || 0,
    staffCount: staffCount || 0,
  }

  return (
    // Force a dark theme for the dashboard area to make the glows pop
    <div className="min-h-screen bg-slate-950 -m-8 p-8">
      <DashboardClient 
        stats={stats}
        tables={tables || []}
        nextEvent={nextEvent}
      />
    </div>
  )
}