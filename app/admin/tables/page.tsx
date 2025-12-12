import { createClient } from '@/utils/supabase/server'
import { deleteTable, updateTableStatus } from './create/actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function TablesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''

  // 1. Fetch tables
  let dbQuery = supabase
    .from('tables')
    .select('*')
    .order('table_number', { ascending: true })

  if (query) {
    dbQuery = dbQuery.eq('table_number', query)
  }

  const { data: tables } = await dbQuery

  // Helper for styles
  const getStatusConfig = (status: string) => {
    const s = status?.trim().toLowerCase() || 'available'
    switch (s) {
      case 'available': 
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20',
          icon: 'bg-emerald-500',
          label: 'Available'
        }
      case 'reserved': 
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
          icon: 'bg-amber-500',
          label: 'Reserved'
        }
      case 'occupied': 
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: 'bg-red-500',
          label: 'Occupied'
        }
      default: 
        return {
          bg: 'bg-slate-800',
          text: 'text-slate-400',
          border: 'border-slate-700',
          icon: 'bg-slate-500',
          label: 'Unknown'
        }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Floor Plan</h1>
          <p className="text-slate-400 mt-1">Manage table availability in real-time.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="w-full md:w-48">
                <SearchInput placeholder="Find table #..." />
            </div>
            
            <Link 
              href="/admin/tables/create" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center justify-center text-sm"
            >
              + Add Table
            </Link>
        </div>
      </div>

      {tables?.length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
           <p className="text-slate-400 mb-4 text-lg">
            {query ? `No table found with number "${query}"` : "No tables set up yet."}
          </p>
          {!query && (
             <Link href="/admin/tables/create" className="text-blue-400 font-semibold hover:text-blue-300">
                Create your first table
            </Link>
          )}
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tables?.map((table) => {
            const style = getStatusConfig(table.status)
            
            return (
              <SpotlightCard 
                key={table.id} 
                className="flex flex-col p-0 overflow-hidden group h-full"
              >
                {/* 1. Header Row */}
                <div className="p-4 flex justify-between items-start border-b border-slate-800/50">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                        {table.seats} Seats
                    </span>
                    {/* Status Badge */}
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
                        {style.label}
                    </span>
                </div>

                {/* 2. Main Visual Area */}
                <div className="flex-1 flex flex-col items-center justify-center py-8 relative">
                    {/* Glowing Background Ring */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${style.bg.replace('/10','/30')}`} />
                    
                    {/* Table Icon */}
                    <div className="relative w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center shadow-2xl">
                        <span className="text-3xl font-black text-white z-10">
                            {table.table_number}
                        </span>
                        {/* Status Indicator Dot */}
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-900 ${style.icon}`} />
                    </div>
                </div>

                {/* 3. Action Toolbar (Segmented Control) */}
                <div className="bg-slate-900/50 border-t border-slate-800 p-2 grid grid-cols-4 gap-1">
                  
                  {/* Status Toggles */}
                  <form action={updateTableStatus} className="contents">
                    <input type="hidden" name="id" value={table.id} />
                    <input type="hidden" name="new_status" value="Available" />
                    <button title="Available" className="h-8 rounded bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-500 transition-colors flex items-center justify-center">
                       ✓
                    </button>
                  </form>

                  <form action={updateTableStatus} className="contents">
                    <input type="hidden" name="id" value={table.id} />
                    <input type="hidden" name="new_status" value="Reserved" />
                    <button title="Reserved" className="h-8 rounded bg-slate-800 hover:bg-amber-600/20 hover:text-amber-400 text-slate-500 transition-colors flex items-center justify-center">
                       R
                    </button>
                  </form>

                  <form action={updateTableStatus} className="contents">
                    <input type="hidden" name="id" value={table.id} />
                    <input type="hidden" name="new_status" value="Occupied" />
                    <button title="Occupied" className="h-8 rounded bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-500 transition-colors flex items-center justify-center">
                       O
                    </button>
                  </form>

                  {/* Delete Button (Trash Icon) */}
                  <form action={deleteTable} className="contents">
                    <input type="hidden" name="id" value={table.id} />
                    <button 
                        title="Delete Table"
                        className="h-8 rounded bg-slate-800 hover:bg-red-950 hover:text-red-500 text-slate-600 transition-colors flex items-center justify-center border-l border-slate-800 ml-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  </form>

                </div>
              </SpotlightCard>
            )
          })}
        </div>
      )}
    </div>
  )
}