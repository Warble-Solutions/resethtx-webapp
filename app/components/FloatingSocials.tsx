import React from 'react'
import SocialIcons from './SocialIcons'

export default function FloatingSocials() {
    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6 p-2 pl-3 bg-black/50 backdrop-blur-md rounded-l-xl border-l border-t border-b border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <SocialIcons className="flex-col gap-4" />
        </div>
    )
}
