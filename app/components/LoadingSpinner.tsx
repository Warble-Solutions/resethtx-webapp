import Image from 'next/image'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Pulsing Reset Logo */}
      <div className="relative w-20 h-20 animate-pulse">
        <Image
          src="/logos/logo-main.png"
          alt="Reset HTX"
          fill
          className="object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          priority
        />
      </div>
      {/* Subtle text */}
      <p className="text-[#D4AF37]/60 text-xs font-medium tracking-[0.2em] uppercase animate-pulse">
        Loading...
      </p>
    </div>
  )
}