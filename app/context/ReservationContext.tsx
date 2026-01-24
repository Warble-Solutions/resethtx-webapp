'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ReservationModalProps {
    eventId?: string
    tableFee?: number
}

interface ReservationContextType {
    openReservation: (props?: ReservationModalProps) => void
    closeReservation: () => void
    isReservationOpen: boolean
    modalProps?: ReservationModalProps
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export function ReservationProvider({ children }: { children: ReactNode }) {
    const [isReservationOpen, setIsReservationOpen] = useState(false)
    const [modalProps, setModalProps] = useState<ReservationModalProps | undefined>(undefined)

    const openReservation = (props?: ReservationModalProps) => {
        setModalProps(props)
        setIsReservationOpen(true)
    }

    const closeReservation = () => setIsReservationOpen(false)

    return (
        <ReservationContext.Provider value={{ openReservation, closeReservation, isReservationOpen, modalProps }}>
            {children}
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
