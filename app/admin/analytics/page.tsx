import {
    getOverviewMetrics,
    getVisitorTrend,
    getTopPages,
    getTrafficSources,
    getGeography,
    getDeviceBreakdown,
    getRealtimeUsers,
    getPeakTrafficHours,
    getReferralDetails,
    getLandingPages,
    getEventPagePerformance,
} from './actions'
import AnalyticsClient from './AnalyticsClient'

export default async function AnalyticsPage() {
    // Fetch all initial data in parallel (30-day default)
    const [overview, trend, pages, sources, geo, devices, realtime, peakHours, referrals, landingPages, eventPages] = await Promise.all([
        getOverviewMetrics('30days'),
        getVisitorTrend('30days'),
        getTopPages('30days'),
        getTrafficSources('30days'),
        getGeography('30days'),
        getDeviceBreakdown('30days'),
        getRealtimeUsers(),
        getPeakTrafficHours('30days'),
        getReferralDetails('30days'),
        getLandingPages('30days'),
        getEventPagePerformance('30days'),
    ])

    return (
        <div className="min-h-screen bg-slate-950 -m-8 p-8">
            <AnalyticsClient
                initialOverview={overview}
                initialTrend={trend}
                initialPages={pages}
                initialSources={sources}
                initialGeo={geo}
                initialDevices={devices}
                initialRealtime={realtime}
                initialPeakHours={peakHours}
                initialReferrals={referrals}
                initialLandingPages={landingPages}
                initialEventPages={eventPages}
            />
        </div>
    )
}
