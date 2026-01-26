import FAQSection from '../components/FAQSection';

export const metadata = {
    title: 'FAQ - Reset HTX',
    description: 'Frequently Asked Questions about Reset HTX.',
}

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-20">
            <FAQSection />
        </div>
    );
}
