import React from 'react'
import { Instagram, Facebook } from 'lucide-react'

interface SocialIconsProps {
    className?: string
}

export default function SocialIcons({ className = '' }: SocialIconsProps) {
    const links = {
        instagram: "https://www.instagram.com/resethtx?igsh=Y3F0eTA0Y211eGI1",
        facebook: "https://www.facebook.com/share/1DQANkx6X9/?mibextid=wwXIfr",
        tiktok: "https://www.tiktok.com/@resethtx?_r=1&_t=ZP-92OsOSCeXdf"
    }

    return (
        <div className={`flex items-center ${className}`}>

            {/* Instagram */}
            <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
                aria-label="Instagram"
            >
                <Instagram className="w-5 h-5 text-zinc-400 group-hover:text-[#D4AF37] transition-colors duration-300" />
            </a>

            {/* Facebook */}
            <a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
                aria-label="Facebook"
            >
                <Facebook className="w-5 h-5 text-zinc-400 group-hover:text-[#D4AF37] transition-colors duration-300" />
            </a>

            {/* TikTok (Custom SVG) */}
            <a
                href={links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-all duration-300"
                aria-label="TikTok"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-zinc-400 group-hover:text-[#D4AF37] transition-colors duration-300"
                >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            </a>

        </div>
    )
}
