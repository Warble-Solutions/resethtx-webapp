'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useReservation } from '../context/ReservationContext'
import { useInquire } from '../context/InquireContext'

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'CALENDAR', href: '/events' },
  { name: 'MENU', href: '/menu' },
  { name: 'PRIVATE EVENTS', href: '/private-events' },
  { name: 'DRESS CODE', href: '/dress-code' },
  { name: 'ABOUT', href: '/about' },
  { name: 'GALLERY', href: '/gallery' },
  { name: 'CONTACT', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { openReservation } = useReservation()
  const { openInquiry } = useInquire()
  const pathname = usePathname()

  // Handle Scroll Transparency & State
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = Math.max(
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0,
        window.scrollY || 0
      )
      setScrolled(scrollY > 5)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
    }
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

  // Always solid on inner pages; on homepage, becomes 100% solid immediately upon scrolling (>5px) or menu open
  const isSolid = scrolled || isOpen || pathname !== '/'

  return (
    <>

      <nav
        style={{
          backgroundColor: isSolid ? '#050505' : 'transparent',
          backgroundImage: isSolid
            ? 'none'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          borderBottom: isSolid
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid transparent',
          boxShadow: isSolid ? '0 10px 30px rgba(0, 0, 0, 0.9)' : 'none',
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid ? 'navbar-solid py-3.5 sm:py-4' : 'navbar-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center relative z-50">

          {/* LOGO */}
          <Link href="/" className="relative h-16 sm:h-20 w-48 sm:w-60 transition-opacity duration-300 hover:opacity-80 shrink-0">
            <Image
              src="/logos/logo-main.png"
              alt="Reset HTX Logo"
              fill
              className="object-contain position-left"
              priority
              sizes="(max-width: 768px) 200px, 240px"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] xl:text-xs font-bold tracking-[0.18em] xl:tracking-[0.2em] relative py-2 transition-all duration-300 font-sans uppercase whitespace-nowrap
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
              onClick={() => openInquiry()}
              className="relative overflow-hidden bg-[#D4AF37] text-black font-bold text-[11px] xl:text-xs tracking-[0.2em] px-6 xl:px-8 py-3 uppercase transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 shrink-0"
            >
              <span className="relative z-10 font-sans">Venue Rental</span>
            </button>
          </div>

          {/* MOBILE / TABLET HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-50 text-white flex flex-col items-end gap-1.5 group w-10 h-10 justify-center focus:outline-none"
          >
            <div className={`h-0.5 bg-[#D4AF37] transition-all duration-300 origin-center ${isOpen ? 'w-6 rotate-45 translate-y-2 bg-white' : 'w-8 group-hover:bg-white'}`}></div>
            <div className={`h-0.5 bg-[#D4AF37] transition-all duration-300 origin-center ${isOpen ? 'w-6 -rotate-45 bg-white' : 'w-6 group-hover:w-8 group-hover:bg-white'}`}></div>
          </button>
        </div>
      </nav>

      {/* MOBILE / TABLET MENU OVERLAY */}
      <div
        style={{ backgroundColor: 'rgba(5, 5, 5, 0.98)' }}
        className={`fixed inset-0 z-40 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-500 lg:hidden h-dvh w-screen overflow-y-auto py-24
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        {/* Mobile Links */}
        <div className="flex flex-col items-center gap-5 sm:gap-6 w-full px-6 my-auto">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider transition-all duration-500 transform
                  ${pathname === link.href ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                `}
              style={{ transitionDelay: `${idx * 75}ms` }}
            >
              {link.name}
            </Link>
          ))}

          <div
            className={`mt-4 transition-all duration-500 delay-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <button
              onClick={() => {
                setIsOpen(false)
                openInquiry()
              }}
              className="bg-[#D4AF37] text-black font-bold text-xs sm:text-sm tracking-[0.2em] px-8 sm:px-10 py-3.5 sm:py-4 uppercase rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              Venue Rental
            </button>
          </div>
        </div>
      </div>

    </>
  )
}