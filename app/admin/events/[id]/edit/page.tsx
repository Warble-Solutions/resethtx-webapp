import { createClient } from '@/utils/supabase/server'
import { updateEvent } from '../../create/actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SpotlightCard from '@/app/components/SpotlightCard'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Date helpers
  const dateObj = new Date(event.date)
  const dateStr = dateObj.toISOString().split('T')[0]
  let hours24 = dateObj.getHours()
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  const ampm = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12 

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Edit Event</h1>
            <p className="text-slate-400 text-sm mt-1">Update details for {event.title}</p>
        </div>
        <Link href="/admin/events" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form action={updateEvent} className="flex flex-col gap-6">
          
          <input type="hidden" name="id" value={event.id} />

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Event Title</label>
            <input 
              name="title" 
              defaultValue={event.title}
              required 
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Date & Time</label>
              <div className="flex flex-col gap-3">
                <input 
                  name="date" 
                  defaultValue={dateStr}
                  required 
                  type="date" 
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white color-scheme-dark" 
                />

                <div className="flex gap-2">
                  <select name="time_hour" defaultValue={hours12} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>

                  <select name="time_minute" defaultValue={minutes} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                    {['00', '15', '30', '45'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select name="time_ampm" defaultValue={ampm} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white">
                    <option value="PM">PM</option>
                    <option value="AM">AM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Total Tickets</label>
              <input 
                name="tickets" 
                defaultValue={event.tickets_available}
                required 
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white" 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea 
              name="description" 
              defaultValue={event.description || ''}
              rows={4} 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <label className="block text-sm font-bold text-slate-300 mb-2">Update Cover Image (Optional)</label>
            
            {event.image_url && (
              <div className="mb-4 relative w-32 h-20 rounded overflow-hidden border border-slate-700 group">
                <img src={event.image_url} alt="Current" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Current
                </div>
              </div>
            )}

            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              className="block w-full text-sm text-slate-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-500
                cursor-pointer" 
            />
          </div>

          <button type="submit" className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all w-full md:w-auto md:self-end">
            Update Event
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}