'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useReservation } from '../context/ReservationContext'

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'CALENDAR', href: '/events' },
  { name: 'PRIVATE EVENTS', href: '/private-events' },
  { name: 'MENU', href: '/menu' },
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
  { name: 'GALLERY', href: '/gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { openReservation } = useReservation()
  const pathname = usePathname()

  // Handle Scroll Transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (pathname.startsWith('/admin')) return null

  return (
    <>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || isOpen
          ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl'
          : 'bg-linear-to-b from-black/80 to-transparent border-b-0 border-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-50">

          {/* LOGO */}
          <Link href="/" className="relative h-20 w-64 transition-opacity duration-300 hover:opacity-80">
            <Image
              src="/logos/logo-main.png"
              alt="Reset HTX Logo"
              fill
              className="object-contain position-left"
              priority
              sizes="(max-width: 768px) 200px, 300px"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-bold tracking-[0.2em] relative py-2 transition-all duration-300 font-sans uppercase whitespace-nowrap
                  ${pathname === link.href ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'}
                `}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[#D4AF37] transform transition-transform duration-300 origin-left 
                  ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'}
                `} />
              </Link>
            ))}

            <button
              onClick={() => openReservation()}
              className="relative overflow-hidden bg-[#D4AF37] text-black font-bold text-xs tracking-[0.2em] px-8 py-3 uppercase transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105"
            >
              <span className="relative z-10 font-sans">Celebrate With Us</span>
            </button>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 text-white flex flex-col items-end gap-1.5 group w-10 h-10 justify-center focus:outline-none"
          >
            <div className={`h-0.5 bg-[#D4AF37] transition-all duration-300 origin-center ${isOpen ? 'w-6 rotate-45 translate-y-2 bg-white' : 'w-8 group-hover:bg-white'}`}></div>
            <div className={`h-0.5 bg-[#D4AF37] transition-all duration-300 origin-center ${isOpen ? 'w-6 -rotate-45 bg-white' : 'w-6 group-hover:w-8 group-hover:bg-white'}`}></div>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY (Fixed outside relative container) */}
      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 md:hidden h-dvh w-screen
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        {/* Mobile Links */}
        <div className="flex flex-col items-center gap-8 w-full px-6">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`font-heading text-3xl font-bold uppercase text-white hover:text-[#D4AF37] transition-all duration-500 transform
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                `}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}

          <div
            className={`mt-8 transition-all duration-500 delay-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <button
              onClick={() => {
                setIsOpen(false)
                openReservation()
              }}
              className="bg-[#D4AF37] text-black font-bold text-sm tracking-[0.2em] px-10 py-4 uppercase rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Celebrate With Us
            </button>
          </div>
        </div>
      </div>

    </>
  )
}