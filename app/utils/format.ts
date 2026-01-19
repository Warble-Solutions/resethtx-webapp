export const formatTime = (timeString: string | null): string => {
    if (!timeString) return '9:00 PM' // Default fallback
    const [h, m] = timeString.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    return `${displayHour}:${m} ${ampm}`
}

export const formatEventTime = (startTime: string | null, endTime?: string | null): string => {
    const start = formatTime(startTime)
    if (endTime) {
        return `${start} - ${formatTime(endTime)}`
    }
    return start
}
