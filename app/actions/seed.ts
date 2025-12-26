'use server'

import { createClient } from '@/utils/supabase/server'

export async function seedTables() {
    const supabase = await createClient()

    const tables = [
        { name: 'Table 1', capacity: 2, category: 'Standard', price: 100 },
        { name: 'Table 2', capacity: 2, category: 'Standard', price: 100 },
        { name: 'Table 3', capacity: 4, category: 'Standard', price: 200 },
        { name: 'Table 4', capacity: 4, category: 'Standard', price: 200 },
        { name: 'Table 5', capacity: 6, category: 'Booth', price: 300 },
        { name: 'Table 6', capacity: 6, category: 'Booth', price: 300 },
        { name: 'VIP 1', capacity: 8, category: 'VIP', price: 500 },
        { name: 'VIP 2', capacity: 8, category: 'VIP', price: 500 },
        { name: 'VIP 3', capacity: 10, category: 'VIP', price: 750 },
        { name: 'Sky 1', capacity: 12, category: 'Sky Lounge', price: 1000 },
    ]

    const { error } = await supabase.from('tables').insert(tables)

    if (error) {
        console.error('Error seeding tables:', error)
        return { success: false, message: error.message }
    }

    return { success: true, message: 'Tables seeded successfully!' }
}
