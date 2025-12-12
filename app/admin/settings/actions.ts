'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  // 1. Basic Validation
  if (password !== confirmPassword) {
    redirect('/admin/settings?error=Passwords do not match')
  }

  if (password.length < 6) {
    redirect('/admin/settings?error=Password must be at least 6 characters')
  }

  // 2. Update via Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/admin/settings?error=${error.message}`)
  }

  // 3. Success
  redirect('/admin/settings?success=Password updated successfully')
}