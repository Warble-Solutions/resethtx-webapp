'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function checkEventConflict(formData: FormData) {
  const supabase = await createClient()

  // 1. Reconstruct the Date (Same logic as createEvent)
  const rawDate = formData.get('date') as string
  const hour = parseInt(formData.get('time_hour') as string)
  const minute = formData.get('time_minute') as string
  const ampm = formData.get('time_ampm') as string

  let hour24 = hour
  if (ampm === 'PM' && hour !== 12) hour24 = hour + 12
  if (ampm === 'AM' && hour === 12) hour24 = 0

  const finalDateIso = `${rawDate}T${hour24.toString().padStart(2, '0')}:${minute}:00`

  // 2. Check if an event already exists at this exact second
  const { data } = await supabase
    .from('events')
    .select('title')
    .eq('date', finalDateIso)
    .single()

  // 3. Return the conflict info
  if (data) {
    return { conflict: true, title: data.title }
  }
  
  return { conflict: false }
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Get basic text data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const tickets = formData.get('tickets') as string
  
  // 2. Stitch the Date and Time parts together
  const rawDate = formData.get('date') as string // "2023-12-25"
  const hour = parseInt(formData.get('time_hour') as string)
  const minute = formData.get('time_minute') as string
  const ampm = formData.get('time_ampm') as string

  // Convert 12h format to 24h format for the database
  let hour24 = hour
  if (ampm === 'PM' && hour !== 12) hour24 = hour + 12
  if (ampm === 'AM' && hour === 12) hour24 = 0

  // Create the final ISO string: "2023-12-25T19:30:00"
  // Note: We create a date object to handle Timezones correctly if needed, 
  // but for simplicity, we append the string.
  const finalDateIso = `${rawDate}T${hour24.toString().padStart(2, '0')}:${minute}:00`

  // 3. Handle Image Upload
  const imageFile = formData.get('image') as File
  let imageUrl = null

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error('Failed to upload image')
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
      
    imageUrl = publicUrlData.publicUrl
  }

  // 4. Insert into Database
  const { error: dbError } = await supabase
    .from('events')
    .insert({
      title,
      description,
      date: finalDateIso, // Use our stitched date
      tickets_available: Number(tickets),
      image_url: imageUrl,
    })

  if (dbError) {
    console.error('DB Error:', dbError)
    throw new Error('Failed to create event')
  }

  // 5. Redirect back to list
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

// ... existing imports
// ... existing createEvent function
// ... existing deleteEvent function

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Get the ID (Crucial!)
  const id = formData.get('id') as string
  
  // 2. Get text data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const tickets = formData.get('tickets') as string
  
  // 3. Reconstruct Date
  const rawDate = formData.get('date') as string
  const hour = parseInt(formData.get('time_hour') as string)
  const minute = formData.get('time_minute') as string
  const ampm = formData.get('time_ampm') as string

  let hour24 = hour
  if (ampm === 'PM' && hour !== 12) hour24 = hour + 12
  if (ampm === 'AM' && hour === 12) hour24 = 0

  const finalDateIso = `${rawDate}T${hour24.toString().padStart(2, '0')}:${minute}:00`

  // 4. Prepare the Data Object
  const updateData: any = {
    title,
    description,
    date: finalDateIso,
    tickets_available: Number(tickets),
  }

  // 5. Handle Optional Image Update
  const imageFile = formData.get('image') as File
  
  if (imageFile && imageFile.size > 0) {
    // Only if user selected a NEW file, we upload it
    const fileName = `${Date.now()}-${imageFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageFile)

    if (uploadError) throw new Error('Failed to upload new image')

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
      
    // Add the new URL to the update object
    updateData.image_url = publicUrlData.publicUrl
  }

  // 6. Update Database
  const { error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Update Error:', error)
    throw new Error('Failed to update event')
  }

  // 7. Redirect
  redirect('/admin/events')
}