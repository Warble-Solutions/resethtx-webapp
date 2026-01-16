'use server'

import { createClient } from '@/utils/supabase/server'

export async function validatePromo(code: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single()

        if (error || !data) {
            return { valid: false, message: 'Invalid or expired promo code.' }
        }

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return { valid: false, message: 'This promo code has expired.' }
        }

        return {
            valid: true,
            discount: data.discount,
            message: `Success! ${data.discount}% discount applied.`
        }

    } catch (err) {
        console.error('Promo validation error:', err)
        return { valid: false, message: 'Failed to validate code.' }
    }
}
