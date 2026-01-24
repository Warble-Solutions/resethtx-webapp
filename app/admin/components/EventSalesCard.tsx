'use client'

interface EventStats {
    id: string
    title: string
    date: string
    image_url: string | null
    ticketsSold: number
    totalRevenue: number
}

export default function EventSalesCard({ event, onClick }: { event: EventStats, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="group relative bg-[#111] rounded-xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="flex">
                {/* Image */}
                <div className="relative w-24 h-auto aspect-square shrink-0">
                    {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs">No Img</div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-center grow">
                    <div className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-1">
                        {new Date(event.date).toLocaleDateString('en-US')}
                    </div>
                    <h3 className="text-white font-bold leading-tight group-hover:text-[#D4AF37] transition-colors mb-2">
                        {event.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div>
                            <div className="text-slate-500 text-[10px] uppercase font-bold">Tickets</div>
                            <div className="text-white font-mono text-lg">{event.ticketsSold}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-slate-500 text-[10px] uppercase font-bold">Revenue</div>
                            <div className="text-[#D4AF37] font-mono text-lg font-bold">${event.totalRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
