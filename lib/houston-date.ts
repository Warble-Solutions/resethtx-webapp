// ─── Houston (America/Chicago) date helpers ──────────────────────────────────
// Reset HTX operates in Houston and event dates are stored as plain calendar
// dates (e.g. "2026-10-07T00:00:00", no timezone). These helpers keep all
// date logic anchored to Houston, regardless of the server/browser timezone.

export const VENUE_TIMEZONE = 'America/Chicago'

/** Days the venue is closed (0 = Sun, 1 = Mon, 2 = Tue, ...) */
export const CLOSED_DAYS = [1, 2]

/** Today's date in Houston as "YYYY-MM-DD" */
export function getHoustonToday(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: VENUE_TIMEZONE })
}

/** Day of week (0-6) for a "YYYY-MM-DD" string — timezone independent */
export function getDayOfWeek(dateStr: string): number {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** Add days to a "YYYY-MM-DD" string — timezone independent */
export function addDays(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export function isClosedDay(dateStr: string): boolean {
    return CLOSED_DAYS.includes(getDayOfWeek(dateStr))
}

/** First open day on/after the given date (skips Mon/Tue) */
export function getNextOpenDate(dateStr: string = getHoustonToday()): string {
    let d = dateStr
    while (isClosedDay(d)) d = addDays(d, 1)
    return d
}
