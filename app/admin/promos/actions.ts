'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Create Promo
export async function createPromo(formData: FormData) {
    const supabase = await createClient()

    const code = formData.get('code') as string
    const discount = formData.get('discount')
    const expiryType = formData.get('expiryType') as string
    const customDate = formData.get('customDate') as string

    let expires_at = null

    const now = new Date()

    switch (expiryType) {
        case '1_week':
            expires_at = new Date(now.setDate(now.getDate() + 7)).toISOString()
            break
        case '1_month':
            expires_at = new Date(now.setDate(now.getDate() + 30)).toISOString()
            break
        case '1_year':
            expires_at = new Date(now.setDate(now.getDate() + 365)).toISOString()
            break
        case 'custom':
            if (customDate) {
                // Set time to end of day for the selected date? Or just the date?
                // Usually expiration implies "until end of that day" or specific time.
                // User requested: "custom: Use the selected date value."
                // We'll trust the input which is usually YYYY-MM-DD.
                // Let's ensure it's a valid timestamp.
                expires_at = new Date(customDate).toISOString()
            }
            break
        case 'never':
        default:
            expires_at = null
    }

    const { error } = await supabase
        .from('promo_codes')
        .insert({
            code: code.toUpperCase(), // Always save as uppercase
            discount: Number(discount),
            is_active: true,
            expires_at: expires_at
        })

    if (error) {
        console.error('Promo Error:', error)
        throw new Error('Failed to create promo code')
    }

    redirect('/admin/promos')
}

// 2. Toggle Status (Active/Inactive)
export async function togglePromoStatus(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const currentStatus = formData.get('current_status') === 'true'

    const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus }) // Flip the boolean
        .eq('id', id)

    if (error) throw new Error('Failed to toggle status')

    revalidatePath('/admin/promos')
}

// 3. Delete Promo
export async function deletePromo(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id)

    if (error) throw new Error('Failed to delete promo')

    revalidatePath('/admin/promos')
}

// 4. Update Promo
export async function updatePromo(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const code = String(formData.get('code')).toUpperCase().trim()
    const discount = Number(formData.get('discount'))
    const expiryType = formData.get('expiryType') as string
    const customDate = formData.get('customDate') as string

    // Calculate Expiry
    let expires_at = null
    const now = new Date()

    switch (expiryType) {
        case '1_week':
            expires_at = new Date(now.setDate(now.getDate() + 7)).toISOString()
            break
        case '1_month':
            expires_at = new Date(now.setDate(now.getDate() + 30)).toISOString()
            break
        case '1_year':
            expires_at = new Date(now.setDate(now.getDate() + 365)).toISOString()
            break
        case 'custom':
            if (customDate) {
                expires_at = new Date(customDate).toISOString()
            }
            break
        case 'never':
            expires_at = null // Explicitly set to null for 'never'
            break
        default:
            // If editing and no expiry type change, we might want to keep existing?
            // But form sends expiryType. If valid option, logic holds.
            expires_at = null
    }

    // Update Database
    const { error } = await supabase
        .from('promo_codes')
        .update({
            code,
            discount,
            expires_at
        })
        .eq('id', id)

    if (error) {
        console.error('Update Promo Error:', error)
        throw new Error('Failed to update promo code')
    }

    redirect('/admin/promos')
}
