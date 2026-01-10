import { createClient } from '@/utils/supabase/server'
import EditMenuForm from './edit-form'

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const supabase = await createClient()

  // 1. Fetch the existing item
  const { data: item } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single()

  if (!item) {
    return <div className="text-white p-10">Item not found</div>
  }

  return <EditMenuForm item={item} />
}