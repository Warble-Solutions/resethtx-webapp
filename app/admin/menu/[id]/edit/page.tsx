import { createClient } from '@/utils/supabase/server'
import { updateMenuItem } from '../../create/actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SpotlightCard from '@/app/components/SpotlightCard'

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch item
  const { data: item, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !item) {
    notFound()
  }

  const categories = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Sides']

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Edit Menu Item</h1>
            <p className="text-slate-400 text-sm mt-1">Update details for {item.name}</p>
        </div>
        <Link href="/admin/menu" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form action={updateMenuItem} className="flex flex-col gap-6">
          
          <input type="hidden" name="id" value={item.id} />

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Item Name</label>
            <input 
              name="name" 
              defaultValue={item.name}
              required 
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Price ($)</label>
              <input 
                name="price" 
                defaultValue={item.price}
                required 
                type="number" 
                step="0.01" 
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white" 
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
              <select 
                name="category" 
                defaultValue={item.category}
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea 
              name="description" 
              defaultValue={item.description || ''}
              rows={3} 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
            ></textarea>
          </div>

          {/* Image Update */}
          <div className="p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <label className="block text-sm font-bold text-slate-300 mb-2">Update Photo (Optional)</label>
            {item.image_url && (
              <div className="mb-3 relative w-20 h-20 rounded overflow-hidden border border-slate-700">
                <img src={item.image_url} alt="Current" className="w-full h-full object-cover opacity-80" />
              </div>
            )}
            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" 
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <input 
              type="checkbox" 
              name="is_available" 
              defaultChecked={item.is_available} 
              className="w-5 h-5 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-blue-500 focus:ring-offset-slate-900" 
            />
            <div>
              <label className="block text-sm font-bold text-white">Available to Order</label>
              <p className="text-xs text-slate-400">Uncheck to mark as "Sold Out".</p>
            </div>
          </div>

          <button type="submit" className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all md:self-end w-full md:w-auto">
            Update Item
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}