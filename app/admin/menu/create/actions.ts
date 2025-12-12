'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function checkMenuConflict(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  // Check if ANY item has this name (case-insensitive search)
  // ilike matches 'Burger', 'burger', 'BURGER'
  const { data } = await supabase
    .from('menu_items')
    .select('name, category')
    .ilike('name', name) 
    .single()

  if (data) {
    return { conflict: true, existingItem: data }
  }
  
  return { conflict: false }
}

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()

  // 1. Get Text Data
  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const isAvailable = formData.get('is_available') === 'on' // Checkboxes return "on" if checked

  // 2. Handle Image Upload
  const imageFile = formData.get('image') as File
  let imageUrl = null

  if (imageFile && imageFile.size > 0) {
    const fileName = `menu-${Date.now()}-${imageFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('images') // We reuse the same bucket!
      .upload(fileName, imageFile)

    if (uploadError) throw new Error('Failed to upload image')

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
      
    imageUrl = publicUrlData.publicUrl
  }

  // 3. Insert into Database
  const { error } = await supabase
    .from('menu_items')
    .insert({
      name,
      price: parseFloat(price), // Convert string to number
      category,
      description,
      image_url: imageUrl,
      is_available: isAvailable
    })

  if (error) {
    console.error('Menu Error:', error)
    throw new Error('Failed to create menu item')
  }

  // 4. Redirect
  redirect('/admin/menu')
}

// ... existing imports and createMenuItem function ...

export async function deleteMenuItem(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Get the ID
  const id = formData.get('id') as string

  // 2. Delete from DB
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    throw new Error('Failed to delete item')
  }

  // 3. Refresh the menu page
  revalidatePath('/admin/menu')
}

export async function updateMenuItem(formData: FormData) {
  const supabase = await createClient()

  // 1. Get ID
  const id = formData.get('id') as string

  // 2. Get Text Data
  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  
  // Checkbox logic: If it's checked, formData returns "on". If unchecked, it returns null.
  const isAvailable = formData.get('is_available') === 'on'

  // 3. Prepare Update Object
  const updateData: any = {
    name,
    price: parseFloat(price),
    category,
    description,
    is_available: isAvailable
  }

  // 4. Handle Optional Image Update
  const imageFile = formData.get('image') as File
  
  if (imageFile && imageFile.size > 0) {
    const fileName = `menu-${Date.now()}-${imageFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile)

    if (uploadError) throw new Error('Failed to upload new image')

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
      
    updateData.image_url = publicUrlData.publicUrl
  }

  // 5. Update Database
  const { error } = await supabase
    .from('menu_items')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Update Error:', error)
    throw new Error('Failed to update menu item')
  }

  // 6. Redirect
  redirect('/admin/menu')
}