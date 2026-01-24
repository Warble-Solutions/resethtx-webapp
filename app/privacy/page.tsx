export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">

                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4 font-serif">Privacy Policy</h1>
                    <p className="text-zinc-500">Your privacy is important to us.</p>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-lg shadow-2xl space-y-10 text-zinc-300 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you purchase tickets, book tables, or join our mailing list. This includes your name, email address, phone number, and payment information.</p>
                    </section>
                    <div className="h-px bg-zinc-800" />
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                        <p>We use your information to process transactions, send digital tickets, providing event updates, and improve our services. We do not sell your personal data to third parties.</p>
                    </section>
                    <div className="h-px bg-zinc-800" />
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Photography & Media</h2>
                        <p>By entering the venue, you consent to being photographed or filmed for promotional purposes. These images may be used on our social media and website.</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
