'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient()

  const author_name = formData.get('author_name') as string
  const author_role = formData.get('author_role') as string
  const quote = formData.get('quote') as string

  const { error } = await supabase.from('testimonials').insert({
    author_name,
    author_role,
    quote,
    is_active: true
  })

  if (error) {
    console.error('Error creating testimonial:', error)
    throw new Error('Failed to create testimonial')
  }

  revalidatePath('/admin/testimonials')
  redirect('/admin/testimonials')
}

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