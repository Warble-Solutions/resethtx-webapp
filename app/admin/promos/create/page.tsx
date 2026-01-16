'use client'

import { createPromo } from '../actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import PromoForm from '../promo-form'

export default function CreatePromoPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">New Promo Code</h1>
          <p className="text-slate-400 text-sm mt-1">Create a discount for your customers.</p>
        </div>
        <Link href="/admin/promos" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <PromoForm action={createPromo} />
      </SpotlightCard>
    </div>
  )
}