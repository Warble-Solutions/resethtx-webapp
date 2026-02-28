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
        { href: '/admin/sales', label: 'Sales Overview' }, // Updated label for clarity
        { href: '/admin/guests', label: 'Guest Lists' }, // New
        { href: '/admin/customers', label: 'Customers' },
        { href: '/admin/events', label: 'Events' },
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
            {/* MOBILE TOGGLE BUTTON (Floating) */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 right-4 z-50 p-3 bg-black/60 backdrop-blur-md text-[#D4AF37] border border-white/10 rounded-full shadow-lg hover:bg-black/80 transition-all"
                aria-label="Open menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            {/* MOBILE OVERLAY BACKDROP */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* SIDEBAR CONTAINER */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                bg-slate-950 border-r border-white/5
                w-64 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:flex flex-col h-full
            `}>

                {/* Logo (Desktop only) */}
                <div className="hidden md:block p-6 text-2xl font-bold font-heading text-[#D4AF37] border-b border-white/5">
                    Reset HTX
                </div>

                {/* Mobile Close Button (Inside Sidebar) */}
                <div className="md:hidden p-4 flex justify-end border-b border-white/5">
                    <button onClick={() => setIsOpen(false)} className="text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)} // Close menu when clicked (mobile)
                            className={`
                                px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium
                                ${isActive(item.href)
                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold font-heading">A</div>
                        <div className="text-sm overflow-hidden">
                            <p className="font-medium text-slate-200 truncate">Admin User</p>
                            <button
                                onClick={() => logout()}
                                className="text-xs text-slate-500 hover:text-[#D4AF37] transition-colors text-left w-full mt-0.5"
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