-- Enable RLS on tables (if not already enabled)
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tables
CREATE POLICY "Public tables are viewable by everyone" 
ON tables FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public read access to event_bookings (to see which are taken)
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public bookings are viewable by everyone" 
ON event_bookings FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public insert access to event_bookings (to make a booking)
CREATE POLICY "Public can insert bookings" 
ON event_bookings FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
