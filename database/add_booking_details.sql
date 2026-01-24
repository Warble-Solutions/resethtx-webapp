-- Add booking_details and ticket_type to ticket_purchases
ALTER TABLE ticket_purchases
ADD COLUMN IF NOT EXISTS booking_details JSONB,
ADD COLUMN IF NOT EXISTS ticket_type TEXT DEFAULT 'standard_ticket'; -- 'standard_ticket', 'table_reservation'

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
