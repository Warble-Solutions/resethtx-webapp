'use client'

import { useState } from 'react'
import { createTable, updateTable, deleteTable, TableData } from '@/app/actions/tables'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

interface TableWithId extends TableData {
    id: string
}

export default function TableManagerClient({ initialTables }: { initialTables: TableWithId[] }) {
    const [tables, setTables] = useState<TableWithId[]>(initialTables)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTable, setEditingTable] = useState<TableWithId | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState<TableData>({
        name: '',
        category: 'Lounge',
        capacity: 4,
        x: 50,
        y: 50
    })

    const handleOpenModal = (table?: TableWithId) => {
        if (table) {
            setEditingTable(table)
            setFormData({
                name: table.name,
                category: table.category,
                capacity: table.capacity,
                x: table.x || 0,
                y: table.y || 0
            })
        } else {
            setEditingTable(null)
            setFormData({
                name: '',
                category: 'Lounge',
                capacity: 4,
                x: 50,
                y: 50
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (editingTable) {
                await updateTable(editingTable.id, formData)
            } else {
                await createTable(formData)
            }
            // Simple optimistic update or refresh could happen here, 
            // but for now relying on server action revalidate and parent refresh might be trickier in client component entirely.
            // Actually, server action revalidatePath refreshes the SC, but this Client Component needs to be smart or refresh router.
            // For simplicity in this "mocked" env, I'll reload page or trust nextjs router refresh if injected.
            // A hard reload is safest ensures data sync.
            window.location.reload()
        } catch (error) {
            alert('Operation failed')
        } finally {
            setIsLoading(false)
            setIsModalOpen(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this table?')) return
        setIsLoading(true)
        await deleteTable(id)
        window.location.reload()
    }

    const categories = ['Lounge', 'Dance Floor', 'Dj Booth', 'Patio', 'Table Top']

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Floor Plan Manager</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#D4AF37] hover:bg-white text-black font-bold py-3 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                    <Plus size={18} /> Add Table
                </button>
            </div>

            {/* List View */}
            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-4">Table Name</div>
                    <div className="col-span-3">Category</div>
                    <div className="col-span-2">Capacity</div>
                    <div className="col-span-2">Position (X,Y)</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {tables.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No tables found. Create one to get started.
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {tables.map(table => (
                            <div key={table.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                                <div className="col-span-4 font-bold text-white text-lg">{table.name}</div>
                                <div className="col-span-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${table.category === 'Lounge' ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                                            table.category === 'Patio' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                table.category === 'Dance Floor' ? 'bg-pink-900/30 text-pink-400 border-pink-800' :
                                                    'bg-blue-900/30 text-blue-400 border-blue-800'
                                        }`}>
                                        {table.category}
                                    </span>
                                </div>
                                <div className="col-span-2 text-slate-300">{table.capacity} People</div>
                                <div className="col-span-2 text-slate-500 text-xs font-mono">
                                    {table.x}%, {table.y}%
                                </div>
                                <div className="col-span-1 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenModal(table)}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(table.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#111]">
                            <h3 className="text-xl font-bold text-white">
                                {editingTable ? 'Edit Table' : 'Add New Table'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-slate-400 text-xs font-bold uppercase">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#111] border border-white/10 rounded p-3 text-white focus:border-[#D4AF37] outline-none"
                                    placeholder="e.g. VIP 1"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-xs font-bold uppercase">Category</label>
                                    <select
                                        className="w-full bg-[#111] border border-white/10 rounded p-3 text-white focus:border-[#D4AF37] outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-xs font-bold uppercase">Capacity</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full bg-[#111] border border-white/10 rounded p-3 text-white focus:border-[#D4AF37] outline-none"
                                        value={formData.capacity}
                                        onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-xs font-bold uppercase">Pos X (%)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#111] border border-white/10 rounded p-3 text-white focus:border-[#D4AF37] outline-none"
                                        value={formData.x}
                                        onChange={e => setFormData({ ...formData, x: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-xs font-bold uppercase">Pos Y (%)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#111] border border-white/10 rounded p-3 text-white focus:border-[#D4AF37] outline-none"
                                        value={formData.y}
                                        onChange={e => setFormData({ ...formData, y: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-400 hover:text-white font-bold border border-white/10 rounded">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold rounded">
                                    {isLoading ? 'Saving...' : 'Save Table'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
