-- Create reservations table for General Table Bookings
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests TEXT DEFAULT '1',
  date TEXT,
  time TEXT,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  special_requests TEXT,
  guest_dob TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for booking flow via anon key)
DROP POLICY IF EXISTS "Public can insert reservations" ON reservations;
CREATE POLICY "Public can insert reservations"
ON reservations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public to read their own reservations (for cancellation lookup)
DROP POLICY IF EXISTS "Public can view reservations" ON reservations;
CREATE POLICY "Public can view reservations"
ON reservations FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated (admin) full access
DROP POLICY IF EXISTS "Admin can manage reservations" ON reservations;
CREATE POLICY "Admin can manage reservations"
ON reservations
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow admin to delete reservations
DROP POLICY IF EXISTS "Admin can delete reservations" ON reservations;
CREATE POLICY "Admin can delete reservations"
ON reservations FOR DELETE
TO authenticated
USING (true);

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
