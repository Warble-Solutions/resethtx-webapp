'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'EVENTS', href: '/events' },
  { name: 'MENU', href: '/menu' },
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
  { name: 'Gallery', href: '/gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-md border-white/10 py-4 shadow-2xl' 
          : 'bg-linear-to-b from-black/80 to-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="group relative z-10">
            <h1 className="font-heading text-4xl font-bold tracking-widest text-white transition-colors duration-300">
                RESET<span className="text-[#D4AF37] group-hover:text-white transition-colors duration-300">.</span>HTX
            </h1>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-xs font-bold tracking-[0.2em] relative py-2 transition-all duration-300 font-sans uppercase
                ${pathname === link.href ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'}
              `}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-px bg-[#D4AF37] transform transition-transform duration-300 origin-left 
                ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'}
              `} />
            </Link>
          ))}
          
          {/* CTA Button - Hardcoded Gold Hex to ensure visibility */}
          <Link 
            href="/reservations" 
            className="
              relative overflow-hidden 
              bg-[#D4AF37] text-black 
              font-bold text-xs tracking-[0.2em] 
              px-8 py-3 
              uppercase 
              transition-all duration-300 
              hover:bg-white 
              hover:text-black 
              hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]
              hover:scale-105
            "
          >
            <span className="relative z-10 font-sans">Book Now</span>
          </Link>
        </div>

        {/* MOBILE MENU */}
        <button className="md:hidden text-white flex flex-col items-end gap-1.5 group">
            <div className="w-8 h-0.5 bg-[#D4AF37] group-hover:bg-white transition-colors"></div>
            <div className="w-6 h-0.5 bg-[#D4AF37] group-hover:bg-white transition-colors group-hover:w-8"></div>
        </button>
      </div>
    </nav>
  )
}