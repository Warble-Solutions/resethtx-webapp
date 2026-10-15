'use client'

import Image from 'next/image'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-5">
                {/* Pulsing Reset Logo */}
                <div className="relative w-56 h-56 animate-pulse">
                    <Image
                        src="/logos/logo-main.png"
                        alt="Reset HTX"
                        fill
                        className="object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                        priority
                    />
                </div>
                {/* Subtle gold loading bar */}
                <div className="w-24 h-[2px] rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"
                        style={{
                            animation: 'shimmer 1.5s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    )
}
