'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Add New Employee
export async function createEmployee(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const role = formData.get('role') as string

  const { error } = await supabase
    .from('employees')
    .insert({
      name,
      email,
      phone,
      role
    })

  if (error) {
    console.error('Error creating employee:', error)
    throw new Error('Failed to create employee (Email might already exist)')
  }

  redirect('/admin/staff')
}

// 2. Delete Employee
export async function deleteEmployee(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete error:', error)
    throw new Error('Failed to delete employee')
  }

  revalidatePath('/admin/staff')
}

export async function updateEmployee(formData: FormData) {
  const supabase = await createClient()

  // 1. Get Data
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const role = formData.get('role') as string

  // 2. Update Database
  const { error } = await supabase
    .from('employees')
    .update({
      name,
      email,
      phone,
      role
    })
    .eq('id', id)

  if (error) {
    console.error('Update Error:', error)
    throw new Error('Failed to update employee')
  }

  // 3. Redirect
  redirect('/admin/staff')
}