'use client'

import { createClient } from '@/utils/supabase/client'
import { seedTables } from '@/app/actions/seed'
import { useState, useEffect } from 'react'

export default function Page() {
    const [tables, setTables] = useState<any[]>([])

    const fetchTables = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('tables').select('*')
        setTables(data || [])
    }

    useEffect(() => {
        const init = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('tables').select('*')

            if (!data || data.length === 0) {
                await seedTables()
                const { data: newData } = await supabase.from('tables').select('*')
                setTables(newData || [])
            } else {
                setTables(data)
            }
        }
        init()
    }, [])

    const handleSeed = async () => {
        await seedTables()
        fetchTables()
    }

    return (
        <div className="p-10 text-white">
            <h1>Debug Tables</h1>
            <button onClick={handleSeed} className="bg-blue-500 p-2 rounded mb-4">Seed Tables</button>
            <pre>{JSON.stringify(tables, null, 2)}</pre>
        </div>
    )
}
