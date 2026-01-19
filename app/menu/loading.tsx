export default function Loading() {
    return (
        <div className="min-h-screen bg-black pt-32 px-4 md:px-8 max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-16 animate-pulse">
                <div className="h-16 w-3/4 md:w-1/2 bg-white/5 mx-auto rounded-lg mb-6"></div>
                <div className="h-8 w-48 bg-[#D4AF37]/20 mx-auto rounded"></div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 pb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-24 bg-white/5 rounded"></div>
                ))}
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden h-36 md:h-40 animate-pulse">
                        <div className="w-1/3 bg-white/5 h-full"></div>
                        <div className="w-2/3 p-5 flex flex-col justify-center gap-3">
                            <div className="h-6 w-3/4 bg-white/5 rounded"></div>
                            <div className="h-4 w-full bg-white/5 rounded"></div>
                            <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
