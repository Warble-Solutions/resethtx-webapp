'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import InquireModal from '@/app/components/InquireModal'

interface ReservationContextType {
    openReservation: () => void
    closeReservation: () => void
    isReservationOpen: boolean
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
    const [isReservationOpen, setIsReservationOpen] = useState(false)

    const openReservation = () => setIsReservationOpen(true)
    const closeReservation = () => setIsReservationOpen(false)

    return (
        <ReservationContext.Provider value={{ openReservation, closeReservation, isReservationOpen }}>
            {children}
            <InquireModal isOpen={isReservationOpen} onClose={closeReservation} />
        </ReservationContext.Provider>
    )
}

export function useReservation() {
    const context = useContext(ReservationContext)
    if (context === undefined) {
        throw new Error('useReservation must be used within a ReservationProvider')
    }
    return context
}
