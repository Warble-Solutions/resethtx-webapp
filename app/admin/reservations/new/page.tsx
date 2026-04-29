import { createClient } from '@/utils/supabase/server'
import ManualReservationForm from '../components/ManualReservationForm'
import Link from 'next/link'

export default async function NewReservationPage() {
    const supabase = await createClient()

    // Fetch all upcoming events so the client component can filter them dynamically
    const today = new Date().toISOString().split('T')[0]
    const { data: events } = await supabase
        .from('events')
        .select('id, title, date, image_url')
        .gte('date', today)
        .order('date', { ascending: true })

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <Link 
                    href="/admin/reservations" 
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </Link>
                <h1 className="text-3xl font-bold text-white font-heading tracking-wide">
                    Add <span className="text-[#D4AF37]">Reservation</span>
                </h1>
            </div>

            <ManualReservationForm upcomingEvents={events || []} />
        </div>
    )
}
