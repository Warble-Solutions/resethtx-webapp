-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (Anon key)
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);

-- Allow admins to read/update
CREATE POLICY "Allow admins read" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow admins update" ON contact_messages FOR UPDATE USING (true);
