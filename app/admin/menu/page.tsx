import { createClient } from '@/utils/supabase/server'
import { deleteMenuItem } from './create/actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput' // Import it

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }> // Allow receiving search params
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''

  // 1. Fetch menu items with optional search filter
  let dbQuery = supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })

  // If searching, filter by name (case-insensitive)
  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  const { data: items } = await dbQuery

  // 2. Group items (Same as before)
  const categories: Record<string, any[]> = {}
  items?.forEach((item) => {
    if (!categories[item.category]) categories[item.category] = []
    categories[item.category].push(item)
  })

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white">Menu</h1>
           <p className="text-slate-400 mt-1">Manage your food and drinks.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            {/* SEARCH BAR ADDED HERE */}
            <div className="w-full md:w-64">
                <SearchInput placeholder="Search items..." />
            </div>

            <Link 
            href="/admin/menu/create" 
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-lg shadow-lg shadow-blue-500/20 transition-all whitespace-nowrap flex items-center justify-center"
            >
            + Add Item
            </Link>
        </div>
      </div>

      {/* Content */}
      {Object.keys(categories).length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
          <p className="text-slate-400 mb-2">
            {query ? `No items found matching "${query}"` : "Your menu is empty."}
          </p>
          {!query && (
             <Link href="/admin/menu/create" className="text-blue-400 font-bold hover:text-blue-300">
                Add your first item
            </Link>
          )}
        </SpotlightCard>
      ) : (
        // ... (The rest of your Grid/Card code stays exactly the same)
        <div className="space-y-12">
            {/* Paste the rest of the existing code here... */}
             {Object.entries(categories).map(([category, categoryItems]) => (
                /* ... existing loop code ... */
                <div key={category}>
                  {/* Category Title */}
                  <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-6 uppercase tracking-wide flex items-center gap-3">
                    <span className="w-2 h-8 bg-linear-to-b from-blue-500 to-purple-500 rounded-full block shadow-lg shadow-purple-500/50"></span>
                    {category}
                  </h2>
    
                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item) => (
                      <SpotlightCard key={item.id} className="flex flex-col gap-4 p-5 group h-full">
                        
                        {/* Header: Image & Price */}
                        <div className="flex justify-between items-start gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 relative shrink-0">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-600 text-xs">No Photo</div>
                                )}
                                {!item.is_available && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[1px]">
                                        <span className="text-red-400 text-[10px] font-bold uppercase border border-red-500/50 px-1 rounded bg-black/50">Sold Out</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-emerald-400 drop-shadow-sm">${item.price}</span>
                            </div>
                        </div>
    
                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-1">{item.name}</h3>
                            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{item.description || "No description."}</p>
                        </div>
    
                        {/* Actions - FIXED ALIGNMENT */}
                        <div className="flex items-center gap-6 border-t border-slate-800 pt-4 mt-auto">
                            <Link 
                                href={`/admin/menu/${item.id}/edit`}
                                className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider flex items-center"
                            >
                                EDIT
                            </Link>
                            <form action={deleteMenuItem} className="flex">
                                <input type="hidden" name="id" value={item.id} />
                                <button type="submit" className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center">
                                    DELETE
                                </button>
                            </form>
                        </div>
    
                      </SpotlightCard>
                    ))}
                  </div>
                </div>
             ))}
        </div>
      )}
    </div>
  )
}