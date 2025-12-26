'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Mark as Read
export async function markAsRead(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)

  if (error) throw new Error('Failed to update status')
  revalidatePath('/admin/inbox')
}

// 2. Delete Message
export async function deleteSubmission(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Failed to delete message')
  revalidatePath('/admin/inbox')
}