import { createClient } from '@/utils/supabase/server'
import { updatePromo } from '../actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import PromoForm from '../promo-form'

export default async function EditPromoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('id', id)
        .single()

    if (!promo) {
        return (
            <div className="max-w-xl mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Promo Not Found</h1>
                <Link href="/admin/promos" className="text-[#D4AF37] hover:underline">
                    Return to All Promos
                </Link>
            </div>
        )
    }

    // Determine initial state
    const expiryType = promo.expires_at ? 'custom' : 'never'
    const customDate = promo.expires_at ? new Date(promo.expires_at).toISOString().split('T')[0] : ''

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Promo Code</h1>
                    <p className="text-slate-400 text-sm mt-1">Update discount or expiration.</p>
                </div>
                <Link href="/admin/promos" className="text-slate-400 hover:text-white hover:underline">
                    Cancel
                </Link>
            </div>

            <SpotlightCard className="p-8">
                <PromoForm
                    action={updatePromo}
                    initialData={{
                        id: promo.id,
                        code: promo.code,
                        discount: promo.discount,
                        expiryType,
                        customDate
                    }}
                    isEdit={true}
                />
            </SpotlightCard>
        </div>
    )
}
