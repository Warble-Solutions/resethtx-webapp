'use client'

import { useState } from 'react'
import { markAsRead, deleteSubmission } from './actions'
import { updateMessageRemark } from '@/app/actions/contact'
import SpotlightCard from '@/app/components/SpotlightCard'
import { motion, AnimatePresence } from 'framer-motion'

interface Submission {
    id: string
    first_name: string
    last_name: string
    email: string
    message: string
    is_read: boolean
    inquiry_type?: string
    created_at: string
    remarks?: string | null
}

export default function MessageList({ messages }: { messages: Submission[] }) {
    const [selectedMessage, setSelectedMessage] = useState<Submission | null>(null)

    return (
        <>
            {/* --- THE LIST --- */}
            {messages.map((msg) => (
                <SpotlightCard
                    key={msg.id}
                    className={`
                group cursor-pointer transition-all duration-300
                ${!msg.is_read ? 'border-l-4 border-l-blue-500 bg-blue-500/5' : 'opacity-70 hover:opacity-100'}
            `}
                    onClick={() => setSelectedMessage(msg)}
                >
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* Avatar / Icon */}
                        <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-colors
                    ${!msg.is_read ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500'}
                `}>
                            {msg.first_name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`text-lg text-white group-hover:text-blue-400 transition-colors truncate pr-4 ${!msg.is_read ? 'font-bold' : 'font-medium'}`}>
                                    {msg.first_name} {msg.last_name}
                                    {!msg.is_read && <span className="ml-3 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></span>}
                                </h3>
                                <span className="text-xs text-slate-500 whitespace-nowrap font-mono">
                                    {new Date(msg.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </span>
                            </div>

                            <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                                <span className="text-slate-500">{msg.email}</span>
                                {msg.inquiry_type && <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-400 border border-slate-700">{msg.inquiry_type}</span>}
                            </p>

                            <p className={`text-sm line-clamp-2 leading-relaxed ${!msg.is_read ? 'text-slate-200' : 'text-slate-500'}`}>
                                {msg.message}
                            </p>
                        </div>

                        {/* Actions (Hidden until hover on desktop) */}
                        <div className="flex md:flex-col gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity md:ml-4">
                            {/* We stopPropagation so clicking delete doesn't open the popup */}
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm('Delete this message?')) return;
                                    const formData = new FormData();
                                    formData.append('id', msg.id);
                                    await deleteSubmission(formData);
                                }}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>

                            {!msg.is_read && (
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const formData = new FormData();
                                        formData.append('id', msg.id);
                                        await markAsRead(formData);
                                    }}
                                    className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    title="Mark Read"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </SpotlightCard>
            ))}


            {/* --- THE DARK POPUP MODAL --- */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-950/50 px-8 py-6 border-b border-slate-800 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-2xl text-white mb-1">{selectedMessage.first_name} {selectedMessage.last_name}</h3>
                                    <p className="text-sm text-blue-400 font-mono">{selectedMessage.email}</p>
                                    {selectedMessage.inquiry_type && <span className="inline-block mt-2 bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-400 border border-slate-700">{selectedMessage.inquiry_type}</span>}
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg font-light">
                                    {selectedMessage.message}
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 font-mono border-t border-slate-800 pt-6">
                                    <span>RECEIVED:</span>
                                    <span className="text-slate-400">{new Date(selectedMessage.created_at).toLocaleString()}</span>
                                </div>

                                {/* ADMIN REMARKS SECTION */}
                                <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                                    <h4 className="text-yellow-500/80 text-xs font-bold uppercase tracking-wider mb-2">Internal Admin Remarks</h4>
                                    <textarea
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-yellow-500/40 transition-colors min-h-[80px]"
                                        placeholder="Add internal notes about this inquiry..."
                                        value={selectedMessage.remarks || ''}
                                        onChange={(e) => setSelectedMessage({ ...selectedMessage, remarks: e.target.value })}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={async () => {
                                                if (!selectedMessage) return
                                                const res = await updateMessageRemark(selectedMessage.id, selectedMessage.remarks || '')
                                                if (res.success) {
                                                    // Optional: Show a toast or feedback
                                                    // Update the main list so it persists if we close/reopen
                                                    // Since we modify 'selectedMessage' in place, we should also update the parent list if possible, or just rely on re-fetch.
                                                    // For now, let's just show visual feedback or assume it worked.
                                                    alert('Remark saved successfully')
                                                } else {
                                                    alert('Failed to save remark')
                                                }
                                            }}
                                            className="text-xs font-bold text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 px-3 py-1.5 rounded transition-colors"
                                        >
                                            Save Remark
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-slate-950/30 px-8 py-5 border-t border-slate-800 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"
                                >
                                    Close
                                </button>

                                {!selectedMessage.is_read && (
                                    <button
                                        onClick={async () => {
                                            const formData = new FormData();
                                            formData.append('id', selectedMessage.id);
                                            await markAsRead(formData);
                                            setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null);
                                        }}
                                        className="px-5 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all font-bold text-sm shadow-lg shadow-purple-900/20"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}