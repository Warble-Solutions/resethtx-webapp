'use server'

import { createClient } from '@/utils/supabase/server'

export async function validatePromo(code: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('promos')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single()

        if (error || !data) {
            return { valid: false, message: 'Invalid or expired promo code.' }
        }

        return {
            valid: true,
            discount: data.discount_percent,
            message: `Success! ${data.discount_percent}% discount applied.`
        }

    } catch (err) {
        console.error('Promo validation error:', err)
        return { valid: false, message: 'Failed to validate code.' }
    }
}
