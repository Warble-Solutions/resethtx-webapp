'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "WHAT IS THE REQUIRED AGE FOR ENTRY?",
        answer: "You must have a valid government issued photo ID. You must be 21+ to enter the venue."
    },
    {
        question: "WHAT ARE THE ENTRY FEES?",
        answer: "Wednesday & Thursday: Free\nFriday: $20 after 10 PM\nSaturday: Event Pending\nSunday: Free"
    },
    {
        question: "TABLE PURCHASE MINIMUM AMOUNT?",
        answer: "Every day of the week except for Sunday, bottle sections start at $275 (you must purchase one bottle).\n\nOn Sundays, select bottles are priced at $200, and there is a two-bottle minimum."
    },
    {
        question: "IS THERE PARKING AT RESET?",
        answer: "Yes. Valet parking is available. There is also limited parking on the street."
    },
    {
        question: "HOW LONG IS THE RESERVATION TIME SLOT FOR?",
        answer: "The reservation time slots are for two hours. This rule is only in effect when time and capacity has been reached. Extensions may be negotiated on a case by case basis."
    },
    {
        question: "DO YOU SHOW SPORTING EVENTS?",
        answer: "Yes, we play major sporting events."
    },
    {
        question: "IS THERE A REFUND POLICY?",
        answer: "Purchaser acknowledges that no refunds will be provided and that no exchanges or credits for future event dates will be given for section reservations for any reason."
    },
    {
        question: "IS GRATUITY ADDED TO ORDERS?",
        answer: "Yes. A 20% gratuity is applied to all orders."
    },
    {
        question: "DRESS CODE",
        answer: "Upscale Chic. No athletic wear, flip flops, or oversized clothing. Dress to impress."
    },
    {
        question: "AGE POLICY",
        answer: "21+ only with valid physical ID. No photos of IDs accepted."
    },
    {
        question: "ENTRY FEES",
        answer: "Cover charge may apply for special events. Wednesday & Thursday is generally free."
    }
];

export default function FAQSection({ className = "" }: { className?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className={`py-20 bg-black ${className}`}>
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white tracking-widest uppercase font-heading">
                    FREQUENTLY ASKED QUESTIONS
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-zinc-800">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                            >
                                <span className="text-lg md:text-xl font-bold text-zinc-200 group-hover:text-[#D4AF37] transition-colors uppercase tracking-wide pr-8">
                                    {faq.question}
                                </span>
                                <div className="flex-shrink-0">
                                    {openIndex === index ? (
                                        <Minus className="w-6 h-6 text-[#D4AF37]" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-zinc-500 group-hover:text-[#D4AF37] transition-colors" />
                                    )}
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="pb-6 text-zinc-400 whitespace-pre-line leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
