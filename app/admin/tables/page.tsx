import { createClient } from '@/utils/supabase/server'
import TableManagerClient from './TableManagerClient'

export const revalidate = 0 // Ensure fresh data on every load

export default async function TablesPage() {
  const supabase = await createClient()

  // Fetch tables with new schema fields
  const { data: tables } = await supabase
    .from('tables')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <TableManagerClient initialTables={tables || []} />
    </div>
  )
}