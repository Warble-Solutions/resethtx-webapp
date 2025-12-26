'use client'

import { useState } from 'react'
import HeroCarousel from './HeroCarousel'
import UpcomingEventsSection from './UpcomingEventsSection'
import EventsCalendar from './EventsCalendar'
import TestimonialsSection from './TestimonialsSection'
import SonicLandscapeSection from './SonicLandscapeSection'
import PlanYourNightSection from './PlanYourNightSection'
import ReservationSection from './ReservationSection'
import EventModal from './EventModal'

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    image_url: string | null
    featured_image_url?: string | null
    description?: string | null
    // ... flexible for other props
    [key: string]: any
}

export default function HomeClient({
    featuredEvents,
    allEvents,
    testimonials
}: {
    featuredEvents: any[],
    allEvents: any[],
    testimonials: any[]
}) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">

            <HeroCarousel
                events={featuredEvents}
                onEventClick={handleEventClick}
            />

            <EventsCalendar
                events={allEvents}
                onEventClick={handleEventClick}
            />

            <UpcomingEventsSection events={featuredEvents} />

            <TestimonialsSection testimonials={testimonials} />

            <SonicLandscapeSection />

            <ReservationSection />

            <PlanYourNightSection />

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
            />

        </main>
    )
}
