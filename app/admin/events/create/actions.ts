'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function checkEventConflict(formData: FormData) {
  const supabase = await createClient()
  
  const date = formData.get('date') as string
  const time_hour = formData.get('time_hour') as string
  const time_minute = formData.get('time_minute') as string
  const time_ampm = formData.get('time_ampm') as string

  // Convert 12h to 24h for storage
  let hour = parseInt(time_hour)
  if (time_ampm === 'PM' && hour !== 12) hour += 12
  if (time_ampm === 'AM' && hour === 12) hour = 0
  const time = `${hour.toString().padStart(2, '0')}:${time_minute}:00`

  // Check for existing event at this exact time
  const { data: existingEvent } = await supabase
    .from('events')
    .select('title')
    .eq('date', date)
    .eq('time', time)
    .single()

  if (existingEvent) {
    return { conflict: true, title: existingEvent.title }
  }

  return { conflict: false }
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Gather Data
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const tickets = formData.get('tickets')
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File
  const is_featured = formData.get('is_featured') === 'on' // <--- CAPTURE TOGGLE

  // 2. Handle Time Construction
  const time_hour = formData.get('time_hour') as string
  const time_minute = formData.get('time_minute') as string
  const time_ampm = formData.get('time_ampm') as string
  
  let hour = parseInt(time_hour)
  if (time_ampm === 'PM' && hour !== 12) hour += 12
  if (time_ampm === 'AM' && hour === 12) hour = 0
  const time = `${hour.toString().padStart(2, '0')}:${time_minute}:00`

  // 3. Upload Image (if exists)
  let publicUrl = null
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error('Image upload failed')
    }
    
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
    publicUrl = urlData.publicUrl
  }

  // 4. Insert into DB
  const { error } = await supabase.from('events').insert({
    title,
    date,
    time,
    tickets: Number(tickets),
    description,
    image_url: publicUrl,
    is_featured: is_featured, // <--- SAVE TO DB
  })

  if (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create event')
  }

  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function deleteEvent(formData: FormData) {
  const supabase = await createClient()
  
  // Get the ID from the hidden input field
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    throw new Error('Failed to delete event')
  }

  // Refresh the events list so the card disappears
  revalidatePath('/admin/events')
}