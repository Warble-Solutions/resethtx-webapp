-- Ensure ticket_purchases has ALL required columns
ALTER TABLE ticket_purchases
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS user_phone TEXT,
ADD COLUMN IF NOT EXISTS guest_dob TEXT,
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS total_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Force schema cache reload (usually automatic, but modifying structure helps)
COMMENT ON TABLE ticket_purchases IS 'Tracks ticket purchases and RSVPs';
