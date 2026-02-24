/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';

const MAX_TABLES = 10; // Hard limit as per requirements

export async function checkTableAvailability(eventId: string) {
    const supabase = await createClient();

    try {
        // Query ticket_purchases for confirmed table reservations
        // We look for 'paid' status and ticket_type related to tables
        const { count, error } = await supabase
            .from('ticket_purchases')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .in('ticket_type', ['table', 'table_reservation'])
            .eq('status', 'paid');

        if (error) {
            console.error('Error checking table availability:', error);
            // Fail safe: assume available if DB error, or block? 
            // Blocking is safer to prevent overbooking during outages.
            return { sold: 0, available: 0, total: MAX_TABLES, error: error.message };
        }

        const sold = count || 0;
        const available = Math.max(0, MAX_TABLES - sold);

        return { sold, available, total: MAX_TABLES };

    } catch (err: any) {
        console.error('Unexpected error checking availability:', err);
        return { sold: 0, available: 0, total: MAX_TABLES, error: err.message };
    }
}
