import { createClient } from '@/utils/supabase/server'
import MessageList from './MessageList'
import SpotlightCard from '@/app/components/SpotlightCard'

export default async function InboxPage() {
  const supabase = await createClient()

  // Fetch data
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Inbox</h1>
          <p className="text-slate-400 mt-1">Read messages from customers.</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-full shadow-lg">
          <span className="text-[#D4AF37] font-bold">{data?.length || 0}</span>
          <span className="text-slate-500 text-sm ml-2">Messages</span>
        </div>
      </div>

      {data?.length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
          <p className="text-slate-400">Your inbox is empty.</p>
        </SpotlightCard>
      ) : (
        // We pass the data to our Client Component
        <div className="space-y-4">
          <MessageList messages={data || []} />
        </div>
      )}
    </div>
  )
}