import { createClient } from '@/utils/supabase/server'
import { deleteEvent } from './create/actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, created?: string, title?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''
  const createdCount = params?.created
  const createdTitle = params?.title

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


      {/* Success Notification */}
      {
        createdCount && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-4 border-l-4 border-l-green-500 shadow-lg shadow-green-900/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
            <div className="relative w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-xl border border-green-500/30">✓</div>
            <div className="relative">
              <h3 className="text-white font-bold text-base">Success!</h3>
              <p className="text-green-200 text-sm">Created <span className="font-bold text-white">{createdCount}</span> events for "<span className="font-italic text-white">{createdTitle || 'Untitled Event'}</span>".</p>
            </div>
            <Link href="/admin/events" className="relative ml-auto text-xs font-bold text-green-500 hover:text-white uppercase tracking-wider px-3 py-1 rounded bg-green-500/10 hover:bg-green-500 transition-colors">
              Dismiss
            </Link>
          </div>
        )
      }

      {
        events?.length === 0 ? (
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
                  <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {event.is_sold_out && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md shadow-black/50 z-10 border border-white/20 uppercase tracking-wider">
                        SOLD OUT
                      </span>
                    )}
                    {event.is_featured && (
                      <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-md shadow-black/50 z-10 border border-white/20 uppercase tracking-wider">
                        FEATURED
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-6 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{event.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                    {event.description || "No description."}
                  </p>

                  <div className="flex flex-row items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                      🎟️ {event.tickets_available} Tickets
                    </span>

                    <form action={async () => {
                      "use server"
                      const supabase = await createClient()
                      await supabase.from('events').update({ is_sold_out: !event.is_sold_out }).eq('id', event.id)
                      const { revalidatePath } = await import('next/cache')
                      revalidatePath('/admin/events')
                    }}>
                      <button
                        type="submit"
                        title={event.is_sold_out ? "Mark as Available" : "Mark as Sold Out"}
                        className={`font-bold text-xs px-4 py-2 rounded-full transition-colors whitespace-nowrap ${event.is_sold_out ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                      >
                        {event.is_sold_out ? 'AVAILABLE' : 'MARK SOLD OUT'}
                      </button>
                    </form>
                    <Link href={`/admin/events/${event.id}/edit`} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider ml-auto">
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
              </SpotlightCard>
            ))}
          </div>
        )
      }
    </div >
  )
}