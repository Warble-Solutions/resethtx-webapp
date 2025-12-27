'use client'

import ContactForm from '@/app/components/ContactForm'

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#C59D24] selection:text-black pt-32 pb-20">

            {/* 1. HEADER */}
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase mb-6">
                    Contact <span className="text-[#C59D24]">Us</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans">
                    For table reservations, private events, or general inquiries, please reach out below.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                {/* 2. LEFT: CONTACT INFO */}
                <div className="space-y-12">

                    {/* Info Box 1 */}
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-full bg-[#C59D24]/20 flex items-center justify-center text-[#C59D24] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        </div>
                        <div>
                            <h3 className="font-heading text-xl font-bold text-white mb-2">Location</h3>
                            <p className="text-slate-400 font-sans">
                                606 Dennis St Ste 200 <br />
                                Houston, TX 77006
                            </p>
                        </div>
                    </div>

                    {/* Info Box 2 */}
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-full bg-[#C59D24]/20 flex items-center justify-center text-[#C59D24] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <div>
                            <h3 className="font-heading text-xl font-bold text-white mb-2">Hours</h3>
                            <ul className="text-slate-400 font-sans space-y-1">
                                <li className="flex justify-between w-48"><span>Mon - Tue:</span> <span>Closed</span></li>
                                <li className="flex justify-between w-48"><span>Wed - Thu:</span> <span>5PM - 12AM</span></li>
                                <li className="flex justify-between w-48"><span>Fri - Sat:</span> <span>5PM - 2AM</span></li>
                                <li className="flex justify-between w-48"><span>Sunday:</span> <span>4PM - 12AM</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Info Box 3 */}
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-full bg-[#C59D24]/20 flex items-center justify-center text-[#C59D24] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <div>
                            <h3 className="font-heading text-xl font-bold text-white mb-2">Contact</h3>
                            <p className="text-slate-400 font-sans">
                                <a href="mailto:info@resethtx.com" className="hover:text-[#C59D24] transition-colors">info@resethtx.com</a> <br />
                                <a href="tel:+18325550199" className="hover:text-[#C59D24] transition-colors">(832) 555-0199</a>
                            </p>
                        </div>
                    </div>

                    {/* Map Embed */}
                    <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.766774659616!2d-95.38152592359614!3d29.755498832168393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640bf6f6e5229c9%3A0x6296366020586e39!2s606%20Dennis%20St%20STE%20200%2C%20Houston%2C%20TX%2077006!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>

                </div>

                {/* 3. RIGHT: CONTACT FORM */}
                <ContactForm />

            </div>
        </main>
    )
}