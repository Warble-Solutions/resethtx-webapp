import { createClient } from '@/utils/supabase/server'
import { updateEmployee } from '../../create/actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SpotlightCard from '@/app/components/SpotlightCard'

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch existing employee
  const { data: employee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !employee) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Edit Employee</h1>
            <p className="text-slate-400 text-sm mt-1">Update profile for {employee.name}</p>
        </div>
        <Link href="/admin/staff" className="text-slate-400 hover:text-white hover:underline">
          Cancel
        </Link>
      </div>

      <SpotlightCard className="p-8">
        <form action={updateEmployee} className="flex flex-col gap-6">
          
          <input type="hidden" name="id" value={employee.id} />

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
            <input 
              name="name" 
              defaultValue={employee.name}
              required 
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white" 
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
            <input 
              name="email" 
              defaultValue={employee.email}
              required 
              type="email" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white" 
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
            <input 
              name="phone" 
              defaultValue={employee.phone || ''}
              type="tel" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white" 
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Role</label>
            <div className="relative">
                <select 
                    name="role" 
                    defaultValue={employee.role}
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    ▼
                </div>
            </div>
          </div>

          <button type="submit" className="mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/20 transition-all w-full md:w-auto md:self-end">
            Update Employee
          </button>
        </form>
      </SpotlightCard>
    </div>
  )
}