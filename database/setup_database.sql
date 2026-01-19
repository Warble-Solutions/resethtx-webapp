-- Create TABLES Table
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Standard',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Tables
INSERT INTO tables (name, capacity, price, category) VALUES
  ('Table 1', 2, 100, 'Standard'),
  ('Table 2', 2, 100, 'Standard'),
  ('Table 3', 4, 200, 'Standard'),
  ('Table 4', 4, 200, 'Standard'),
  ('Table 5', 6, 300, 'Booth'),
  ('Table 6', 6, 300, 'Booth'),
  ('VIP 1', 8, 500, 'VIP'),
  ('VIP 2', 8, 500, 'VIP'),
  ('VIP 3', 10, 750, 'VIP'),
  ('Sky 1', 12, 1000, 'Sky Lounge')
ON CONFLICT DO NOTHING;
