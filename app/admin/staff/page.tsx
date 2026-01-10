import { createClient } from '@/utils/supabase/server'
import { deleteEmployee } from './create/actions'
import Link from 'next/link'
import SpotlightCard from '@/app/components/SpotlightCard'
import SearchInput from '@/app/components/SearchInput'

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params?.search || ''

  // 1. Build Query
  let dbQuery = supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Search Logic (Name OR Email)
  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
  }

  const { data: employees } = await dbQuery

  // Helper for role badges
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50'
      case 'Manager': return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50'
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600/50'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Staff Management</h1>
          <p className="text-slate-400 mt-1">Manage your team and their permissions.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchInput placeholder="Search name or email..." />
          </div>
          <Link
            href="/admin/staff/create"
            className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-medium py-2 px-5 rounded-lg shadow-lg transition-all whitespace-nowrap flex items-center justify-center"
          >
            + Add Employee
          </Link>
        </div>
      </div>

      {employees?.length === 0 ? (
        <SpotlightCard className="text-center py-20 border-dashed border-slate-700">
          <p className="text-slate-400 mb-2">
            {query ? `No staff found matching "${query}"` : "No employees found."}
          </p>
          {!query && (
            <Link href="/admin/staff/create" className="text-[#D4AF37] font-bold hover:text-[#b5952f]">
              Add your first team member
            </Link>
          )}
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees?.map((emp) => (
            <SpotlightCard key={emp.id} className="flex flex-col gap-4 p-6 group">

              {/* Header: Name & Role */}
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:text-black group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(emp.role)}`}>
                  {emp.role}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">{emp.name}</h3>
                <p className="text-sm text-slate-400">{emp.email}</p>
                {emp.phone && <p className="text-xs text-slate-500 mt-1">{emp.phone}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 border-t border-slate-800 pt-4 mt-auto">
                <Link
                  href={`/admin/staff/${emp.id}/edit`}
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider flex items-center"
                >
                  EDIT
                </Link>
                <form action={deleteEmployee} className="flex">
                  <input type="hidden" name="id" value={emp.id} />
                  <button className="text-xs font-bold text-red-500/70 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center">
                    REMOVE
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