-- Add columns to events table for Hybrid Logic
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS is_external_event BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS external_url TEXT,
ADD COLUMN IF NOT EXISTS ticket_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ticket_capacity INTEGER DEFAULT 100;

-- Create Ticket Purchases Table
CREATE TABLE IF NOT EXISTS ticket_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, paid, free, cancelled
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Ticket Purchases
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Public can insert (for purchasing/RSVP)
DROP POLICY IF EXISTS "Public can insert ticket purchases" ON ticket_purchases;
CREATE POLICY "Public can insert ticket purchases" 
ON ticket_purchases FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Users can view their own purchases (by email matching auth email - optional/advanced, for now maybe just public insert and admin view)
-- allowing admin full access
DROP POLICY IF EXISTS "Admin can manage ticket purchases" ON ticket_purchases;
CREATE POLICY "Admin can manage ticket purchases" 
ON ticket_purchases 
TO authenticated 
USING (true) 
WITH CHECK (true);
