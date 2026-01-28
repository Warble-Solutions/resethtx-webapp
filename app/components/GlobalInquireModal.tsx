'use client'

import React from 'react'
import { useInquire } from '../context/InquireContext'
import InquireModal from './InquireModal'

export default function GlobalInquireModal() {
    const { isInquiryOpen, closeInquiry } = useInquire()

    return (
        <InquireModal
            isOpen={isInquiryOpen}
            onClose={closeInquiry}
        />
    )
}
