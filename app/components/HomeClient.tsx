/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import HeroCarousel from './HeroCarousel'
import UpcomingEventsSection from './UpcomingEventsSection'
import EventsCalendar from './EventsCalendar'
import TestimonialsSection from './TestimonialsSection'
import SonicLandscapeSection from './SonicLandscapeSection'
import EventModal from './EventModal'
import ReviewModal from './ReviewModal'
import ReviewsCTA from './ReviewsCTA'
import ExclusiveAccess from './ExclusiveAccess'
import HappyHourSection from './HappyHourSection'


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
    upcomingEvents,
    allEvents,
    testimonials
}: {
    featuredEvents: any[],
    upcomingEvents: any[],
    allEvents: any[],
    testimonials: any[]
}) {
    const [selectedEvents, setSelectedEvents] = useState<Event[] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    const handleEventClick = (eventOrEvents: Event | Event[]) => {
        if (Array.isArray(eventOrEvents)) {
            setSelectedEvents(eventOrEvents)
        } else {
            setSelectedEvents([eventOrEvents])
        }
        setIsModalOpen(true)
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">

            <HeroCarousel
                events={featuredEvents}
                onEventClick={handleEventClick}
            />

            {/* Restored Calendar Widget */}
            <EventsCalendar
                events={allEvents}
                onEventClick={handleEventClick}
            />

            {/* Restored Upcoming Events Section */}
            <UpcomingEventsSection events={upcomingEvents} />

            <ExclusiveAccess />

            {/* REPLACED: PrivateEventsSection with HappyHourSection */}
            <HappyHourSection />

            <TestimonialsSection testimonials={testimonials} />

            <SonicLandscapeSection />

            {/* REMOVED: ReservationSection */}
            {/* REMOVED: PlanYourNightSection */}

            <ReviewsCTA onOpenReview={() => setIsReviewModalOpen(true)} />



            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                events={selectedEvents}
            />

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
            />

        </main>
    )
}
