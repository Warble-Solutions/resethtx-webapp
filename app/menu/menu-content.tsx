'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MenuItem {
  id: number
  name: string
  description: string | null
  price: string
  category: string
  image_url: string | null
}

const CATEGORIES = [
  'Signatures', 
  'Happy Hour', 
  'Spirits & Bottles', 
  'Exotic & Daily', 
  'Bar Bites'
]

export default function MenuContent({ items }: { items: MenuItem[] }) {
  // Default to first category
  const [activeTab, setActiveTab] = useState(CATEGORIES[0])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  // Filter items based on the active tab
  const filteredItems = items.filter(item => item.category === activeTab)

  return (
    <div>
      {/* --- 1. TABS NAVIGATION --- */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-white/10 pb-1">
        {CATEGORIES.map((cat) => (
            <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`
                    px-4 md:px-6 py-3 text-sm md:text-base font-bold uppercase tracking-widest transition-all relative
                    ${activeTab === cat ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-white'}
                `}
            >
                {cat}
                {/* Gold Underline for active tab */}
                {activeTab === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                )}
            </button>
        ))}
      </div>

      {/* --- 2. ITEMS GRID (2 Items Per Row) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 key={activeTab}">
        {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="flex bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden cursor-pointer group hover:border-[#D4AF37]/50 transition-all hover:-translate-y-1 h-36 md:h-40"
                >
                    {/* LEFT: Image (Fixed Width) */}
                    <div className="w-1/3 relative h-full bg-slate-900 border-r border-white/5">
                        {item.image_url ? (
                            <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700 text-[10px] uppercase font-bold tracking-widest">
                                Reset HTX
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Name & Price */}
                    <div className="w-2/3 p-5 flex flex-col justify-center relative">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-heading font-bold text-white text-lg leading-tight group-hover:text-[#D4AF37] transition-colors">
                                {item.name}
                            </h3>
                            <span className="text-[#D4AF37] font-bold text-lg leading-tight whitespace-nowrap">
                                {item.price}
                            </span>
                        </div>
                        
                        {/* Tiny Description Preview */}
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                        
                        {/* "View" Label */}
                        <span className="text-[10px] text-white/30 mt-auto uppercase tracking-wider font-bold group-hover:text-white transition-colors pt-2">
                            View Details →
                        </span>
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full text-center py-20 text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                Coming soon to {activeTab}.
            </div>
        )}
      </div>

      {/* --- 3. POPUP MODAL --- */}
      {selectedItem && (
        <div 
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-[#D4AF37] max-w-lg w-full rounded-xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)] cursor-default relative"
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedItem(null)} 
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                    ✕
                </button>

                {/* Modal Image */}
                <div className="relative h-64 w-full bg-slate-900 border-b border-white/10">
                    {selectedItem.image_url ? (
                        <Image src={selectedItem.image_url} alt={selectedItem.name} fill className="object-cover" />
                    ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-600">No Image Available</div>
                    )}
                </div>
                
                {/* Modal Content */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-heading text-3xl font-bold text-white">{selectedItem.name}</h3>
                        <span className="text-2xl text-[#D4AF37] font-bold font-heading">{selectedItem.price}</span>
                    </div>
                    
                    <div className="prose prose-invert prose-sm">
                        <p className="text-slate-300 leading-relaxed text-base">
                            {selectedItem.description || "Ask your server for details about this item."}
                        </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs uppercase text-slate-500 font-bold tracking-widest">{selectedItem.category}</span>
                        <button 
                            onClick={() => setSelectedItem(null)} 
                            className="text-white hover:text-[#D4AF37] text-sm font-bold uppercase tracking-wide"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}