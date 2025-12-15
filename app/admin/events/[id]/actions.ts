'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Gather Data
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const date = formData.get('date') as string
  const tickets = formData.get('tickets')
  const description = formData.get('description') as string
  const is_featured = formData.get('is_featured') === 'on'

  console.log("Attempting Update for ID:", id) // Debug Log

  // 2. Handle Time Safely
  const time_hour = formData.get('time_hour') as string
  const time_minute = formData.get('time_minute') as string
  const time_ampm = formData.get('time_ampm') as string
  
  let hour = parseInt(time_hour || '12') // Default to 12 if missing
  if (time_ampm === 'PM' && hour !== 12) hour += 12
  if (time_ampm === 'AM' && hour === 12) hour = 0
  const time = `${hour.toString().padStart(2, '0')}:${time_minute || '00'}:00`

  // 3. Prepare Update Object
  const updates: any = {
    title,
    date, // Ensure this is not empty
    time,
    tickets: Number(tickets),
    description,
    is_featured,
  }

  // 4. Handle Image Upload
  const imageFile = formData.get('image') as File
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error("Image Upload Error:", uploadError)
      throw new Error('Image upload failed')
    }
    
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
    updates.image_url = urlData.publicUrl
  }

  // 5. Update DB
  const { error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)

  // --- DEBUGGING BLOCK ---
  if (error) {
    console.error("❌ SUPABASE UPDATE ERROR:", error) // <--- CHECK YOUR TERMINAL FOR THIS
    console.error("Data sent:", updates)
    throw new Error(`Database Error: ${error.message}`)
  }
  // -----------------------

  revalidatePath('/admin/events')
  redirect('/admin/events')
}