'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface InquireContextType {
    openInquiry: () => void
    closeInquiry: () => void
    isInquiryOpen: boolean
}

const InquireContext = createContext<InquireContextType | undefined>(undefined)

export function InquireProvider({ children }: { children: ReactNode }) {
    const [isInquiryOpen, setIsInquiryOpen] = useState(false)

    const openInquiry = () => {
        setIsInquiryOpen(true)
    }

    const closeInquiry = () => setIsInquiryOpen(false)

    return (
        <InquireContext.Provider value={{ openInquiry, closeInquiry, isInquiryOpen }}>
            {children}
        </InquireContext.Provider>
    )
}

export function useInquire() {
    const context = useContext(InquireContext)
    if (context === undefined) {
        throw new Error('useInquire must be used within a InquireProvider')
    }
    return context
}
