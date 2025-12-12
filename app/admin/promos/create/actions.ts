'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Create Promo
export async function createPromo(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const discount = formData.get('discount')

  const { error } = await supabase
    .from('promo_codes')
    .insert({
      code: code.toUpperCase(), // Always save as uppercase
      discount: Number(discount),
      is_active: true
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