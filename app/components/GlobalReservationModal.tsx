'use client'

import { useReservation } from '@/app/context/ReservationContext'
import ReservationModal from './ReservationModal'

export default function GlobalReservationModal() {
    const { isReservationOpen, closeReservation, modalProps } = useReservation()

    return (
        <ReservationModal
            isOpen={isReservationOpen}
            onClose={closeReservation}
            eventId={modalProps?.eventId}
            tableFee={modalProps?.tableFee}
        />
    )
}
