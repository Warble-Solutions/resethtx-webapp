import EventBookingSystem from '@/app/components/EventBookingSystem';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function ReservationsPage() {
    const supabase = await createClient()

    // Fetch the next upcoming event
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(1)

    const nextEvent = events && events.length > 0 ? events[0] : null

    return (
        <main className="min-h-screen pt-24 bg-black">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-cinzel text-center text-white mb-8">
                    RESERVE A <span className="text-[#D4AF37]">TABLE</span>
                </h1>

                {nextEvent ? (
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl text-white font-heading">{nextEvent.title}</h2>
                            <p className="text-slate-400">{new Date(nextEvent.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                        </div>
                        <EventBookingSystem eventId={nextEvent.id} eventDate={nextEvent.date} />
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-white text-xl mb-4">No upcoming events scheduled for booking.</p>
                        <Link href="/contact" className="text-[#D4AF37] hover:underline">Contact us for private events</Link>
                    </div>
                )}
            </div>
        </main>
    );
}
