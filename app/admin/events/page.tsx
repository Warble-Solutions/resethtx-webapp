import { createClient } from '@/utils/supabase/server'
import { deleteEvent } from './create/actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''

  // 1. Get current time in ISO format
  const now = new Date().toISOString()

  // 2. Filter: Only show events happening NOW or in the FUTURE
  let dbQuery = supabase
    .from('events')
    .select('*')
    .gte('date', now) // <--- THIS IS THE MAGIC FILTER
    .order('date', { ascending: true })

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  const { data: events } = await dbQuery

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
          <p className="text-slate-400 mt-1">Manage your active schedule.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

          {/* Row 1: Search Bar (Full width on mobile) */}
          <div className="w-full md:w-64">
            <SearchInput placeholder="Search upcoming..." />
          </div>

          {/* Row 2: Buttons (Side-by-side on mobile, inline on desktop) */}
          <div className="flex gap-3 w-full md:w-auto">
            <Link
              href="/admin/events/archive"
              className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-5 rounded-lg transition-all border border-slate-700 flex items-center justify-center whitespace-nowrap"
            >
              📜 Past Events
            </Link>

            <Link
              href="/admin/events/create"
              className="flex-1 md:flex-none bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium py-2.5 px-5 rounded-lg transition-all shadow-lg whitespace-nowrap flex items-center justify-center"
            >
              + Add New
            </Link>
          </div>
        </div>
      </div>

      {events?.length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
          <p className="text-slate-400 mb-4 text-lg">
            {query ? `No upcoming events match "${query}"` : "No upcoming events scheduled."}
          </p>
          {!query && (
            <Link href="/admin/events/create" className="text-[#D4AF37] font-semibold hover:text-[#b5952f]">
              Create your first event
            </Link>
          )}
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <SpotlightCard key={event.id} className="group flex flex-col p-0 h-full">
              {/* Image Section */}
              <div className="h-48 bg-slate-800 relative mb-4 -mx-6 -mt-6 w-[calc(100%+3rem)]">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                  {new Date(event.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col px-6 pb-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{event.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                  {event.description || "No description."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                  <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                    🎟️ {event.tickets_available} Tickets
                  </span>

                  <div className="flex items-center gap-4">
                    <Link href={`/admin/events/${event.id}/edit`} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                      EDIT
                    </Link>
                    <form action={deleteEvent} className="flex">
                      <input type="hidden" name="id" value={event.id} />
                      <button type="submit" className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider">
                        DELETE
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  )
}