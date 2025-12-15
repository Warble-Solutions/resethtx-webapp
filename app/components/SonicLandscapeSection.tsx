import Image from 'next/image'

const musicGenres = [
  {
    name: "House & Techno",
    time: "Friday & Saturday Late Night",
    width: "90%" 
  },
  {
    name: "R&B & Soul",
    time: "Sundays",
    width: "75%"
  },
  {
    name: "Latin & Reggaeton",
    time: "Select Thursdays",
    width: "60%"
  },
  {
    name: "Top 40 & Open Format",
    time: "Happy Hour Daily",
    width: "85%"
  }
]

export default function SonicLandscapeSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: CONTENT */}
        <div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold uppercase mb-6 leading-none">
                The Sonic <br />
                <span className="text-[#D4AF37]">Landscape</span>
            </h2>
            
            <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-md">
                We curate a diverse auditory experience. From the deep grooves of House music to the smooth rhythms of R&B, our sound is as eclectic as our crowd.
            </p>

            <div className="space-y-8">
                {musicGenres.map((genre, index) => (
                    <div key={index} className="group">
                        <div className="flex justify-between items-end mb-2 uppercase font-bold tracking-wider text-xs md:text-sm">
                            <span className="text-white">{genre.name}</span>
                            <span className="text-[#D4AF37]">{genre.time}</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            {/* Animated Gold Bar */}
                            <div 
                                className="h-full bg-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-1000 ease-out group-hover:brightness-125"
                                style={{ width: genre.width }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT: IMAGES */}
        <div className="relative h-[400px] md:h-[500px] w-full flex gap-4">
            {/* Image 1: DJ / Decks */}
            <div className="relative w-3/5 h-full rounded-2xl overflow-hidden border border-white/10 group">
                <Image 
                    src="/images/event-1.png" // Ensure you have a placeholder or use a real path
                    alt="DJ Decks" 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
            </div>

            {/* Image 2: Crowd / Vibe (Offset) */}
            <div className="relative w-2/5 h-[80%] self-center rounded-2xl overflow-hidden border border-white/10 group">
                <Image 
                    src="/images/event-2.png" 
                    alt="Crowd Vibe" 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay"></div>
            </div>
        </div>

      </div>
    </section>
  )
}