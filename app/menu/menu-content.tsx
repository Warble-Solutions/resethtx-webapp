'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MenuItem {
    id: number
    name: string
    description: string | null
    price: string
    category: string
    subcategory?: string | null
    image_url: string | null
}

const SPIRIT_ORDER = ['Vodka', 'Tequila', 'Whiskey', 'Cognac', 'Scotch', 'Champagne', 'Package']

const CATEGORIES = [
    'Bar Bites',
    'Signatures',
    'Happy Hour',
    'Spirits & Bottles',
    'Hookah'
]

const formatPrice = (price: string | number) => {
    // If it's already got a $, leave it. If it's "MP", leave it.
    if (String(price).includes('$') || String(price).toLowerCase() === 'mp') return price;
    return `$${price}`;
};

export default function MenuContent({ items }: { items: MenuItem[] }) {
    // Default to first category: 'Bar Bites' (Kitchen)
    const [activeTab, setActiveTab] = useState(CATEGORIES[0])
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

    // Filter items based on the active tab
    const filteredItems = items.filter(item => item.category === activeTab)

    return (
        <div>
            {/* --- 1. LUXURY TABS NAVIGATION --- */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16 pb-4 border-b border-white/10">
                {CATEGORIES.map((cat) => {
                    const isSelected = activeTab === cat
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`
                                px-5 md:px-7 py-3 text-xs md:text-sm font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 relative cursor-pointer
                                ${isSelected 
                                    ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105' 
                                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                                }
                            `}
                        >
                            {cat === 'Bar Bites' ? 'Kitchen & Bites' : cat}
                        </button>
                    )
                })}
            </div>


            {/* --- 2. ITEMS CONTENT --- */}
            {activeTab === 'Spirits & Bottles' ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {(() => {
                        // Group items by subcategory
                        const grouped = filteredItems.reduce((acc, item) => {
                            const sub = item.subcategory || 'Other'
                            if (!acc[sub]) acc[sub] = []
                            acc[sub].push(item)
                            return acc
                        }, {} as Record<string, MenuItem[]>)

                        // Sort keys based on SPIRIT_ORDER
                        const sortedKeys = Object.keys(grouped).sort((a, b) => {
                            const indexA = SPIRIT_ORDER.indexOf(a)
                            const indexB = SPIRIT_ORDER.indexOf(b)
                            if (indexA !== -1 && indexB !== -1) return indexA - indexB
                            if (indexA !== -1) return -1
                            if (indexB !== -1) return 1
                            return a.localeCompare(b)
                        })

                        if (sortedKeys.length === 0) {
                            return (
                                <div className="text-center py-20 text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                                    Coming soon to {activeTab}.
                                </div>
                            )
                        }

                        return sortedKeys.map(subcat => (
                            <div key={subcat}>
                                <h3 className="text-xl text-[#D4AF37] mt-6 mb-4 font-bold uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4">
                                    {subcat}
                                </h3>
                                {(subcat === 'Package' || subcat === 'Packages') && (
                                    <p className="text-sm text-zinc-400 italic mb-6">
                                        Packages include 6 Aqua Panna & 6 Red Bull Cans
                                    </p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    {grouped[subcat].map(item => (
                                        <MenuItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                                    ))}
                                </div>
                            </div>
                        ))
                    })()}
                </div>
            ) : activeTab === 'Hookah' ? (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div key={item.id} className="flex flex-col justify-between py-4 border-b border-white/5 hover:bg-white/5 transition-colors duration-300 px-4 rounded-lg group">
                                    <div className="flex justify-between items-baseline gap-4 mb-2">
                                        <h3 className="font-heading font-bold text-[#D4AF37] text-xl leading-none tracking-wide group-hover:text-white transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex-grow border-b border-dotted border-white/20 mx-2 opacity-30"></div>
                                        <span className="font-heading font-bold text-white text-xl">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-slate-500 text-sm font-sans leading-relaxed">
                                            {item.description.startsWith('PREMIUM BLEND:') ? (
                                                <>
                                                    <span className="text-[#D4AF37] font-bold tracking-wider">PREMIUM BLEND:</span>
                                                    {item.description.replace('PREMIUM BLEND:', '')}
                                                </>
                                            ) : (
                                                item.description
                                            )}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                                Coming soon to {activeTab}.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeTab}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <MenuItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                            Coming soon to {activeTab}.
                        </div>
                    )}
                </div>
            )}



            {/* --- 3. PRIVATE DINING / RESERVATION BANNER --- */}
            <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#D4AF37]/30 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/10 blur-[90px] rounded-full pointer-events-none" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Group Dining & Celebrations</span>
                    <h3 className="font-heading text-3xl md:text-4xl font-bold uppercase text-white mt-2 mb-4">
                        Reserve Your Table Above The Skyline
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base font-sans leading-relaxed mb-8">
                        Whether it's an intimate date night, birthday dinner, or corporate mixer, reserve a dedicated rooftop table with personalized bottle and dining service.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/reservations"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            Reserve Table
                        </a>
                        <a
                            href="/private-events"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                        >
                            Private Buyouts
                        </a>
                    </div>
                </div>
            </div>

            {/* --- 4. POPUP MODAL --- */}
            {
                selectedItem && (
                    <div
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 border border-[#D4AF37]/50 max-w-lg w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25)] cursor-default relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                aria-label="Close modal"
                                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/70 border border-white/15 text-white rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                            >
                                ✕
                            </button>

                            {/* Modal Image */}
                            <div className="relative h-64 w-full bg-zinc-900 border-b border-white/10">
                                {selectedItem.image_url ? (
                                    <Image src={selectedItem.image_url} alt={selectedItem.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-sans text-sm">No Image Available</div>
                                )}
                            </div>

                            {/* Modal Content */}
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">{selectedItem.name}</h3>
                                    <span className="text-xl md:text-2xl text-[#D4AF37] font-bold font-heading">{formatPrice(selectedItem.price)}</span>
                                </div>

                                <div className="prose prose-invert prose-sm">
                                    <p className="text-zinc-300 leading-relaxed text-sm md:text-base font-sans">
                                        {selectedItem.description || "Ask your server for tasting notes and pairing suggestions."}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-xs uppercase text-[#D4AF37] font-bold tracking-[0.2em]">{selectedItem.category}</span>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="text-white hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                                    >
                                        Back to Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

function MenuItemCard({ item, onClick }: { item: MenuItem, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="flex bg-zinc-950/70 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer group hover:border-[#D4AF37]/60 transition-all duration-300 hover:-translate-y-1 h-36 md:h-40 shadow-md hover:shadow-[0_8px_25px_rgba(212,175,55,0.12)]"
        >
            {/* LEFT: Image (Fixed Width - Only if exists) */}
            {item.image_url && (
                <div className="w-1/3 relative h-full bg-zinc-900 border-r border-white/5 shrink-0 overflow-hidden">
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            )}

            {/* RIGHT: Name & Price */}
            <div className={`p-5 flex flex-col justify-center relative min-w-0 ${item.image_url ? 'w-2/3' : 'flex-1'}`}>
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-heading font-bold text-white text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors">
                        {item.name}
                    </h3>
                    <span className="text-[#D4AF37] font-bold text-base md:text-lg leading-tight whitespace-nowrap">
                        {formatPrice(item.price)}
                    </span>
                </div>

                {/* Description Preview */}
                <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-sans">
                    {item.description}
                </p>

                {/* "View" Label */}
                <span className="text-[10px] text-zinc-500 mt-auto uppercase tracking-wider font-bold group-hover:text-[#D4AF37] transition-colors pt-2">
                    Tasting Details →
                </span>
            </div>
        </div>
    )
}