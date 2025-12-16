import Link from 'next/link'
import Image from 'next/image'

// 1. Define the Interface so TypeScript knows what 'events' look like
interface Event {
  id: string
  title: string
  date: string
  time: string | null
  image_url: string | null
  description: string | null
  tickets: number
}

// 2. Add helper functions
const getEventTag = (title: string, time: string | null) => {
  const t = time?.toLowerCase() || ''
  const name = title.toLowerCase()
  if (name.includes('happy') || t.includes('pm - 8')) return 'HAPPY HOUR'
  if (t.includes('am')) return 'NIGHTLIFE'
  return 'LIVE EVENT'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// 3. Update the function signature to accept { events }
export default function UpcomingEventsSection({ events }: { events: Event[] }) {
  
  // Safe check: ensure events exist before slicing
  const featuredEvents = events ? events.slice(0, 3) : []

  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase">
            TRENDING <span className="text-[#C59D24]">NOW</span>
          </h2>
          
          <Link 
            href="/events" 
            className="hidden md:flex items-center gap-1 text-[#C59D24] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            VIEW ALL <span>→</span>
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-[#111827] rounded-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-[#C59D24]/50 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative h-56 w-full shrink-0">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">NO IMAGE</div>
                  )}
                  {/* Dynamic Tag */}
                  <span className="absolute top-4 left-4 bg-[#C59D24] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {getEventTag(event.title, event.time)}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[#C59D24] text-[10px] font-bold uppercase tracking-widest mb-2">
                    {formatDate(event.date)} • {event.time || 'TBA'}
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-3 leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                    {event.description || 'Join us for an unforgettable night.'}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-white font-bold text-lg">
                        {event.tickets > 0 ? 'Tickets Avail' : 'Sold Out'}
                    </span>
                    <Link 
                      href={`/events`} 
                      className="text-[#C59D24] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      DETAILS →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-slate-500">
                No upcoming events scheduled.
            </div>
          )}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center md:hidden">
            <Link 
                href="/events" 
                className="text-[#C59D24] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
                VIEW ALL EVENTS →
            </Link>
        </div>

      </div>
    </section>
  )
}