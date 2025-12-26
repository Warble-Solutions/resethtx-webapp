import Link from 'next/link'
import Image from 'next/image'

// 1. Define the Interface
interface Event {
  id: string
  title: string
  date: string
  time: string | null
  image_url: string | null
  description: string | null
  tickets: number
}

// 2. Helper Functions
const getEventTag = (title: string, time: string | null) => {
  const t = time?.toLowerCase() || ''
  const name = title.toLowerCase()
  if (name.includes('happy') || t.includes('pm - 8')) return 'HAPPY HOUR'
  if (t.includes('am')) return 'NIGHTLIFE'
  return 'LIVE DJ'
}

const getMonth = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('default', { month: 'short' }).toUpperCase()
}

const getDay = (dateString: string) => {
  const date = new Date(dateString)
  return date.getDate()
}

// 3. Component
export default function UpcomingEventsSection({ events }: { events: Event[] }) {

  // Display only first 3 events
  const featuredEvents = events ? events.slice(0, 3) : []

  return (
    <section className="bg-[#050505] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-[#A1A1AA] text-[10px] uppercase tracking-[0.3em] font-sans font-medium mb-4">
            The Agenda
          </p>
          <h2 className="font-heading text-5xl md:text-6xl text-white font-light uppercase tracking-tight">
            Upcoming
          </h2>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <div
                key={event.id}
                className="relative aspect-square w-full group overflow-hidden bg-[#111] cursor-pointer"
              >
                {/* Image */}
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}

                {/* Date Box (Top Left) */}
                <div className="absolute top-6 left-6 w-16 h-16 bg-[#C59D24] text-black flex flex-col items-center justify-center font-serif z-10 shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 font-sans">
                    {getMonth(event.date)}
                  </span>
                  <span className="text-3xl font-bold font-heading leading-none">
                    {getDay(event.date)}
                  </span>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" />

                {/* Text Content (Bottom Left) */}
                <div className="absolute bottom-8 left-8 z-20">
                  <span className="text-[#C59D24] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block font-sans">
                    {getEventTag(event.title, event.time)}
                  </span>
                  <h3 className="text-2xl font-heading text-white uppercase tracking-wide leading-tight">
                    {event.title}
                  </h3>
                </div>

                {/* Link Wrapper */}
                <Link href="/events" className="absolute inset-0 z-30" aria-label={`View details for ${event.title}`} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-slate-500 font-sans tracking-widest text-sm uppercase">
              No upcoming events found.
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link
            href="/events"
            className="inline-block text-[10px] text-white uppercase tracking-[0.2em] font-bold border-b border-[#C59D24] pb-1 hover:text-[#C59D24] transition-colors font-sans"
          >
            View Full Calendar
          </Link>
        </div>

      </div>
    </section>
  )
}