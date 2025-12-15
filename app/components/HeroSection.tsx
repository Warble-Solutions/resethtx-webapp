import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import HeroCarousel from './HeroCarousel'

export default async function HeroSection() {
  const supabase = await createClient()

  // 1. Fetch ALL "Featured" events (Removed .single())
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .gte('date', new Date().toISOString()) // Only future events
    .order('date', { ascending: true })

  // 2. Fallback if NO events are featured
  if (!events || events.length === 0) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <h2 className="text-[#D4AF37] tracking-[0.3em] font-bold text-sm mb-4 uppercase">
            Welcome to Reset HTX
          </h2>
          <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            TASTE THE <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#F0DEAA]">VIBE</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            From midweek happy hours to weekend rooftop raves. <br/> Check the calendar to reserve your spot.
          </p>
          <Link 
            href="/events"
            className="inline-block bg-[#D4AF37] text-black font-bold px-10 py-4 uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            View Calendar
          </Link>
        </div>
      </section>
    )
  }

  // 3. Pass the array of events to the Client Carousel
  return <HeroCarousel events={events} />
}