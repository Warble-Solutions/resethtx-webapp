
/* eslint-disable @next/next/no-img-element */
import { createClient } from '@/utils/supabase/server'
import { deleteMenuItem } from './create/actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''

  let dbQuery = supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }

  interface MenuItem {
    id: string;
    category: string;
    name: string;
    description: string | null;
    price: number | string;
    image_url: string | null;
    is_available: boolean;
    [key: string]: unknown;
  }

  const { data: items } = await dbQuery

  const categories: Record<string, MenuItem[]> = {}
  items?.forEach((item: MenuItem) => {
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
          <div className="w-full md:w-64">
            <SearchInput placeholder="Search items..." />
          </div>

          <Link
            href="/admin/menu/create"
            className="bg-[#D4AF37] hover:bg-white text-black font-bold py-2 px-5 rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all whitespace-nowrap flex items-center justify-center"
          >
            + Add Item
          </Link>
        </div>
      </div>

      {Object.keys(categories).length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
          <p className="text-slate-400 mb-2">
            {query ? `No items found matching "${query}"` : "Your menu is empty."}
          </p>
          {!query && (
            <Link href="/admin/menu/create" className="text-[#D4AF37] font-bold hover:text-white">
              Add your first item
            </Link>
          )}
        </SpotlightCard>
      ) : (
        <div className="space-y-12">
          {Object.entries(categories).map(([category, categoryItems]) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-6 uppercase tracking-wide flex items-center gap-3">
                <span className="w-2 h-8 bg-[#D4AF37] rounded-full block shadow-lg shadow-[#D4AF37]/50"></span>
                {category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <SpotlightCard key={item.id} className="flex flex-col gap-4 p-5 group h-full">

                    {/* Image & Price */}
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
                        <span className="block text-xl font-bold text-[#D4AF37] drop-shadow-sm">{item.price}</span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-1">{item.name}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{item.description || "No description."}</p>
                    </div>

                    {/* --- ACTIONS SECTION (Updated) --- */}
                    <div className="flex items-center gap-6 border-t border-slate-800 pt-4 mt-auto">
                      {/* EDIT BUTTON */}
                      <Link
                        href={`/admin/menu/${item.id}/edit`}
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider flex items-center"
                      >
                        EDIT
                      </Link>

                      {/* DELETE BUTTON */}
                      <form action={deleteMenuItem} className="flex ml-auto">
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-wider flex items-center">
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