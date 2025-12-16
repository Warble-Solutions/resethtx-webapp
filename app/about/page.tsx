import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#C59D24] selection:text-black pt-32 pb-0">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 border-b border-white/5 overflow-hidden">
        <div className="max-w-4xl mx-auto z-10">
            <h2 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Est. 2021 • Midtown Houston
            </h2>
            <h1 className="font-heading text-5xl md:text-8xl font-bold uppercase mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            The Standard <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C59D24] to-[#F0DEAA]">Of Luxury</span>
            </h1>
            <p className="font-sans text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                A rooftop sanctuary where sound, taste, and atmosphere converge to create Houston's most exclusive vibe.
            </p>
        </div>
        
        {/* Background texture/noise (Pulse Removed) */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-15 pointer-events-none"></div>
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C59D24]/5 blur-[100px] rounded-full pointer-events-none"></div>
      </section>


      {/* 2. THE VISION (Manifesto) */}
      <section className="py-24 px-6 bg-[#050505] relative">
        <div className="max-w-3xl mx-auto text-center">
            <span className="block w-1 h-16 bg-[#C59D24] mx-auto mb-8 animate-in fade-in zoom-in duration-1000 delay-300"></span>
            <h3 className="font-heading text-3xl md:text-4xl text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                "We didn't just build a bar. We curated a feeling."
            </h3>
            <div className="prose prose-invert prose-lg mx-auto font-sans text-slate-400 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
                <p>
                    In a city known for its hustle, Reset HTX serves as a necessary pause. We believe nightlife shouldn't just be loud—it should be curated. From the frequency of the bass to the thread count of our seating, every detail is engineered to lower your shoulders and raise your spirits.
                </p>
                <p>
                    We exist for the tastemakers, the professionals, and the creatives who demand more from their evening. This is not just a place to be seen; it is a place to be.
                </p>
            </div>
        </div>
      </section>


      {/* 3. ZIG-ZAG FEATURE: THE INTERIOR */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 group order-2 lg:order-1 hover:border-[#C59D24]/30 transition-colors duration-500">
                <Image 
                    src="/images/event-1.jpg" // Use an interior shot
                    alt="Reset Interior" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
            </div>
            
            {/* Text Side */}
            <div className="order-1 lg:order-2">
                <h4 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs mb-4">The Interior</h4>
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
                    Industrial Chic Meets <br/> Modern Opulence
                </h2>
                <p className="font-sans text-slate-400 text-lg leading-relaxed mb-8">
                    Designed with an eye for contrast, our main lounge blends raw concrete textures with velvet softness. Low-slung modular seating invites conversation, while our intelligent lighting system adapts to the rhythm of the night.
                </p>
                
                {/* Animated List */}
                <ul className="space-y-4 font-sans text-sm text-white">
                    {['Custom Velvet Seating', 'Intelligent Mood Lighting', 'State-of-the-Art Sound Treatment'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 group cursor-default">
                            <span className="w-2 h-2 bg-[#C59D24] rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                            <span className="group-hover:text-[#C59D24] group-hover:translate-x-2 transition-all duration-300">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>


      {/* 4. ZIG-ZAG FEATURE: THE PATIO (Swapped Layout) */}
      <section className="py-24 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Side */}
            <div>
                <h4 className="text-[#C59D24] font-bold tracking-[0.3em] uppercase text-xs mb-4">The Patio</h4>
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
                    Under The <br/> Midtown Stars
                </h2>
                <p className="font-sans text-slate-400 text-lg leading-relaxed mb-8">
                    Step out onto our expansive terrace, where the energy of the city serves as your backdrop. It’s the perfect vantage point to watch Houston light up. Whether you are enjoying a cigar in our designated smoking area or sipping a chilled glass of champagne, the patio offers a breath of fresh air without leaving the party.
                </p>
                <Link 
                    href="/reservations" 
                    className="font-sans inline-block bg-white text-black hover:bg-[#C59D24] font-bold py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_0_20px_rgba(197,157,36,0.4)]"
                >
                    Book A Table
                </Link>
            </div>

             {/* Image Side */}
             <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 group hover:border-[#C59D24]/30 transition-colors duration-500">
                <Image 
                    src="/images/event-2.png" // Use a patio/exterior shot
                    alt="The Patio" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out" 
                />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
            </div>

        </div>
      </section>


      {/* 5. THE EXPERIENCE (3 Pillars) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">The Experience</h2>
                <p className="text-slate-500 font-sans max-w-2xl mx-auto">Three pillars that define every night at Reset HTX.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {/* Pillar 1 */}
                 <div className="bg-[#111] p-10 rounded-xl border border-white/5 hover:border-[#C59D24]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#C59D24]/10 group">
                    <h3 className="text-[#C59D24] font-heading text-2xl mb-4 group-hover:text-white transition-colors">Sonic Identity</h3>
                    <p className="font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        We don't play background music. We curate soundscapes. From deep house grooves to soulful R&B, our residents are chosen for their ability to read a room, not just a playlist.
                    </p>
                 </div>
                 {/* Pillar 2 */}
                 <div className="bg-[#111] p-10 rounded-xl border border-white/5 hover:border-[#C59D24]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#C59D24]/10 group md:-translate-y-8">
                    <h3 className="text-[#C59D24] font-heading text-2xl mb-4 group-hover:text-white transition-colors">Mixology</h3>
                    <p className="font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        Our bar program is rooted in classics but finished with a modern twist. Expect hand-cut ice, premium spirits, and botanicals sourced specifically for our menu.
                    </p>
                 </div>
                 {/* Pillar 3 */}
                 <div className="bg-[#111] p-10 rounded-xl border border-white/5 hover:border-[#C59D24]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#C59D24]/10 group">
                    <h3 className="text-[#C59D24] font-heading text-2xl mb-4 group-hover:text-white transition-colors">Hospitality</h3>
                    <p className="font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        Service is an art form. Our staff is trained to anticipate needs before they arise, ensuring your glass is never empty and your night is never interrupted.
                    </p>
                 </div>
            </div>
        </div>
      </section>


      {/* 6. ETIQUETTE / DRESS CODE (Dark Section) */}
      <section className="py-24 bg-[#C59D24] text-black">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">House Rules</h2>
                <p className="font-sans text-black/80 text-lg leading-relaxed mb-8 font-medium">
                    To maintain the vibe, we enforce a strict upscale dress code. We reserve the right to deny entry to anyone not meeting our standards.
                </p>
                <ul className="font-sans font-bold space-y-3 uppercase tracking-wide text-sm">
                    {[
                        '— No Athletic Wear or Jerseys', 
                        '— No Flip Flops or Slides', 
                        '— No Ball Caps (Fedoras/Brims Allowed)', 
                        '— No Oversized Clothing'
                    ].map((rule, i) => (
                        <li key={i} className="hover:translate-x-2 transition-transform duration-300 cursor-default">
                            {rule}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 w-full">
                <div className="bg-black text-[#C59D24] p-10 rounded-2xl text-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <h3 className="font-heading text-2xl mb-2">Age Policy</h3>
                    <p className="font-sans text-white/70 mb-8">Strictly 21+ with valid physical ID.</p>
                    
                    <h3 className="font-heading text-2xl mb-2">Cover Charge</h3>
                    <p className="font-sans text-white/70">Applies weekends after 10PM and for special events.</p>
                </div>
            </div>
        </div>
      </section>


      {/* 7. PRIVATE EVENTS CTA */}
      <section className="relative py-32 text-center px-6">
        <div className="absolute inset-0 z-0">
             <Image 
                src="/images/event-3.jpg" // Use a crowd shot
                alt="Crowd Background" 
                fill 
                className="object-cover opacity-20" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto group">
            <h2 className="font-heading text-5xl md:text-6xl text-white mb-6 group-hover:text-[#C59D24] transition-colors duration-500">Host Your Own</h2>
            <p className="font-sans text-slate-400 text-lg mb-10">
                From corporate mixers to birthday celebrations, Reset HTX offers private sections and full venue buyouts for those looking to make a statement.
            </p>
            <Link 
                href="/contact" 
                className="font-sans inline-block bg-[#C59D24] text-black hover:bg-white font-bold py-5 px-12 rounded-full transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,157,36,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(197,157,36,0.6)]"
            >
                Inquire Now
            </Link>
        </div>
      </section>

    </main>
  )
}