'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTestimonial(id: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    throw new Error('Failed to delete')
  }

  revalidatePath('/admin/testimonials')
}

export async function toggleTestimonialStatus(id: number, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('testimonials')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating status:', error)
    throw new Error('Failed to update status')
  }

  revalidatePath('/admin/testimonials')
}