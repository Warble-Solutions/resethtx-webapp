'use client'

import { useState, useEffect } from 'react'

interface WordCountTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    limit?: number
}

export default function WordCountTextarea({
    limit = 50,
    className = "",
    onChange,
    defaultValue,
    value,
    ...props
}: WordCountTextareaProps) {
    // Determine initial value safely
    const initialVal = (value !== undefined ? value : defaultValue) || ''
    const [text, setText] = useState<string>(String(initialVal))
    const [wordCount, setWordCount] = useState(0)

    // Helper to count words
    const countWords = (str: string) => {
        return str.trim().split(/\s+/).filter(w => w.length > 0).length
    }

    // Initialize count
    useEffect(() => {
        setWordCount(countWords(String(initialVal)))
    }, [initialVal])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value
        setText(newVal)
        setWordCount(countWords(newVal))

        // Bubble up
        if (onChange) {
            onChange(e)
        }
    }

    const isOverLimit = wordCount > limit

    return (
        <div className="flex flex-col gap-1">
            <textarea
                {...props}
                defaultValue={defaultValue}
                value={value}
                onChange={handleChange}
                className={`${className} ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            <div className={`text-xs text-right font-bold transition-colors ${isOverLimit ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                {wordCount}/{limit} words {isOverLimit && '- Too Long'}
            </div>
        </div>
    )
}
