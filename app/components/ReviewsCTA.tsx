'use client'

interface ReviewsCTAProps {
    onOpenReview: () => void
}

export default function ReviewsCTA({ onOpenReview }: ReviewsCTAProps) {
    return (
        <section className="py-16 bg-zinc-900 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
                    Did you enjoy your time at <span className="text-[#D4AF37]">Reset?</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Your feedback helps us curate the perfect nightlife experience. Let us know how we did.
                </p>
                <button
                    onClick={onOpenReview}
                    className="inline-flex items-center justify-center border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold py-3 px-8 rounded-full uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                    Leave a Review
                </button>
            </div>
        </section>
    )
}
