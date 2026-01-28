export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Main Container with Top Padding for Navbar */}
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">

                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4 font-serif">Terms & Conditions</h1>
                    <p className="text-zinc-500">Last Updated: {new Date().getFullYear()}</p>
                </div>
                {/* Content Card */}
                <div className="bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-lg shadow-2xl space-y-10 text-zinc-300 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Ticket Sales & Refunds</h2>
                        <p>All ticket sales and table reservations are final. We do not offer refunds or exchanges unless an event is cancelled by the venue. If an event is rescheduled, your ticket will be valid for the new date.</p>
                    </section>
                    <div className="h-px bg-zinc-800" /> {/* Divider */}
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Entry & Code of Conduct</h2>
                        <p>Management reserves the right to refuse entry to any guest for any reason, including but not limited to intoxication, disorderly conduct, or failure to comply with dress code guidelines. Guests removed from the venue for violating these rules will not be entitled to a refund.</p>
                    </section>
                    <div className="h-px bg-zinc-800" />
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Age Restrictions</h2>
                        <p>Unless otherwise stated, all events are 21+. A valid government-issued ID is required for entry. No exceptions.</p>
                    </section>
                    <div className="h-px bg-zinc-800" />
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Liability</h2>
                        <p>The venue is not responsible for lost or stolen personal items. Guests assume all risks associated with attending events, including risks of personal injury.</p>
                    </section>
                    <div className="h-px bg-zinc-800" />
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Dress Code</h2>
                        <p>We enforce a stylish dress code. Management reserves the right to deny entry based on attire. Athletic wear, excessively baggy clothing, and flip-flops are generally not permitted.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
