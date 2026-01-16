import { createClient } from '@/utils/supabase/server'
import { deletePromo, togglePromoStatus } from './actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function PromosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''

  // 1. Build Query
  let dbQuery = supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Search by Code
  if (query) {
    dbQuery = dbQuery.ilike('code', `%${query}%`)
  }

  const { data: promos } = await dbQuery

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Promo Codes</h1>
          <p className="text-slate-400 mt-1">Manage discounts and special offers.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchInput placeholder="Search codes..." />
          </div>
          <Link
            href="/admin/promos/create"
            className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-medium py-2 px-5 rounded-lg shadow-lg transition-all whitespace-nowrap flex items-center justify-center"
          >
            + Add Code
          </Link>
        </div>
      </div>

      {promos?.length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
          <p className="text-slate-400 mb-2">
            {query ? `No codes found matching "${query}"` : "No active promo codes."}
          </p>
          {!query && (
            <Link href="/admin/promos/create" className="text-[#D4AF37] font-bold hover:text-[#b5952f]">
              Create your first discount
            </Link>
          )}
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos?.map((promo) => (
            <SpotlightCard key={promo.id} className="flex flex-col p-6 group">

              {/* Header: Code & Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="font-mono text-2xl font-bold text-white tracking-wider border-b-2 border-dashed border-slate-600 pb-1">
                  {promo.code}
                </div>
                {promo.is_active ? (
                  <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    Active
                  </span>
                ) : (
                  <span className="bg-slate-700/50 text-slate-400 border border-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Inactive
                  </span>
                )}
              </div>

              {/* Discount Amount */}
              <div className="flex-1 mb-6">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Discount Value</p>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] to-[#F7E7CE]">
                  {promo.discount}% OFF
                </div>
              </div>

              {/* Expiration */}
              <div className="flex-1 mb-6">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Expires</p>
                <div className="text-lg font-mono text-white">
                  {promo.expires_at
                    ? new Date(promo.expires_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
                    : 'Never'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 border-t border-slate-800 pt-4 mt-auto">
                <form action={togglePromoStatus} className="flex">
                  <input type="hidden" name="id" value={promo.id} />
                  <input type="hidden" name="current_status" value={String(promo.is_active)} />
                  <button className={`text-xs font-bold uppercase tracking-wider transition-colors flex items-center ${promo.is_active ? 'text-[#D4AF37] hover:text-white' : 'text-green-400 hover:text-green-300'}`}>
                    {promo.is_active ? 'DISABLE' : 'ENABLE'}
                  </button>
                </form>

                <Link
                  href={`/admin/promos/${promo.id}`}
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider flex items-center"
                >
                  EDIT
                </Link>

                <form action={deletePromo} className="flex ml-auto">
                  <input type="hidden" name="id" value={promo.id} />
                  <button className="text-xs font-bold text-red-500/70 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center">
                    DELETE
                  </button>
                </form>
              </div>

            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  )
}