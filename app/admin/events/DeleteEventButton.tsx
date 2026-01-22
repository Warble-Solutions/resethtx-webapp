'use client'

import { deleteEvent } from './create/actions'

export default function DeleteEventButton({ id }: { id: string }) {
    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this past event? This cannot be undone.')) {
            const formData = new FormData()
            formData.append('id', id)
            await deleteEvent(formData)
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
            DELETE
        </button>
    )
}
