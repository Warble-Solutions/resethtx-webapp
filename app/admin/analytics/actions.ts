'use server'

import { BetaAnalyticsDataClient } from '@google-analytics/data'
import path from 'path'

// --- GA4 Client Setup ---
const propertyId = process.env.GA4_PROPERTY_ID

function getClient() {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (credentialsPath) {
        // Resolve relative path from project root
        const absolutePath = path.resolve(process.cwd(), credentialsPath)
        return new BetaAnalyticsDataClient({ keyFilename: absolutePath })
    }
    // Fallback: individual env vars (for production without JSON file)
    const clientEmail = process.env.GA4_CLIENT_EMAIL
    const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n')
    if (clientEmail && privateKey) {
        return new BetaAnalyticsDataClient({
            credentials: { client_email: clientEmail, private_key: privateKey }
        })
    }
    throw new Error('Missing Google Analytics credentials')
}

// --- Simple in-memory cache ---
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key: string): any | null {
    const entry = cache.get(key)
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.data
    }
    return null
}

function setCache(key: string, data: any) {
    cache.set(key, { data, timestamp: Date.now() })
}

// --- Date range helpers ---
export type DateRangeKey = 'today' | '7days' | '30days' | '90days' | '12months' | 'custom'

export interface CustomDateRange {
    startDate: string  // YYYY-MM-DD
    endDate: string    // YYYY-MM-DD
}

function getDateRange(range: DateRangeKey, custom?: CustomDateRange): { startDate: string; endDate: string } {
    if (range === 'custom' && custom) {
        return { startDate: custom.startDate, endDate: custom.endDate }
    }
    const end = 'today'
    switch (range) {
        case 'today': return { startDate: 'today', endDate: end }
        case '7days': return { startDate: '7daysAgo', endDate: end }
        case '30days': return { startDate: '30daysAgo', endDate: end }
        case '90days': return { startDate: '90daysAgo', endDate: end }
        case '12months': return { startDate: '365daysAgo', endDate: end }
        default: return { startDate: '30daysAgo', endDate: end }
    }
}

function getPreviousDateRange(range: DateRangeKey, custom?: CustomDateRange): { startDate: string; endDate: string } {
    if (range === 'custom' && custom) {
        // Calculate the same duration shifted back
        const start = new Date(custom.startDate)
        const end = new Date(custom.endDate)
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        const prevEnd = new Date(start)
        prevEnd.setDate(prevEnd.getDate() - 1)
        const prevStart = new Date(prevEnd)
        prevStart.setDate(prevStart.getDate() - duration + 1)
        return {
            startDate: prevStart.toISOString().split('T')[0],
            endDate: prevEnd.toISOString().split('T')[0],
        }
    }
    switch (range) {
        case 'today': return { startDate: '1daysAgo', endDate: '1daysAgo' }
        case '7days': return { startDate: '14daysAgo', endDate: '8daysAgo' }
        case '30days': return { startDate: '60daysAgo', endDate: '31daysAgo' }
        case '90days': return { startDate: '180daysAgo', endDate: '91daysAgo' }
        case '12months': return { startDate: '730daysAgo', endDate: '366daysAgo' }
        default: return { startDate: '60daysAgo', endDate: '31daysAgo' }
    }
}

// ========== API FUNCTIONS ==========

export async function getOverviewMetrics(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `overview-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)
        const prevRange = getPreviousDateRange(range, custom)

        // Current period
        const [current] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'screenPageViews' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' },
                { name: 'screenPageViewsPerSession' },
                { name: 'newUsers' },
            ],
        })

        // Previous period for comparison
        const [previous] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [prevRange],
            metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'screenPageViews' },
            ],
        })

        const currentRow = current.rows?.[0]?.metricValues || []
        const prevRow = previous.rows?.[0]?.metricValues || []

        const result = {
            visitors: Number(currentRow[0]?.value || 0),
            sessions: Number(currentRow[1]?.value || 0),
            pageviews: Number(currentRow[2]?.value || 0),
            bounceRate: Number(currentRow[3]?.value || 0),
            avgSessionDuration: Number(currentRow[4]?.value || 0),
            pagesPerSession: Number(currentRow[5]?.value || 0),
            newUsers: Number(currentRow[6]?.value || 0),
            prevVisitors: Number(prevRow[0]?.value || 0),
            prevSessions: Number(prevRow[1]?.value || 0),
            prevPageviews: Number(prevRow[2]?.value || 0),
        }

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Overview Error:', error.message)
        return null
    }
}

export async function getVisitorTrend(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `trend-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
            ],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
        })

        const result = (response.rows || []).map(row => ({
            date: row.dimensionValues?.[0]?.value || '',
            visitors: Number(row.metricValues?.[0]?.value || 0),
            sessions: Number(row.metricValues?.[1]?.value || 0),
        }))

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Trend Error:', error.message)
        return []
    }
}

export async function getTopPages(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `pages-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [
                { name: 'pagePath' },
                { name: 'pageTitle' },
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'averageSessionDuration' },
            ],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 15,
        })

        const result = (response.rows || []).map(row => ({
            path: row.dimensionValues?.[0]?.value || '',
            title: row.dimensionValues?.[1]?.value || '',
            views: Number(row.metricValues?.[0]?.value || 0),
            users: Number(row.metricValues?.[1]?.value || 0),
            avgDuration: Number(row.metricValues?.[2]?.value || 0),
        }))

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Pages Error:', error.message)
        return []
    }
}

export async function getTrafficSources(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `sources-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [
                { name: 'sessions' },
                { name: 'activeUsers' },
            ],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 10,
        })

        const result = (response.rows || []).map(row => ({
            channel: row.dimensionValues?.[0]?.value || '',
            sessions: Number(row.metricValues?.[0]?.value || 0),
            users: Number(row.metricValues?.[1]?.value || 0),
        }))

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Sources Error:', error.message)
        return []
    }
}

export async function getGeography(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `geo-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [cityResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'city' }],
            metrics: [{ name: 'activeUsers' }],
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
            limit: 10,
        })

        const [countryResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'activeUsers' }],
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
            limit: 5,
        })

        const result = {
            cities: (cityResponse.rows || []).map(row => ({
                city: row.dimensionValues?.[0]?.value || '',
                users: Number(row.metricValues?.[0]?.value || 0),
            })),
            countries: (countryResponse.rows || []).map(row => ({
                country: row.dimensionValues?.[0]?.value || '',
                users: Number(row.metricValues?.[0]?.value || 0),
            })),
        }

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Geography Error:', error.message)
        return { cities: [], countries: [] }
    }
}

export async function getDeviceBreakdown(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `devices-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [deviceResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'activeUsers' }],
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        })

        const [browserResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'browser' }],
            metrics: [{ name: 'activeUsers' }],
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
            limit: 5,
        })

        const result = {
            devices: (deviceResponse.rows || []).map(row => ({
                device: row.dimensionValues?.[0]?.value || '',
                users: Number(row.metricValues?.[0]?.value || 0),
            })),
            browsers: (browserResponse.rows || []).map(row => ({
                browser: row.dimensionValues?.[0]?.value || '',
                users: Number(row.metricValues?.[0]?.value || 0),
            })),
        }

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Devices Error:', error.message)
        return { devices: [], browsers: [] }
    }
}

export async function getRealtimeUsers() {
    const cacheKey = 'realtime'
    const cached = getCached(cacheKey)
    if (cached !== null) return cached as number

    try {
        const client = getClient()

        const [response] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: 'activeUsers' }],
        })

        const count = Number(response.rows?.[0]?.metricValues?.[0]?.value || 0)
        // Cache realtime for only 30 seconds
        cache.set(cacheKey, { data: count, timestamp: Date.now() })
        return count
    } catch (error: any) {
        console.error('GA4 Realtime Error:', error.message)
        return 0
    }
}

export async function getPeakTrafficHours(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `peakhours-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [
                { name: 'dayOfWeek' },  // 0=Sun, 1=Mon, ..., 6=Sat
                { name: 'hour' },        // 00-23
            ],
            metrics: [{ name: 'activeUsers' }],
        })

        // Build a 7x24 heatmap grid
        const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))

        for (const row of response.rows || []) {
            const day = Number(row.dimensionValues?.[0]?.value || 0)
            const hour = Number(row.dimensionValues?.[1]?.value || 0)
            const users = Number(row.metricValues?.[0]?.value || 0)
            grid[day][hour] = users
        }

        setCache(cacheKey, grid)
        return grid
    } catch (error: any) {
        console.error('GA4 Peak Hours Error:', error.message)
        return Array.from({ length: 7 }, () => Array(24).fill(0))
    }
}

export async function getReferralDetails(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `referrals-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [
                { name: 'sessionSource' },
                { name: 'sessionMedium' },
            ],
            metrics: [
                { name: 'sessions' },
                { name: 'activeUsers' },
            ],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 15,
        })

        const result = (response.rows || []).map(row => ({
            source: row.dimensionValues?.[0]?.value || '(direct)',
            medium: row.dimensionValues?.[1]?.value || '(none)',
            sessions: Number(row.metricValues?.[0]?.value || 0),
            users: Number(row.metricValues?.[1]?.value || 0),
        }))

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Referrals Error:', error.message)
        return []
    }
}

export async function getLandingPages(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `landing-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: 'landingPage' }],
            metrics: [
                { name: 'sessions' },
                { name: 'activeUsers' },
                { name: 'bounceRate' },
            ],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 10,
        })

        const result = (response.rows || []).map(row => ({
            page: row.dimensionValues?.[0]?.value || '',
            sessions: Number(row.metricValues?.[0]?.value || 0),
            users: Number(row.metricValues?.[1]?.value || 0),
            bounceRate: Number(row.metricValues?.[2]?.value || 0),
        }))

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Landing Pages Error:', error.message)
        return []
    }
}

export async function getEventPagePerformance(range: DateRangeKey = '30days', custom?: CustomDateRange) {
    const cacheKey = `events-perf-${range}-${custom?.startDate || ''}-${custom?.endDate || ''}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
        const client = getClient()
        const dateRange = getDateRange(range, custom)

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [
                { name: 'pagePath' },
                { name: 'pageTitle' },
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'averageSessionDuration' },
            ],
            dimensionFilter: {
                filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                        matchType: 'BEGINS_WITH',
                        value: '/events',
                    },
                },
            },
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 15,
        })

        const result = (response.rows || []).map(row => ({
            path: row.dimensionValues?.[0]?.value || '',
            title: row.dimensionValues?.[1]?.value || '',
            views: Number(row.metricValues?.[0]?.value || 0),
            users: Number(row.metricValues?.[1]?.value || 0),
            avgDuration: Number(row.metricValues?.[2]?.value || 0),
        }))

        setCache(cacheKey, result)
        return result
    } catch (error: any) {
        console.error('GA4 Event Performance Error:', error.message)
        return []
    }
}
