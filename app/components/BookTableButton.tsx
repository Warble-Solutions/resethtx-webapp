'use client'

import { useReservation } from '../context/ReservationContext'

interface BookTableButtonProps {
    className?: string
    text?: string
}

export default function BookTableButton({
    className = "font-sans inline-block bg-white text-black hover:bg-[#C59D24] font-bold py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_0_20px_rgba(197,157,36,0.4)]",
    text = "Book A Table"
}: BookTableButtonProps) {
    const { openReservation } = useReservation()

    return (
        <button
            onClick={openReservation}
            className={className}
        >
            {text}
        </button>
    )
}
