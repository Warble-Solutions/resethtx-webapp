-- 1. Create Table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT false
);

-- 2. Add columns if table existed but missed them (Idempotent)
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS author_role TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- 3. Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Allow anonymous users (public) to insert reviews
DROP POLICY IF EXISTS "Public can insert reviews" ON testimonials;
CREATE POLICY "Public can insert reviews" 
ON testimonials FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow everyone to read APPROVED reviews
DROP POLICY IF EXISTS "Public can view approved reviews" ON testimonials;
CREATE POLICY "Public can view approved reviews" 
ON testimonials FOR SELECT 
TO anon, authenticated 
USING (status = 'approved');

-- Allow Authenticated users (Admin) full access
DROP POLICY IF EXISTS "Authenticated users can do everything on testimonials" ON testimonials;
CREATE POLICY "Authenticated users can do everything on testimonials" 
ON testimonials 
TO authenticated 
USING (true) 
WITH CHECK (true);
