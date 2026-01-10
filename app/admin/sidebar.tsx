'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from './login/actions'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname() // To highlight the active link

    // Helper to check if a link is active
    const isActive = (path: string) => pathname === path

    const menuItems = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/events', label: 'Events' },
        { href: '/admin/reservations', label: 'Reservations' },
        { href: '/admin/menu', label: 'Menu' },
        { href: '/admin/tables', label: 'Tables' },
        { href: '/admin/staff', label: 'Staff' },
        { href: '/admin/promos', label: 'Promos' },
        { href: '/admin/inbox', label: 'Inbox' },
        { href: '/admin/settings', label: 'Settings' },
        { href: '/admin/testimonials', label: 'Testimonials' },
        { href: '/admin/reviews', label: 'Reviews' },
        { href: '/admin/gallery', label: 'Gallery' },
    ]

    return (
        <>
            {/* MOBILE HEADER (Visible only on small screens) */}
            <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-20">
                <span className="font-bold text-lg">Reset HTX</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 focus:outline-none"
                >
                    {/* Hamburger Icon / X Icon */}
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
            </div>

            {/* SIDEBAR CONTAINER */}
            {/* On Mobile: It's hidden unless isOpen is true. On Desktop: It's always block. */}
            <aside className={`
        bg-slate-900 text-white 
        w-full md:w-64 
        min-h-screen // Full height on desktop
        flex-col 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'flex absolute top-14 left-0 z-10 h-screen' : 'hidden'} 
        md:flex md:static md:h-auto
      `}>

                {/* Logo (Desktop only) */}
                <div className="hidden md:block p-6 text-2xl font-bold border-b border-slate-800">
                    Reset HTX
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)} // Close menu when clicked (mobile)
                            className={`
                px-4 py-3 rounded-lg transition-colors flex items-center gap-3
                ${isActive(item.href) ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'hover:bg-slate-800 text-slate-300'}
              `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Profile / Logout (Optional placeholder) */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-bold">A</div>
                        <div className="text-sm">
                            <p className="font-medium">Admin User</p>
                            {/* Logout Button */}
                            <button
                                onClick={() => logout()} // This calls the server action
                                className="text-xs text-slate-400 hover:text-white transition-colors text-left w-full"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

            </aside>
        </>
    )
}