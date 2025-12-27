'use client'

import { useState, useEffect } from 'react'
import { adminGetReviews, updateReviewStatus } from '@/app/actions/testimonials'
import { createClient } from '@/utils/supabase/client'

interface Testimonial {
    id: string
    author_name: string
    quote: string
    rating: number
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')

    useEffect(() => {
        loadReviews()
    }, [])

    const loadReviews = async () => {
        setLoading(true)
        try {
            const data = await adminGetReviews()
            setReviews(data as unknown as Testimonial[])
        } catch (error) {
            console.error(error)
            alert('Failed to load reviews')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic update
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))

        const res = await updateReviewStatus(id, status)
        if (!res.success) {
            alert('Failed to update status')
            loadReviews() // Revert/Reload on error
        }
    }

    const pendingReviews = reviews.filter(r => r.status === 'pending' || !r.status) // Handle default null/legacy
    // Actually, our migration sets default 'pending' but legacy rows might have issues if migration wasn't run perfectly. We assume robust migration.
    // Let's being strict:
    const pendingList = reviews.filter(r => r.status === 'pending')
    const allList = reviews

    const displayedReviews = activeTab === 'pending' ? pendingList : allList

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-white">Review Manager</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => loadReviews()}
                        className="text-slate-400 hover:text-white text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-700 mb-8">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'pending' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-500 hover:text-white'}`}
                >
                    Pending ({pendingList.length})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'all' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-500 hover:text-white'}`}
                >
                    All Reviews ({allList.length})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">Loading reviews...</div>
            ) : displayedReviews.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                    No {activeTab} reviews found.
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedReviews.map((review) => (
                        <div key={review.id} className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-white font-bold text-lg">{review.author_name}</h3>
                                    <div className="flex text-[#D4AF37] text-sm">
                                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ml-auto md:ml-2
                                        ${review.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            review.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'}
                                    `}>
                                        {review.status}
                                    </span>
                                </div>
                                <p className="text-slate-300 italic mb-4">"{review.quote}"</p>
                                <p className="text-xs text-slate-500 font-mono">{new Date(review.created_at).toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-3 md:border-l md:border-slate-700 md:pl-6">
                                {review.status !== 'approved' && (
                                    <button
                                        onClick={() => handleStatusUpdate(review.id, 'approved')}
                                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                    >
                                        Approve
                                    </button>
                                )}
                                {review.status !== 'rejected' && (
                                    <button
                                        onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                        className="bg-red-900/50 hover:bg-red-900 text-red-200 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-900"
                                    >
                                        Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
