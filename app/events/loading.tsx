export default function Loading() {
    return (
        <div className="min-h-screen bg-black pt-32 px-6 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-16 animate-pulse">
                <div className="h-20 w-3/4 md:w-1/2 bg-white/5 mx-auto rounded-lg mb-6"></div>
                <div className="h-6 w-96 bg-white/5 mx-auto rounded"></div>
            </div>

            {/* Content Skeleton */}
            <div className="animate-pulse">
                <div className="flex justify-between items-center mb-12 gap-6">
                    <div className="h-10 w-48 bg-white/5 rounded"></div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 w-24 bg-white/5 rounded"></div>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid Skeleton */}
                <div className="grid grid-cols-7 border border-white/5 bg-[#0a0a0a] min-h-[600px]">
                    {/* Header Row */}
                    {[...Array(7)].map((_, i) => (
                        <div key={`head-${i}`} className="h-12 border-b border-r border-white/5 bg-white/5"></div>
                    ))}
                    {/* Calendar Cells */}
                    {[...Array(35)].map((_, i) => (
                        <div key={`cell-${i}`} className="min-h-[120px] border-b border-r border-white/5 bg-black/20"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
