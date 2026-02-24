/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Gather Data
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const tickets = formData.get('tickets')
  const description = formData.get('description') as string
  const is_featured = formData.get('is_featured') === 'on'
  const is_external_event = formData.get('is_external_event') === 'on'
  const external_url = formData.get('external_url') as string
  const ticket_price = Number(formData.get('ticket_price')) || 0
  const table_price = Number(formData.get('table_price')) || 0
  const ticket_capacity = Number(formData.get('ticket_capacity')) || 0
  const is_recursive = formData.get('is_recursive') === 'on'
  const recurrence_end_date = formData.get('recurrence_end_date') as string
  const eventsToInsert = []

  console.log("Attempting Update for ID:", id) // Debug Log

  // 2. Handle Time Safely
  const time_hour = formData.get('time_hour') as string
  const time_minute = formData.get('time_minute') as string
  const time_ampm = formData.get('time_ampm') as string

  let hour = parseInt(time_hour || '12') // Default to 12 if missing
  if (time_ampm === 'PM' && hour !== 12) hour += 12
  if (time_ampm === 'AM' && hour === 12) hour = 0
  const time = `${hour.toString().padStart(2, '0')}:${time_minute || '00'}:00`

  // 2b. Handle End Time (Optional)
  const end_time_hour = formData.get('end_time_hour') as string
  const end_time_minute = formData.get('end_time_minute') as string
  const end_time_ampm = formData.get('end_time_ampm') as string
  let end_time: string | null = null

  if (end_time_hour) { // Only process if hour is selected (or treat partials as invalid? Assuming logic similar to create)
    let eh = parseInt(end_time_hour)
    if (end_time_ampm === 'PM' && eh !== 12) eh += 12
    if (end_time_ampm === 'AM' && eh === 12) eh = 0
    end_time = `${eh.toString().padStart(2, '0')}:${end_time_minute || '00'}:00`
  }

  // 3. Prepare Update Object
  const updates: any = {
    title,
    category,
    date, // Ensure this is not empty
    time,
    end_time,
    tickets: Number(tickets),
    description,
    is_featured,
    is_external_event,
    external_url,
    ticket_price,
    table_price,
    ticket_capacity,
    featured_description: formData.get('featured_description') as string,
    is_sold_out: formData.get('is_sold_out') === 'on'
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

  // 4b. Handle Featured Image Upload
  const featuredImageFile = formData.get('featured_image') as File
  if (featuredImageFile && featuredImageFile.size > 0) {
    const fileExt = featuredImageFile.name.split('.').pop()
    const fileName = `banner_${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, featuredImageFile)

    if (uploadError) {
      console.error("Featured Image Upload Error:", uploadError)
      throw new Error('Featured image upload failed')
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
    updates.featured_image_url = urlData.publicUrl
  }

  // 4c. Handle Image Removals (If requested and no new image uploaded)
  if (formData.get('remove_image') === 'true' && (!imageFile || imageFile.size === 0)) {
    updates.image_url = null
  }

  if (formData.get('remove_featured_image') === 'true' && (!featuredImageFile || featuredImageFile.size === 0)) {
    updates.featured_image_url = null
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
  // 6. Handle Recursive Clone Forward
  if (is_recursive && recurrence_end_date) {
    const start = new Date(date)
    start.setDate(start.getDate() + 7) // Start next week
    const end = new Date(recurrence_end_date)
    const current = new Date(start)

    while (current <= end) {
      const isoDate = current.toISOString().split('T')[0]
      eventsToInsert.push({
        title,
        date: isoDate,
        time,
        end_time,
        tickets: Number(tickets),
        description,
        image_url: updates.image_url, // Inherit potentially updated images
        featured_image_url: updates.featured_image_url,
        is_featured: is_featured,
        category: category,
        is_external_event: is_external_event,
        external_url: external_url,
        ticket_price: ticket_price,
        table_price: table_price,
        ticket_capacity: ticket_capacity
      })
      current.setDate(current.getDate() + 7)
    }

    if (eventsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('events').insert(eventsToInsert)
      if (insertError) {
        console.error("Recursive Insert Error:", insertError)
        // We don't throw here to avoid rolling back the main update if possible, or maybe we should?
        // Let's log and proceed for now.
      }
    }
  }
  // -----------------------

  revalidatePath('/admin/events')
  redirect(`/admin/events?created=${eventsToInsert.length}&title=${encodeURIComponent(title)}`)
}