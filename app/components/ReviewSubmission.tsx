'use client'

import { useState } from 'react'
import { submitReview } from '@/app/actions/testimonials'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReviewSubmission() {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [rating, setRating] = useState(5)
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        const res = await submitReview({ name, rating, message })

        if (res.success) {
            setStatus('success')
            setName('')
            setMessage('')
            setRating(5)
        } else {
            setStatus('error')
            setErrorMessage(res.error || 'Something went wrong')
        }
    }

    return (
        <section className="py-16 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto px-6 relative z-10 text-center">
                <h2 className="font-display text-3xl md:text-4xl text-white mb-2">Had a great night?</h2>
                <p className="text-slate-400 mb-8 font-sans">Tell us about it.</p>

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-500/10 border border-green-500/20 text-green-200 p-6 rounded-xl"
                        >
                            <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                            <p>Your review has been submitted for moderation.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-4 text-sm text-green-400 hover:text-white underline"
                            >
                                Submit another review
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left shadow-2xl backdrop-blur-sm"
                        >
                            {/* Stars */}
                            <div className="flex justify-center mb-6 gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-transform hover:scale-125 focus:outline-none ${star <= rating ? 'text-[#D4AF37]' : 'text-slate-600'}`}
                                        title={`${star} Stars`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs uppercase tracking-wider text-slate-500 mb-1 font-bold">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-xs uppercase tracking-wider text-slate-500 mb-1 font-bold">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                        placeholder="How was your experience?"
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <p className="text-red-400 text-sm mt-4 text-center">{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full mt-8 bg-[#D4AF37] hover:bg-white text-black font-bold py-4 rounded-lg transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
