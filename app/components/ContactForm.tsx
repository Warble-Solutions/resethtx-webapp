'use client'

import { useState, useEffect, useRef } from 'react'
import { submitContactForm } from '@/app/actions/contact'

export default function ContactForm({ className = "", onSuccess }: { className?: string, onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const isMounted = useRef(true)

    useEffect(() => {
        return () => { isMounted.current = false }
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const form = event.currentTarget
        const formData = new FormData(form)

        const result = await submitContactForm(formData)

        if (!isMounted.current) return

        setLoading(false)
        if (result.success) {
            setSuccess(true)
            form.reset()
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess()
                    setSuccess(false) // Reset success state for next open
                }, 2000) // Wait 2s to show success message then close
            }
        } else {
            alert(result.error)
        }
    }

    return (
        <div className={`bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl relative overflow-hidden ${className}`}>
            {success ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10 p-10 text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400">Thank you for reaching out. We will get back to you shortly.</p>
                    {/* Only show button if NOT auto-closing (e.g. on contact page) */}
                    {!onSuccess && (
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-8 text-[#C59D24] hover:text-white font-bold uppercase text-sm tracking-widest"
                        >
                            Send Another Message
                        </button>
                    )}
                </div>
            ) : null}

            <h3 className="font-heading text-2xl font-bold text-white mb-6">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">First Name</label>
                        <input name="firstName" required type="text" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#C59D24] outline-none transition-colors" placeholder="John" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Last Name</label>
                        <input name="lastName" required type="text" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#C59D24] outline-none transition-colors" placeholder="Doe" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Email Address</label>
                    <input name="email" required type="email" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#C59D24] outline-none transition-colors" placeholder="john@example.com" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Inquiry Type</label>
                    <select name="inquiryType" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#C59D24] outline-none transition-colors">
                        <option>General Inquiry</option>
                        <option>VIP Table Reservation</option>
                        <option>Private Event</option>
                        <option>Press / Media</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Message</label>
                    <textarea name="message" required rows={4} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#C59D24] outline-none transition-colors" placeholder="How can we help you?"></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C59D24] hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    )
}
