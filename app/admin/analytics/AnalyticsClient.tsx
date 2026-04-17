'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
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
    type DateRangeKey,
    type CustomDateRange,
} from './actions'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement, BarElement)

// --- Types ---
interface OverviewData {
    visitors: number; sessions: number; pageviews: number;
    bounceRate: number; avgSessionDuration: number; pagesPerSession: number; newUsers: number;
    prevVisitors: number; prevSessions: number; prevPageviews: number;
}
interface TrendPoint { date: string; visitors: number; sessions: number }
interface PageData { path: string; title: string; views: number; users: number; avgDuration: number }
interface SourceData { channel: string; sessions: number; users: number }
interface GeoData { cities: { city: string; users: number }[]; countries: { country: string; users: number }[] }
interface DeviceData { devices: { device: string; users: number }[]; browsers: { browser: string; users: number }[] }
interface ReferralData { source: string; medium: string; sessions: number; users: number }
interface LandingPageData { page: string; sessions: number; users: number; bounceRate: number }

// --- Metric Explanations ---
const METRIC_INFO: Record<string, string> = {
    liveNow: 'The number of users currently active on your site in real-time.',
    visitors: 'Unique users who visited your site during the selected period.',
    sessions: 'Total number of visits. One user can have multiple sessions.',
    pageviews: 'Total number of pages viewed. Repeated views of a single page are counted.',
    bounceRate: 'Percentage of sessions where the user left without interacting beyond the first page.',
    avgDuration: 'The average length of a user session from start to finish.',
    pagesPerSession: 'Average number of pages a user views during a single session.',
    newUsers: 'Users who visited your site for the first time during this period.',
    topPages: 'Pages ranked by total views. Shows which content attracts the most traffic.',
    trafficSources: 'How users find your site — organic search, direct visits, social media, etc.',
    devices: 'Breakdown of device types (mobile, desktop, tablet) and browsers used by visitors.',
    geography: 'Top cities and countries your visitors are located in.',
    peakHours: 'Heatmap showing when your site gets the most traffic. Warmer colors = more visitors. Use this to time your social media posts.',
    referrals: 'Specific websites and platforms that send visitors to your site, with the traffic medium (organic, referral, social, etc.).',
    landingPages: 'The first page visitors see when they arrive. Shows where your traffic enters the site.',
    eventPages: 'Performance of your event pages — which events attract the most interest from visitors.',
}

// --- Info Tooltip Component ---
function InfoTooltip({ metricKey }: { metricKey: string }) {
    const [show, setShow] = useState(false)
    const tip = METRIC_INFO[metricKey]
    if (!tip) return null

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
                className="w-4 h-4 rounded-full bg-slate-700 hover:bg-[#D4AF37]/30 text-slate-400 hover:text-[#D4AF37] flex items-center justify-center text-[10px] font-bold transition-all cursor-help"
                aria-label="More info"
            >
                i
            </button>
            {show && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 text-xs text-slate-200 bg-slate-800 border border-slate-700 rounded-lg shadow-xl pointer-events-none">
                    {tip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800" />
                </div>
            )}
        </div>
    )
}

// --- Helpers ---
function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${m}m ${s.toString().padStart(2, '0')}s`
}

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`
}

function getChangePercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
}

function formatDate(dateStr: string): string {
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${month}/${day}`
}

const DATE_RANGES: { key: DateRangeKey; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: '7days', label: '7 Days' },
    { key: '30days', label: '30 Days' },
    { key: '90days', label: '90 Days' },
    { key: '12months', label: '12 Months' },
]

const GOLD = '#D4AF37'
const GOLD_LIGHT = 'rgba(212, 175, 55, 0.15)'
const CHART_COLORS = ['#D4AF37', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// --- Animated Counter ---
function AnimatedCount({ value }: { value: number }) {
    const [display, setDisplay] = useState(0)
    const ref = useRef<number>(0)

    useEffect(() => {
        const start = ref.current
        const diff = value - start
        const duration = 800
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(start + diff * eased))
            if (progress < 1) requestAnimationFrame(animate)
            else ref.current = value
        }
        requestAnimationFrame(animate)
    }, [value])

    return <>{display.toLocaleString()}</>
}

// --- Change Badge ---
function ChangeBadge({ current, previous }: { current: number; previous: number }) {
    const change = getChangePercent(current, previous)
    const isUp = change >= 0
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isUp ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </span>
    )
}

// --- Heatmap Cell ---
function getHeatColor(intensity: number): string {
    if (intensity === 0) return 'rgba(30, 41, 59, 0.5)' // slate-800/50
    if (intensity < 0.2) return 'rgba(34, 197, 94, 0.25)' // green
    if (intensity < 0.4) return 'rgba(34, 197, 94, 0.5)' // brighter green
    if (intensity < 0.6) return 'rgba(234, 179, 8, 0.55)' // yellow
    if (intensity < 0.8) return 'rgba(249, 115, 22, 0.65)' // orange
    return 'rgba(239, 68, 68, 0.75)' // red
}

function HeatmapCell({ value, max }: { value: number; max: number }) {
    const intensity = max > 0 ? value / max : 0
    const bgColor = getHeatColor(intensity)

    return (
        <div
            className="w-full aspect-square rounded-sm flex items-center justify-center transition-all hover:ring-1 hover:ring-white/40 cursor-default"
            style={{ backgroundColor: bgColor }}
            title={`${value} visitors`}
        >
            {value > 0 && <span className="text-[8px] font-bold text-white/80">{value}</span>}
        </div>
    )
}

// ========== MAIN COMPONENT ==========
export default function AnalyticsClient({
    initialOverview,
    initialTrend,
    initialPages,
    initialSources,
    initialGeo,
    initialDevices,
    initialRealtime,
    initialPeakHours,
    initialReferrals,
    initialLandingPages,
    initialEventPages,
}: {
    initialOverview: OverviewData | null
    initialTrend: TrendPoint[]
    initialPages: PageData[]
    initialSources: SourceData[]
    initialGeo: GeoData
    initialDevices: DeviceData
    initialRealtime: number
    initialPeakHours: number[][]
    initialReferrals: ReferralData[]
    initialLandingPages: LandingPageData[]
    initialEventPages: PageData[]
}) {
    const [range, setRange] = useState<DateRangeKey>('30days')
    const [isPending, startTransition] = useTransition()
    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [customStart, setCustomStart] = useState('')
    const [customEnd, setCustomEnd] = useState('')
    const [activeCustomRange, setActiveCustomRange] = useState<CustomDateRange | undefined>(undefined)

    const [overview, setOverview] = useState(initialOverview)
    const [trend, setTrend] = useState(initialTrend)
    const [pages, setPages] = useState(initialPages)
    const [sources, setSources] = useState(initialSources)
    const [geo, setGeo] = useState(initialGeo)
    const [devices, setDevices] = useState(initialDevices)
    const [realtime, setRealtime] = useState(initialRealtime)
    const [peakHours, setPeakHours] = useState(initialPeakHours)
    const [referrals, setReferrals] = useState(initialReferrals)
    const [landingPages, setLandingPages] = useState(initialLandingPages)
    const [eventPages, setEventPages] = useState(initialEventPages)

    // Refresh realtime every 30s
    useEffect(() => {
        const interval = setInterval(async () => {
            const count = await getRealtimeUsers()
            setRealtime(count)
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    // Fetch all data when range changes
    const fetchData = (newRange: DateRangeKey, custom?: CustomDateRange) => {
        setRange(newRange)
        setActiveCustomRange(custom)
        startTransition(async () => {
            const [o, t, p, s, g, d, ph, ref, lp, ep] = await Promise.all([
                getOverviewMetrics(newRange, custom),
                getVisitorTrend(newRange, custom),
                getTopPages(newRange, custom),
                getTrafficSources(newRange, custom),
                getGeography(newRange, custom),
                getDeviceBreakdown(newRange, custom),
                getPeakTrafficHours(newRange, custom),
                getReferralDetails(newRange, custom),
                getLandingPages(newRange, custom),
                getEventPagePerformance(newRange, custom),
            ])
            setOverview(o)
            setTrend(t)
            setPages(p)
            setSources(s)
            setGeo(g)
            setDevices(d)
            setPeakHours(ph)
            setReferrals(ref)
            setLandingPages(lp)
            setEventPages(ep)
        })
    }

    const handleRangeChange = (newRange: DateRangeKey) => {
        setShowCustomPicker(false)
        setActiveCustomRange(undefined)
        fetchData(newRange)
    }

    const handleCustomApply = () => {
        if (!customStart || !customEnd) return
        if (new Date(customStart) > new Date(customEnd)) return
        const custom: CustomDateRange = { startDate: customStart, endDate: customEnd }
        setShowCustomPicker(false)
        fetchData('custom', custom)
    }

    // Chart.js global defaults
    ChartJS.defaults.color = '#94a3b8'
    ChartJS.defaults.borderColor = 'rgba(255,255,255,0.05)'
    ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif'

    // --- Chart Data ---
    const trendData = {
        labels: trend.map(p => formatDate(p.date)),
        datasets: [
            {
                label: 'Visitors',
                data: trend.map(p => p.visitors),
                borderColor: GOLD,
                backgroundColor: GOLD_LIGHT,
                fill: true, tension: 0.4,
                pointRadius: trend.length > 60 ? 0 : 3,
                pointHoverRadius: 6, pointBackgroundColor: GOLD, borderWidth: 2,
            },
            {
                label: 'Sessions',
                data: trend.map(p => p.sessions),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true, tension: 0.4,
                pointRadius: trend.length > 60 ? 0 : 3,
                pointHoverRadius: 6, pointBackgroundColor: '#3B82F6', borderWidth: 2,
            },
        ],
    }

    const totalSourceSessions = sources.reduce((sum, s) => sum + s.sessions, 0)
    const sourceData = {
        labels: sources.map(s => s.channel),
        datasets: [{
            data: sources.map(s => s.sessions),
            backgroundColor: CHART_COLORS.slice(0, sources.length),
            borderWidth: 0, hoverOffset: 8,
        }],
    }

    const deviceData = {
        labels: devices.devices.map(d => d.device),
        datasets: [{
            data: devices.devices.map(d => d.users),
            backgroundColor: [GOLD, '#3B82F6', '#10B981'],
            borderWidth: 0, hoverOffset: 8,
        }],
    }

    const maxPageViews = pages.length > 0 ? pages[0].views : 1
    const maxEventViews = eventPages.length > 0 ? eventPages[0].views : 1
    const maxLandingSessions = landingPages.length > 0 ? landingPages[0].sessions : 1
    const heatmapMax = Math.max(...peakHours.flat())

    const customRangeLabel = activeCustomRange
        ? `${new Date(activeCustomRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(activeCustomRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : ''

    if (!overview) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Unable to load analytics. Check your GA4 credentials.</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8">

            {/* ===== HEADER + DATE PICKER ===== */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F7E7CE]">
                        Analytics
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Website performance powered by Google Analytics
                        {range === 'custom' && activeCustomRange && (
                            <span className="ml-2 text-[#D4AF37] font-medium">• {customRangeLabel}</span>
                        )}
                    </p>
                </div>
                <div className="relative flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                        {DATE_RANGES.map(r => (
                            <button key={r.key} onClick={() => handleRangeChange(r.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${range === r.key && range !== 'custom' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                                {r.label}
                            </button>
                        ))}
                        <button onClick={() => setShowCustomPicker(!showCustomPicker)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${range === 'custom' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            Custom
                        </button>
                        {isPending && <div className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin ml-1" />}
                    </div>
                    {showCustomPicker && (
                        <div className="absolute top-full right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl w-72">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Custom Date Range</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Start Date</label>
                                    <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                                        max={customEnd || new Date().toISOString().split('T')[0]}
                                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-[#D4AF37] outline-none [color-scheme:dark]" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">End Date</label>
                                    <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                                        min={customStart} max={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 focus:ring-2 focus:ring-[#D4AF37] outline-none [color-scheme:dark]" />
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button onClick={() => setShowCustomPicker(false)} className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                                    <button onClick={handleCustomApply} disabled={!customStart || !customEnd}
                                        className="flex-[2] py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Apply Range</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== KPI CARDS ===== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="relative rounded-xl border border-emerald-500/30 bg-emerald-900/10 backdrop-blur-xl p-5">
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <InfoTooltip metricKey="liveNow" />
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <p className="text-emerald-400/70 text-xs font-bold uppercase tracking-wider mb-1">Live Now</p>
                    <h3 className="text-3xl font-bold text-emerald-400"><AnimatedCount value={realtime} /></h3>
                    <p className="text-emerald-500/50 text-xs mt-1">Active users</p>
                </motion.div>

                {[
                    { label: 'Visitors', key: 'visitors', value: overview.visitors, prev: overview.prevVisitors, sub: 'Unique users' },
                    { label: 'Sessions', key: 'sessions', value: overview.sessions, prev: overview.prevSessions, sub: 'Total visits' },
                    { label: 'Pageviews', key: 'pageviews', value: overview.pageviews, prev: overview.prevPageviews, sub: 'Pages viewed' },
                ].map((m, i) => (
                    <motion.div key={m.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-5">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-1.5">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{m.label}</p>
                                <InfoTooltip metricKey={m.key} />
                            </div>
                            <ChangeBadge current={m.value} previous={m.prev} />
                        </div>
                        <h3 className="text-3xl font-bold text-white"><AnimatedCount value={m.value} /></h3>
                        <p className="text-slate-500 text-xs mt-1">{m.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ===== ENGAGEMENT MINI CARDS ===== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Bounce Rate', key: 'bounceRate', value: formatPercent(overview.bounceRate) },
                    { label: 'Avg Duration', key: 'avgDuration', value: formatDuration(overview.avgSessionDuration) },
                    { label: 'Pages / Session', key: 'pagesPerSession', value: overview.pagesPerSession.toFixed(1) },
                    { label: 'New Users', key: 'newUsers', value: overview.newUsers.toLocaleString() },
                ].map(m => (
                    <div key={m.key} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center relative">
                        <div className="absolute top-2 right-2"><InfoTooltip metricKey={m.key} /></div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{m.label}</p>
                        <p className="text-2xl font-bold text-white">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* ===== VISITOR TREND CHART ===== */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Visitor Trend</h3>
                <div className="h-[300px]">
                    <Line data={trendData} options={{
                        responsive: true, maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: {
                            legend: { position: 'top', labels: { usePointStyle: true, padding: 20, font: { size: 11, weight: 'bold' } } },
                            tooltip: { backgroundColor: '#0f172a', borderColor: GOLD, borderWidth: 1, titleFont: { weight: 'bold' }, padding: 12, cornerRadius: 8 },
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { maxTicksLimit: 12, font: { size: 10 } } },
                            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { font: { size: 10 } } },
                        },
                    }} />
                </div>
            </motion.div>

            {/* ===== PEAK TRAFFIC HOURS HEATMAP ===== */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-white">Peak Traffic Hours</h3>
                    <InfoTooltip metricKey="peakHours" />
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        {/* Hour labels */}
                        <div className="flex gap-[2px] mb-1 ml-10">
                            {Array.from({ length: 24 }, (_, h) => (
                                <div key={h} className="flex-1 text-center text-[9px] text-slate-500 font-mono">
                                    {h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
                                </div>
                            ))}
                        </div>
                        {/* Grid rows */}
                        {DAY_LABELS.map((day, dayIdx) => (
                            <div key={day} className="flex gap-[2px] items-center mb-[2px]">
                                <div className="w-10 text-xs text-slate-500 font-bold shrink-0">{day}</div>
                                {peakHours[dayIdx]?.map((val, hourIdx) => (
                                    <div key={hourIdx} className="flex-1">
                                        <HeatmapCell value={val} max={heatmapMax} />
                                    </div>
                                ))}
                            </div>
                        ))}
                        {/* Legend */}
                        <div className="flex items-center justify-end gap-2 mt-3">
                            <span className="text-[10px] text-slate-500">Less</span>
                            {[
                                'rgba(30, 41, 59, 0.5)',
                                'rgba(34, 197, 94, 0.25)',
                                'rgba(34, 197, 94, 0.5)',
                                'rgba(234, 179, 8, 0.55)',
                                'rgba(249, 115, 22, 0.65)',
                                'rgba(239, 68, 68, 0.75)',
                            ].map((color, i) => (
                                <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                            ))}
                            <span className="text-[10px] text-slate-500">More</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ===== TOP PAGES + TRAFFIC SOURCES ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">Top Pages</h3>
                        <InfoTooltip metricKey="topPages" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <th className="text-left py-3 pr-4">Page</th>
                                    <th className="text-right py-3 px-3">Views</th>
                                    <th className="text-right py-3 px-3">Users</th>
                                    <th className="text-right py-3 pl-3">Avg Time</th>
                                    <th className="py-3 pl-4 w-32"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 pr-4">
                                            <p className="text-white font-medium truncate max-w-[250px]" title={page.path}>
                                                {page.path === '/' ? 'Homepage' : page.path}
                                            </p>
                                        </td>
                                        <td className="text-right py-3 px-3 text-slate-300 font-mono">{page.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-3 text-slate-400 font-mono">{page.users.toLocaleString()}</td>
                                        <td className="text-right py-3 pl-3 text-slate-400">{formatDuration(page.avgDuration)}</td>
                                        <td className="py-3 pl-4">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" style={{ width: `${(page.views / maxPageViews) * 100}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">Traffic Sources</h3>
                        <InfoTooltip metricKey="trafficSources" />
                    </div>
                    <div className="h-[200px] flex items-center justify-center mb-4">
                        <Doughnut data={sourceData} options={{
                            responsive: true, maintainAspectRatio: false, cutout: '65%',
                            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', borderColor: GOLD, borderWidth: 1, padding: 10, cornerRadius: 8 } },
                        }} />
                    </div>
                    <div className="space-y-2">
                        {sources.map((s, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                                    <span className="text-slate-300">{s.channel}</span>
                                </div>
                                <span className="text-slate-400 font-mono text-xs">{totalSourceSessions > 0 ? ((s.sessions / totalSourceSessions) * 100).toFixed(1) : 0}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ===== REFERRAL DETAILS + LANDING PAGES ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Referral Details */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">Referral Details</h3>
                        <InfoTooltip metricKey="referrals" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <th className="text-left py-3 pr-3">Source</th>
                                    <th className="text-left py-3 px-3">Medium</th>
                                    <th className="text-right py-3 px-3">Sessions</th>
                                    <th className="text-right py-3 pl-3">Users</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map((r, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-2.5 pr-3">
                                            <span className="text-white font-medium">{r.source}</span>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.medium === 'organic' ? 'bg-emerald-500/20 text-emerald-400'
                                                : r.medium === 'referral' ? 'bg-blue-500/20 text-blue-400'
                                                    : r.medium === 'social' ? 'bg-purple-500/20 text-purple-400'
                                                        : r.medium === 'cpc' ? 'bg-orange-500/20 text-orange-400'
                                                            : 'bg-slate-700 text-slate-400'
                                                }`}>{r.medium}</span>
                                        </td>
                                        <td className="text-right py-2.5 px-3 text-slate-300 font-mono">{r.sessions}</td>
                                        <td className="text-right py-2.5 pl-3 text-slate-400 font-mono">{r.users}</td>
                                    </tr>
                                ))}
                                {referrals.length === 0 && (
                                    <tr><td colSpan={4} className="py-6 text-center text-slate-500">No referral data for this period</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Landing Pages */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">Landing Pages</h3>
                        <InfoTooltip metricKey="landingPages" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <th className="text-left py-3 pr-3">Entry Page</th>
                                    <th className="text-right py-3 px-3">Entries</th>
                                    <th className="text-right py-3 px-3">Bounce</th>
                                    <th className="py-3 pl-3 w-24"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {landingPages.map((lp, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-2.5 pr-3">
                                            <p className="text-white font-medium truncate max-w-[200px]" title={lp.page}>
                                                {lp.page === '/' ? 'Homepage' : lp.page}
                                            </p>
                                        </td>
                                        <td className="text-right py-2.5 px-3 text-slate-300 font-mono">{lp.sessions}</td>
                                        <td className="text-right py-2.5 px-3">
                                            <span className={`text-xs font-mono ${lp.bounceRate > 0.7 ? 'text-red-400' : lp.bounceRate > 0.4 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                {formatPercent(lp.bounceRate)}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pl-3">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${(lp.sessions / maxLandingSessions) * 100}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {landingPages.length === 0 && (
                                    <tr><td colSpan={4} className="py-6 text-center text-slate-500">No landing page data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* ===== EVENT PAGE PERFORMANCE ===== */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-white">Event Page Performance</h3>
                    <InfoTooltip metricKey="eventPages" />
                </div>
                {eventPages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <th className="text-left py-3 pr-4">Event Page</th>
                                    <th className="text-right py-3 px-3">Views</th>
                                    <th className="text-right py-3 px-3">Users</th>
                                    <th className="text-right py-3 pl-3">Avg Time</th>
                                    <th className="py-3 pl-4 w-32"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventPages.map((ep, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 pr-4">
                                            <p className="text-white font-medium truncate max-w-[300px]" title={ep.title || ep.path}>
                                                {ep.path === '/events' ? '/events (listing)' : ep.path}
                                            </p>
                                            {ep.title && ep.title !== ep.path && (
                                                <p className="text-slate-500 text-xs truncate max-w-[300px]">{ep.title}</p>
                                            )}
                                        </td>
                                        <td className="text-right py-3 px-3 text-slate-300 font-mono">{ep.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-3 text-slate-400 font-mono">{ep.users.toLocaleString()}</td>
                                        <td className="text-right py-3 pl-3 text-slate-400">{formatDuration(ep.avgDuration)}</td>
                                        <td className="py-3 pl-4">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" style={{ width: `${(ep.views / maxEventViews) * 100}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-500">No event page traffic for this period</div>
                )}
            </motion.div>

            {/* ===== DEVICES + GEOGRAPHY ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">Devices & Browsers</h3>
                        <InfoTooltip metricKey="devices" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 text-center">Device Type</p>
                            <div className="h-[160px]">
                                <Doughnut data={deviceData} options={{
                                    responsive: true, maintainAspectRatio: false, cutout: '60%',
                                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 10, weight: 'bold' } } } },
                                }} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 text-center">Top Browsers</p>
                            <div className="space-y-3">
                                {devices.browsers.map((b, i) => {
                                    const totalBrowserUsers = devices.browsers.reduce((sum, br) => sum + br.users, 0)
                                    const pct = totalBrowserUsers > 0 ? (b.users / totalBrowserUsers) * 100 : 0
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-300 font-medium">{b.browser}</span>
                                                <span className="text-slate-500">{pct.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">Traffic by Location</h3>
                        <InfoTooltip metricKey="geography" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Top Cities</p>
                            <div className="space-y-2">
                                {geo.cities.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#D4AF37] font-bold text-xs w-5">{i + 1}</span>
                                            <span className="text-slate-300 truncate max-w-[120px]">{c.city || '(not set)'}</span>
                                        </div>
                                        <span className="text-slate-500 font-mono text-xs">{c.users}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Top Countries</p>
                            <div className="space-y-2">
                                {geo.countries.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#D4AF37] font-bold text-xs w-5">{i + 1}</span>
                                            <span className="text-slate-300">{c.country || '(not set)'}</span>
                                        </div>
                                        <span className="text-slate-500 font-mono text-xs">{c.users}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
