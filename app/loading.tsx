export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                {/* Pulsing Logo Text or similar */}
                <div className="text-[#D4AF37] font-bold tracking-[0.3em] text-sm uppercase animate-pulse">
                    Loading...
                </div>
            </div>
        </div>
    )
}
