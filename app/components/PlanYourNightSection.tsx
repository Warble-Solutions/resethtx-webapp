const infoCards = [
  {
    title: "DRESS CODE",
    description: "Upscale Chic. No athletic wear, flip flops, or oversized clothing. Dress to impress."
  },
  {
    title: "PARKING",
    description: "Valet parking is available directly in front of the venue. Street parking is limited."
  },
  {
    title: "AGE POLICY",
    description: "21+ only with valid physical ID. No photos of IDs accepted."
  },
  {
    title: "ENTRY",
    description: "Cover charge may apply for special events and weekends after 10 PM."
  }
]

export default function PlanYourNightSection() {
  return (
    <section className="py-24 bg-[#0F172A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase mb-4">
                Plan Your <span className="text-[#D4AF37]">Night</span>
            </h2>
            <p className="text-slate-400 text-lg">
                Everything you need to know before you arrive.
            </p>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoCards.map((card, index) => (
                <div 
                    key={index} 
                    className="bg-black/40 border border-white/5 p-8 rounded-xl text-center group hover:border-[#D4AF37]/30 transition-all duration-300 hover:-translate-y-1"
                >
                    <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4 group-hover:text-white transition-colors">
                        {card.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {card.description}
                    </p>
                </div>
            ))}
        </div>

      </div>
    </section>
  )
}