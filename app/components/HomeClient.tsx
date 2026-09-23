'use client'

import { useState } from 'react'
import HeroCarousel from './HeroCarousel'
import HomeAboutSnippet from './HomeAboutSnippet'
import EventsCalendar from './EventsCalendar'
import TheExperienceSection from './TheExperienceSection'
import RooftopDiningSection from './RooftopDiningSection'
import WeeklyProgrammingSection from './WeeklyProgrammingSection'
import VenueShowcaseSection from './VenueShowcaseSection'
import VipLoungeSection from './VipLoungeSection'
import TestimonialsSection from './TestimonialsSection'
import ReviewsCTA from './ReviewsCTA'
import HomeFaqSection from './HomeFaqSection'
import EventModal from './EventModal'
import ReviewModal from './ReviewModal'

interface Event {
    id: string
    title: string
    date: string
    time: string | null
    image_url: string | null
    featured_image_url?: string | null
    description?: string | null
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

            {/* 1. CINEMATIC LUXURY HERO (2 Main Brand Banners + up to 5 Featured Events) */}
            <HeroCarousel
                events={featuredEvents}
                onEventClick={handleEventClick}
            />

            {/* ABOUT / SUMMARY BRAND SNIPPET */}
            <HomeAboutSnippet />

            {/* 2. INTERACTIVE EVENT CALENDAR MATRIX */}
            <EventsCalendar
                events={allEvents}
                onEventClick={handleEventClick}
            />

            {/* 3. BRAND NARRATIVE: AN ELEVATED ESCAPE ABOVE MIDTOWN */}
            <TheExperienceSection />

            {/* 3. ROOFTOP DINING & COCKTAIL MAGAZINE SPREAD */}
            <RooftopDiningSection />

            {/* 4. CURATED WEEKLY RESIDENCY SCHEDULE (Wed, Thu, Fri, Sat, Sun) */}
            <WeeklyProgrammingSection
                events={allEvents}
                onEventClick={handleEventClick}
            />

            {/* 5. PRIVATE BUYOUTS & EXECUTIVE ENTERTAINING */}
            <VenueShowcaseSection />

            {/* 6. VIP BOOTHS & BOTTLE CONCIERGE */}
            <VipLoungeSection />

            {/* 7. GUEST TESTIMONIALS */}
            <TestimonialsSection testimonials={testimonials} />

            {/* 8. REVIEWS CTA */}
            <ReviewsCTA onOpenReview={() => setIsReviewModalOpen(true)} />

            {/* 9. ESSENTIAL GUEST FAQ */}
            <HomeFaqSection />

            {/* MODALS */}
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
