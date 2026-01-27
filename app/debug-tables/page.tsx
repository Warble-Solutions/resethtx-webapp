'use client'

import { useState } from 'react'
import { getNextEvent, getEventById } from '@/app/actions/event-booking'

export default function DebugPage() {
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const testNextEvent = async () => {
        setLoading(true)
        try {
            console.log('Calling getNextEvent...')
            const res = await getNextEvent()
            console.log('Result:', res)
            setResult({ action: 'getNextEvent', ...res })
        } catch (error: any) {
            console.error('Error:', error)
            setResult({ error: error.message, stack: error.stack })
        }
        setLoading(false)
    }

    const testGetEventById = async () => {
        const id = prompt('Enter Event ID:')
        if (!id) return
        setLoading(true)
        try {
            console.log(`Calling getEventById(${id})...`)
            const res = await getEventById(id)
            console.log('Result:', res)
            setResult({ action: 'getEventById', ...res })
        } catch (error: any) {
            console.error('Error:', error)
            setResult({ error: error.message, stack: error.stack })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-black text-white p-10 font-mono">
            <h1 className="text-2xl mb-6 text-[#D4AF37]">Server Action Debugger</h1>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={testNextEvent}
                    className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded border border-white/10"
                >
                    Test getNextEvent()
                </button>
                <button
                    onClick={testGetEventById}
                    className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded border border-white/10"
                >
                    Test getEventById(id)
                </button>
            </div>

            {loading && <div className="text-yellow-500 mb-4">Loading...</div>}

            <div className="bg-zinc-900 p-4 rounded border border-white/10 overflow-auto max-h-[600px]">
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
        </div>
    )
}
