'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface TableData {
    name: string
    category: string
    capacity: number
    x: number
    y: number
    status?: 'Available' | 'Occupied' | 'Reserved'
}

// CREATE
export async function createTable(data: TableData) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('tables')
            .insert(data)

        if (error) throw error

        revalidatePath('/admin/tables')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating table:', error)
        return { success: false, error: error.message }
    }
}

// UPDATE
export async function updateTable(id: string, data: Partial<TableData>) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('tables')
            .update(data)
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/tables')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating table:', error)
        return { success: false, error: error.message }
    }
}

// DELETE
export async function deleteTable(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('tables')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/tables')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting table:', error)
        return { success: false, error: error.message }
    }
}
