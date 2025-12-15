import Link from 'next/link'
import Image from 'next/image'

// Dummy data matching your visual style
const dummyEvents = [
  {
    id: 1,
    title: "ROOFTOP RHYTHMS",
    date: "2025-11-24",
    time: "9:00 PM - 2:00 AM",
    description: "Experience the best House and Techno beats with a skyline view.",
    imageUrl: "/images/event-1.png", 
    price: "$20",
    tag: "LIVE DJ",
    link: "/events/rooftop-rhythms",
  },
  {
    id: 2,
    title: "SUNSET SIPS",
    date: "2025-11-25",
    time: "4:00 PM - 8:00 PM",
    description: "Half-price specialty cocktails while you watch the sun go down.",
    imageUrl: "/images/event-2.png", 
    price: "Free Entry",
    tag: "HAPPY HOUR",
    link: "/events/sunset-sips",
  },
  {
    id: 3,
    title: "MIDTOWN MADNESS",
    date: "2025-11-26",
    time: "10:00 PM - 2:00 AM",
    description: "The wildest party in Midtown. Bottle service recommended.",
    imageUrl: "/images/event-3.png",
    price: "$15",
    tag: "NIGHTLIFE",
    link: "/events/midtown-madness",
  },
]

export default function UpcomingEventsSection() {
  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER matching the 'Trending Now' style */}
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase">
            TRENDING <span className="text-[#D4AF37]">NOW</span>
          </h2>
          
          <Link 
            href="/events" 
            className="hidden md:flex items-center gap-1 text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            VIEW ALL <span>→</span>
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dummyEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-[#111827] rounded-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-[#D4AF37]/50"
            >
              {/* Image Area */}
              <div className="relative h-56 w-full">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Tag */}
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {event.tag}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-6">
                {/* Date Row */}
                <div className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">
                  {event.date} • {event.time}
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-white mb-3 leading-tight">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                  {event.description}
                </p>

                {/* Footer Row */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-white font-bold text-lg">{event.price}</span>
                  <Link 
                    href={event.link}
                    className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    DETAILS →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All (Bottom) */}
        <div className="mt-8 flex justify-center md:hidden">
            <Link 
                href="/events" 
                className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
                VIEW ALL EVENTS →
            </Link>
        </div>

      </div>
    </section>
  )
}