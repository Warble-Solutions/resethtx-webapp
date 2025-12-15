'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  let image_url = null

  // Image Upload Logic
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `menu-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('images') // Assumes you have an 'images' bucket
      .upload(fileName, imageFile)

    if (uploadError) throw new Error('Image upload failed')
    
    const { data } = supabase.storage.from('images').getPublicUrl(fileName)
    image_url = data.publicUrl
  }

  const { error } = await supabase.from('menu_items').insert({
    name,
    price,
    category,
    description,
    image_url
  })

  if (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create item')
  }

  revalidatePath('/admin/menu')
  revalidatePath('/menu') // Refresh public page
  redirect('/admin/menu')
}

export async function deleteMenuItem(id: number) {
  const supabase = await createClient()
  await supabase.from('menu_items').delete().eq('id', id)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
}