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
  const category = formData.get('category') as string || 'Nightlife'
  const date = formData.get('date') as string
  const tickets = formData.get('tickets')
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File
  const featuredImageFile = formData.get('featured_image') as File
  const is_featured = formData.get('is_featured') === 'on'
  const is_external_event = formData.get('is_external_event') === 'on'
  const external_url = formData.get('external_url') as string
  const ticket_price = Number(formData.get('ticket_price')) || 0
  const table_price = Number(formData.get('table_price')) || 0
  const ticket_capacity = Number(formData.get('ticket_capacity')) || 0
  const featured_description = formData.get('featured_description') as string

  // 2. Handle Time Construction
  const time_hour = formData.get('time_hour') as string
  const time_minute = formData.get('time_minute') as string
  const time_ampm = formData.get('time_ampm') as string

  let hour = parseInt(time_hour)
  if (time_ampm === 'PM' && hour !== 12) hour += 12
  if (time_ampm === 'AM' && hour === 12) hour = 0
  const time = `${hour.toString().padStart(2, '0')}:${time_minute}:00`

  // 2b. Handle End Time Construction (Optional)
  const end_time_hour = formData.get('end_time_hour') as string
  const end_time_minute = formData.get('end_time_minute') as string
  const end_time_ampm = formData.get('end_time_ampm') as string
  let end_time: string | null = null

  if (end_time_hour && end_time_minute && end_time_ampm) {
    let eh = parseInt(end_time_hour)
    if (end_time_ampm === 'PM' && eh !== 12) eh += 12
    if (end_time_ampm === 'AM' && eh === 12) eh = 0
    end_time = `${eh.toString().padStart(2, '0')}:${end_time_minute}:00`
  }

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

  // 3b. Upload Featured Image (if exists)
  let featuredImageUrl = null
  if (featuredImageFile && featuredImageFile.size > 0) {
    const fileExt = featuredImageFile.name.split('.').pop()
    const fileName = `banner_${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, featuredImageFile)

    if (uploadError) {
      console.error('Featured Image Upload Error:', uploadError)
      throw new Error('Featured image upload failed')
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
    featuredImageUrl = urlData.publicUrl
  }

  // 4. Insert into DB
  // 4. Handle Recurrence & Insertion
  const is_recurring = formData.get('is_recurring') === 'on'
  const recurrence_end_date = formData.get('recurrence_end_date') as string

  const eventsToInsert = []

  // Helper to construct event object
  const createEventObject = (eventDate: string) => ({
    title,
    date: eventDate,
    time,
    end_time,
    tickets: Number(tickets),
    description,
    featured_description,
    image_url: publicUrl,
    featured_image_url: featuredImageUrl,
    is_featured: is_featured,
    is_external_event: is_external_event,
    external_url: external_url,
    ticket_price: ticket_price,
    table_price: table_price,
    ticket_capacity: ticket_capacity,
    category: category,
    is_sold_out: formData.get('is_sold_out') === 'on'
  })

  if (is_recurring && recurrence_end_date) {
    const start = new Date(date)
    const end = new Date(recurrence_end_date)
    const current = new Date(start)

    // Loop until we pass the end date
    while (current <= end) {
      // Format as YYYY-MM-DD
      const isoDate = current.toISOString().split('T')[0]
      eventsToInsert.push(createEventObject(isoDate))

      // Add 7 days
      current.setDate(current.getDate() + 7)
    }
  } else {
    // Single Event
    eventsToInsert.push(createEventObject(date))
  }

  const { error } = await supabase.from('events').insert(eventsToInsert)

  if (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create event')
  }

  revalidatePath('/admin/events')
  redirect(`/admin/events?created=${eventsToInsert.length}&title=${encodeURIComponent(title)}`)
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
  revalidatePath('/admin/events/archive')
}