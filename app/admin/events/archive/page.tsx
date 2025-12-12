import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''
  const now = new Date().toISOString()

  // 1. Filter: Only show events in the PAST
  let dbQuery = supabase
    .from('events')
    .select('*')
    .lt('date', now) // <--- Less Than Now
    .order('date', { ascending: false }) // Newest past events first

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  const { data: events } = await dbQuery

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-400">Past Events</h1>
          <p className="text-slate-500 mt-1">Archive history.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <div className="w-full md:w-64">
                <SearchInput placeholder="Search history..." />
            </div>
            <Link 
              href="/admin/events"
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all border border-slate-700 whitespace-nowrap"
            >
              ← Back to Upcoming
            </Link>
        </div>
      </div>

      {events?.length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
           <p className="text-slate-400 text-lg">
            No past events found in the archive.
          </p>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <SpotlightCard key={event.id} className="group flex flex-col p-0 h-full opacity-75 hover:opacity-100 transition-opacity">
              
              {/* Image Section (Grayscale to indicate 'Past') */}
              <div className="h-48 bg-slate-800 relative mb-4 -mx-6 -mt-6 w-[calc(100%+3rem)]">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-slate-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-800">
                  ENDED: {new Date(event.date).toLocaleDateString()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col px-6 pb-6">
                <h3 className="text-xl font-bold text-slate-300 mb-2">{event.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                  {event.description || "No description."}
                </p>

                <div className="pt-4 border-t border-slate-800 mt-auto">
                  <span className="text-xs font-bold text-slate-600 bg-slate-900 px-2 py-1 rounded border border-slate-800 whitespace-nowrap">
                    Had {event.tickets_available} Tickets
                  </span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  )
}