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

/**
 * Checks if an event has already passed or ended based on Houston (Central) local time.
 */
export const isEventPastOrEnded = (
    dateStr: string | null | undefined,
    timeStr?: string | null,
    endTimeStr?: string | null
): boolean => {
    if (!dateStr) return false
    const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr

    // Current date and time in Houston (Central Time)
    const nowHoustonStr = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
    const nowHouston = new Date(nowHoustonStr)
    const todayHoustonStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })

    // If date is before today in Houston, it has ended
    if (datePart < todayHoustonStr) {
        return true
    }

    // If date is today in Houston, check if time has passed
    if (datePart === todayHoustonStr) {
        // If end_time is provided (e.g. 20:00:00)
        if (endTimeStr && endTimeStr !== '00:00:00') {
            const [endH, endM] = endTimeStr.split(':').map(Number)
            if (endH >= 12) {
                const eventEndTime = new Date(nowHouston.getFullYear(), nowHouston.getMonth(), nowHouston.getDate(), endH, endM || 0)
                if (nowHouston.getTime() > eventEndTime.getTime()) {
                    return true
                }
            }
        }

        // Check if event start time has passed
        if (timeStr) {
            const [startH, startM] = timeStr.split(':').map(Number)
            const eventStartTime = new Date(nowHouston.getFullYear(), nowHouston.getMonth(), nowHouston.getDate(), startH, startM || 0)
            if (nowHouston.getTime() > eventStartTime.getTime()) {
                return true
            }
        }
    }

    return false
}

