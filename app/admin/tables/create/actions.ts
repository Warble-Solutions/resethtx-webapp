'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Create a new table
export async function createTable(formData: FormData) {
  const supabase = await createClient()

  const tableNumber = formData.get('table_number')
  const seats = formData.get('seats')

  const { error } = await supabase
    .from('tables')
    .insert({
      table_number: Number(tableNumber),
      seats: Number(seats),
      status: 'Available' // Default status
    })

  if (error) throw new Error('Failed to create table: ' + error.message)

  redirect('/admin/tables')
}