'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

// --- 1. SPOTLIGHT CARD COMPONENT ---
// This creates the glow effect that follows your mouse
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const divRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                "relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 shadow-2xl",
                className
            )}
        >
            {/* The Glow Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    opacity: isFocused ? 1 : 0,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
                }}
            />
            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}

// --- 2. MAIN DASHBOARD UI ---
export default function DashboardClient({
    stats,
    tables,
    nextEvent
}: {
    stats: any,
    tables: any[],
    nextEvent: any
}) {

    // Calculate table stats
    const occupied = tables.filter(t => t.status === 'Occupied').length
    const reserved = tables.filter(t => t.status === 'Reserved').length
    const available = tables.filter(t => t.status === 'Available').length
    const capacity = tables.reduce((sum, t) => sum + t.seats, 0)

    // Stagger animation for the container
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600"
                >
                    Mission Control
                </motion.h1>
                <p className="text-slate-400 mt-2">Live overview of Reset HTX operations.</p>
            </div>

            {/* TOP STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SpotlightCard className="group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-medium mb-1">Total Events</p>
                            <h3 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {stats.eventsCount}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:animate-pulse">📅</div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </SpotlightCard>

                <SpotlightCard className="group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-medium mb-1">Menu Items</p>
                            <h3 className="text-4xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                {stats.menuCount}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:animate-pulse">🍔</div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "50%" }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="h-full bg-purple-500"
                        />
                    </div>
                </SpotlightCard>

                <SpotlightCard className="group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-medium mb-1">Team Members</p>
                            <h3 className="text-4xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                {stats.staffCount}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:animate-pulse">👥</div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "80%" }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="h-full bg-emerald-500"
                        />
                    </div>
                </SpotlightCard>
            </div>

            {/* BOTTOM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* NEXT EVENT - Big Card */}
                <SpotlightCard className="flex flex-col h-full border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                        <h3 className="text-xl font-bold text-white">Next Event</h3>
                        <Link href="/admin/events" className="text-xs text-purple-400 hover:text-purple-300 uppercase tracking-widest font-bold">View All →</Link>
                    </div>

                    {nextEvent ? (
                        <div className="flex-1 flex gap-6 flex-col sm:flex-row">
                            {nextEvent.image_url && (
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className="w-full sm:w-1/3 h-40 rounded-lg overflow-hidden border border-slate-700 shadow-lg"
                                >
                                    <img src={nextEvent.image_url} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                </motion.div>
                            )}
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-3 border border-purple-500/30">
                                    UPCOMING
                                </span>
                                <h2 className="text-2xl font-bold text-white mb-2">{nextEvent.title}</h2>
                                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                    {nextEvent.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                                    🗓️ {new Date(nextEvent.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <p>No upcoming events.</p>
                        </div>
                    )}
                </SpotlightCard>

                {/* FLOOR STATUS */}
                <SpotlightCard className="h-full border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                        <h3 className="text-xl font-bold text-white">Live Floor</h3>
                        <Link href="/admin/tables" className="text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold">Manage Tables →</Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-center">
                            <span className="block text-4xl font-bold text-red-500 drop-shadow-lg">{occupied}</span>
                            <span className="text-xs font-bold text-red-300/70 uppercase tracking-widest">Occupied</span>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl text-center">
                            <span className="block text-4xl font-bold text-yellow-500 drop-shadow-lg">{reserved}</span>
                            <span className="text-xs font-bold text-yellow-300/70 uppercase tracking-widest">Reserved</span>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="col-span-2 bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between px-8">
                            <div className="text-left">
                                <span className="block text-4xl font-bold text-emerald-500 drop-shadow-lg">{available}</span>
                                <span className="text-xs font-bold text-emerald-300/70 uppercase tracking-widest">Tables Available</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl animate-pulse">
                                🟢
                            </div>
                        </motion.div>

                        <div className="col-span-2 text-center pt-2">
                            <p className="text-xs text-slate-500 font-mono">TOTAL CAPACITY: {capacity} SEATS</p>
                        </div>
                    </div>
                </SpotlightCard>
            </div>
        </motion.div>
    )
}