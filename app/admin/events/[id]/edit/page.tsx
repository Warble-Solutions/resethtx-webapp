import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditEventForm from '../edit-form'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch the event
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  return <EditEventForm event={event} />
}