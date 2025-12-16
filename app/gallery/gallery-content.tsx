'use client'

import { useState } from 'react'
import Image from 'next/image'

// Updated with your actual file names
const galleryImages = [
  // ROW 1: The Vibe & Atmosphere
  { id: 1, src: '/images/event-1.jpg', alt: 'Friday Night Energy', category: 'Vibe', width: 'w-full', height: 'h-80' },
  { id: 2, src: '/images/event-3.png', alt: 'Main Bar Lounge', category: 'Interior', width: 'w-full', height: 'h-64' },
  { id: 3, src: '/images/event-2.png', alt: 'Rhythm & Lights', category: 'Vibe', width: 'w-full', height: 'h-72' },
  
  // ROW 2: Signature Cocktails
  { id: 4, src: '/images/8.png', alt: 'The Signature Cosmo', category: 'Drinks', width: 'w-full', height: 'h-64' },
  { id: 5, src: '/images/9.png', alt: 'Smoked Old Fashioned', category: 'Drinks', width: 'w-full', height: 'h-64' },
  { id: 6, src: '/images/event-6.png', alt: 'Celebration Toast', category: 'Service', width: 'w-full', height: 'h-80' },

  // ROW 3: The View & Space
  { id: 7, src: '/images/16.png', alt: 'Rooftop Terrace', category: 'Exterior', width: 'w-full', height: 'h-64' },
  { id: 8, src: '/images/event-9.png', alt: 'Skyline View', category: 'Exterior', width: 'w-full', height: 'h-64' },
  { id: 9, src: '/images/11.png', alt: 'Craft Mixology', category: 'Drinks', width: 'w-full', height: 'h-96' },

  // ROW 4: Details
  { id: 10, src: '/images/event-5.png', alt: 'Art in Motion', category: 'Art', width: 'w-full', height: 'h-64' },
  { id: 11, src: '/images/14.png', alt: 'Daytime Lounge', category: 'Interior', width: 'w-full', height: 'h-64' },
  { id: 12, src: '/images/event-7.png', alt: 'Table Service', category: 'Service', width: 'w-full', height: 'h-80' },
]

export default function GalleryContent() {
  const [layout, setLayout] = useState<'grid' | 'masonry'>('masonry')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-6">
      
      {/* 1. CONTROLS & TOGGLE */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
        <div>
           <h2 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs mb-2">Visual Archive</h2>
           <p className="font-sans text-slate-400 max-w-lg">
             A collection of moments defining the Reset HTX experience.
           </p>
        </div>

        {/* The Toggle */}
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10 mt-6 md:mt-0">
            <button
                onClick={() => setLayout('masonry')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${layout === 'masonry' ? 'bg-[#C59D24] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3z"/><path d="M14 3h7v13h-7z"/><path d="M14 21h7v-1h-7z"/><path d="M3 21h7v-7H3z"/></svg>
                Masonry
            </button>
            <button
                onClick={() => setLayout('grid')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${layout === 'grid' ? 'bg-[#C59D24] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Grid
            </button>
        </div>
      </div>

      {/* 2. GALLERY LAYOUTS */}
      
      {/* VIEW A: MASONRY (Columns) */}
      {layout === 'masonry' && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 animate-in fade-in duration-700">
            {galleryImages.map((img) => (
                <div 
                    key={img.id} 
                    onClick={() => setSelectedImage(img)}
                    className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden border border-white/5 hover:border-[#C59D24]/50 transition-all"
                >
                    {/* Image Container with Dynamic Height */}
                    <div className={`relative w-full ${img.height}`}>
                        <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-[#C59D24] border border-[#C59D24] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">View</span>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* VIEW B: GRID (Uniform Squares) */}
      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            {galleryImages.map((img) => (
                <div 
                    key={img.id} 
                    onClick={() => setSelectedImage(img)}
                    className="relative aspect-square group cursor-pointer rounded-xl overflow-hidden border border-white/5 hover:border-[#C59D24]/50 transition-all"
                >
                    <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                         <span className="text-[#C59D24] text-xs font-bold uppercase tracking-widest mb-2">{img.category}</span>
                         <h3 className="text-white font-heading text-xl">{img.alt}</h3>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* 3. LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
        >
            <button className="absolute top-6 right-6 text-white hover:text-[#C59D24] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative w-full max-w-5xl h-[80vh]"
            >
                <Image 
                    src={selectedImage.src} 
                    alt={selectedImage.alt} 
                    fill 
                    className="object-contain" 
                />
                <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                    <h3 className="text-white font-heading text-2xl">{selectedImage.alt}</h3>
                    <p className="text-[#C59D24] text-xs uppercase tracking-widest">{selectedImage.category}</p>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}