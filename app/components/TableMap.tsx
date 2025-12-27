'use client'

import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs'

interface Table {
    id: string
    name: string
    capacity: number
    price: number
    category: string
    isBooked?: boolean
    x?: number
    y?: number
}

interface TableMapProps {
    tables: Table[]
    selectedTableId?: string
    onSelectTable: (table: Table) => void
}

const CATEGORIES = ['All', 'Lounge', 'Dance Floor', 'Dj Booth', 'Patio', 'Table Top']

export default function TableMap({ tables, selectedTableId, onSelectTable }: TableMapProps) {
    const [activeCategory, setActiveCategory] = useState('All')

    // Filter tables logic
    const isVisible = (table: Table) => {
        if (activeCategory === 'All') return true
        // Allow partial matches or exact matches (DB category format might vary)
        return table.category?.toLowerCase() === activeCategory.toLowerCase() ||
            (table.category?.toLowerCase().includes(activeCategory.toLowerCase()))
    }

    const getAbbreviatedName = (name: string) => {
        // Examples: "Patio 1" -> "P-1", "Table Top 3" -> "T-3", "Inside 5" -> "I-5"
        // Or "Lounge 12" -> "L-12"
        if (!name) return ''
        const parts = name.split(' ')
        if (parts.length >= 2) {
            // First letter of first word + - + number
            return `${parts[0].charAt(0).toUpperCase()}-${parts[parts.length - 1]}`
        }
        return name
    }

    // Animation Ref to trigger entrance? Or handled by parent.
    // We can animate category switches
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Simple flicker effect on category change
        if (containerRef.current) {
            anime({
                targets: containerRef.current.querySelectorAll('.table-node'),
                scale: [0.9, 1],
                duration: 300,
                easing: 'easeOutQuad'
            })
        }
    }, [activeCategory])

    return (
        <div className="w-full">
            {/* --- CATEGORY TABS --- */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
                            px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border
                            ${activeCategory === cat
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'bg-transparent text-slate-400 border-white/10 hover:border-[#D4AF37] hover:text-white'
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* --- MAP CONTAINER --- */}
            <div ref={containerRef} className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl group">

                {/* Background Grid/Decor */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Render Tables */}
                {tables.map((table) => {
                    // Normalize opacity for filtering
                    // If not active category, fade out to 0.2
                    const isActive = isVisible(table)
                    const opacityClass = isActive ? 'opacity-100 z-10' : 'opacity-20 grayscale z-0 pointer-events-none'

                    // Position
                    // Provide defaults if DB missing X/Y
                    const left = table.x ? `${table.x}%` : '50%'
                    const top = table.y ? `${table.y}%` : '50%'

                    const isSelected = selectedTableId === table.id

                    return (
                        <div
                            key={table.id}
                            onClick={() => !table.isBooked && onSelectTable(table)}
                            className={`
                                table-node absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500
                                ${opacityClass}
                                ${table.isBooked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110 hover:z-20'}
                            `}
                            style={{ left, top }}
                        >
                            {/* Visual Node (Ring) */}
                            <div className={`
                                w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-colors relative
                                ${table.isBooked
                                    ? 'bg-red-900/20 border-red-900/50 text-red-700'
                                    : isSelected
                                        ? 'bg-[#D4AF37] border-white text-black shadow-[0_0_20px_#D4AF37]'
                                        : 'bg-black/80 border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                }
                            `}>
                                <span className="font-heading font-bold text-[8px] md:text-[10px] leading-none">
                                    {getAbbreviatedName(table.name)}
                                </span>

                                {/* TOOLTIP */}
                                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max bg-black/90 border border-white/20 px-3 py-2 rounded text-center opacity-0 group-hover:opacity-0 hover:!opacity-100 pointer-events-none transition-opacity z-50 shadow-xl backdrop-blur-md">
                                    <div className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                        {table.category} • {table.name}
                                    </div>
                                    <div className="text-white text-xs font-bold">
                                        {table.capacity} Guests • ${table.price}
                                    </div>
                                    {table.isBooked && <div className="text-red-500 text-[10px] uppercase font-bold mt-1">Booked</div>}

                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90" />
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Legend Overlay at bottom right */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm border border-white/10 p-2 rounded text-[10px] text-slate-400 flex flex-col gap-1 pointer-events-none">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-black border border-[#D4AF37]"></span> Available</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span> Selected</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-900/50 border border-red-800"></span> Booked</div>
                </div>

            </div>
        </div>
    )
}
