-- Add missing columns to ticket_purchases table
ALTER TABLE ticket_purchases
ADD COLUMN IF NOT EXISTS user_phone TEXT,
ADD COLUMN IF NOT EXISTS guest_dob TEXT,
ADD COLUMN IF NOT EXISTS coupon_code TEXT;
