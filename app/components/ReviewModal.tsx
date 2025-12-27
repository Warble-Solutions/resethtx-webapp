'use client'

import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { submitReview } from '@/app/actions/testimonials'

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [name, setName] = useState('')
    const [review, setReview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            alert('Please select a rating')
            return
        }

        setIsSubmitting(true)

        // Assuming a server action exists, otherwise we'd just log it for now as per instructions
        // "Function: On submit, just log the data for now (or call a server action if we have one) and close the modal."
        // I'll try to use the likely existing action, or mock it if fails.
        // Looking at imports, I'll use a placeholder action or just log for now if I don't see one.
        // Actually, previous logs showed `app/actions/testimonials.ts` might verify existence.
        // For now, I will implement the logic to call an action if imported, else log.
        // I will stick to logging first to ensure UI works, then we can wire up the backend.

        console.log({ name, rating, review })

        // Simulate net delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsSubmitting(false)
        onClose()
        setRating(0)
        setName('')
        setReview('')
        alert('Thank you for your feedback!')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-zinc-950 border border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <h2 className="font-heading text-2xl md:text-3xl text-[#D4AF37] mb-2">Share Your Experience</h2>
                    <p className="text-slate-400 text-sm mb-8">We value your feedback. Tell us about your night.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110 duration-200"
                                >
                                    <Star
                                        size={32}
                                        fill={(hoverRating || rating) >= star ? '#D4AF37' : 'transparent'}
                                        className={(hoverRating || rating) >= star ? 'text-[#D4AF37]' : 'text-zinc-700'}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Inputs */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[#D4AF37] rounded-lg p-3 text-white outline-none transition-colors"
                            />

                            <textarea
                                placeholder="Tell us about your night..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                required
                                rows={4}
                                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[#D4AF37] rounded-lg p-3 text-white outline-none transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#D4AF37] hover:bg-[#F0DEAA] text-black font-bold py-3 rounded-lg uppercase tracking-wider transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
