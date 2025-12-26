import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function Footer() {
    const supabase = await createClient()
    const { data: settings } = await supabase.from('site_settings').select('*').single()

    if (!settings) return null

    return (
        <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 mb-16">

                {/* COL 1: CONTACT US */}
                <div>
                    <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-8">
                        Contact Us
                    </h3>

                    <div className="flex flex-col gap-6">
                        {/* Address */}
                        <div className="flex items-start gap-4">
                            <div className="text-[#D4AF37] mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-[200px]">
                                {settings.address}
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-4">
                            <div className="text-[#D4AF37]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            </div>
                            <p className="text-slate-400">{settings.phone}</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-2">
                            {settings.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </a>
                            )}
                            {settings.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 2: HOURS */}
                <div>
                    <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-8">
                        Hours
                    </h3>
                    <div className="flex flex-col gap-4 text-sm md:text-base">
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-slate-400">Mon - Tue</span>
                            <span className="text-white font-bold">{settings.hours_mon_tue}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-slate-400">Wed - Sat</span>
                            <span className="text-white font-bold">{settings.hours_wed_sat}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-slate-400">Sunday</span>
                            <span className="text-white font-bold">{settings.hours_sun}</span>
                        </div>
                    </div>
                </div>

                {/* COL 3: MAP */}
                <div className="h-64 lg:h-auto rounded-xl overflow-hidden border border-white/10 relative group">
                    <iframe
                        src={settings.google_maps_embed_url}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }} // Dark mode map hack
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="group-hover:grayscale-0 group-hover:invert-0 transition-all duration-500"
                    ></iframe>
                </div>

            </div>

            {/* COPYRIGHT */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-slate-600 text-xs uppercase tracking-widest text-center md:text-left">
                    &copy; {new Date().getFullYear()} Reset HTX. All rights reserved.
                </div>

                <a
                    href="https://kentagiouskollective.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                >
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Powered by</span>
                    <Image
                        src="/logos/kentagious.png"
                        alt="Kentagious Kollective"
                        width={120}
                        height={40}
                        className="h-6 w-auto object-contain"
                    />
                </a>
            </div>
        </footer>
    )
}