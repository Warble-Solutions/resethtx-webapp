'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- 1. EXISTING: Update Password ---
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  // Basic Validation
  if (password !== confirmPassword) {
    redirect('/admin/settings?error=Passwords do not match')
  }

  if (password.length < 6) {
    redirect('/admin/settings?error=Password must be at least 6 characters')
  }

  // Update via Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/admin/settings?error=${error.message}`)
  }

  redirect('/admin/settings?success=Password updated successfully')
}

// --- 2. NEW: Update Site Settings ---
export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient()

  // Gather data from the form
  const updates = {
    address: formData.get('address') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    instagram_url: formData.get('instagram_url') as string,
    facebook_url: formData.get('facebook_url') as string,
    tiktok_url: formData.get('tiktok_url') as string,
    youtube_url: formData.get('youtube_url') as string,
    hours_mon_tue: formData.get('hours_mon_tue') as string,
    hours_wed_thu: formData.get('hours_wed_thu') as string,
    hours_fri_sat: formData.get('hours_fri_sat') as string,
    hours_sun: formData.get('hours_sun') as string,
    google_maps_embed_url: formData.get('google_maps_embed_url') as string,
  }

  // Always update the row with ID = 1 (our global settings row)
  const { error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', 1)

  if (error) {
    console.error('Error updating settings:', error)
    // We don't redirect on error here, just log it. 
    // In a real app, you might want to return state to show a toast message.
    throw new Error('Failed to update settings')
  }

  // Refresh the layout so the Footer updates immediately across the site
  revalidatePath('/', 'layout')
  redirect('/admin/settings?success=Settings saved')
}