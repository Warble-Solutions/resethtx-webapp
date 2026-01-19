-- 1. Create Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url TEXT NOT NULL
);

-- 2. Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 3. Create Storage Bucket 'gallery' if possible (SQL-based bucket creation is specific to Supabase extensions, assuming standard storage schema)
-- We insert into storage.buckets if we have permission, otherwise user might need to create it manually in dashboard.
-- Attempting standard insertion:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 4. RLS Policies for Table

-- Public Read
DROP POLICY IF EXISTS "Public can view gallery images" ON gallery_images;
CREATE POLICY "Public can view gallery images" 
ON gallery_images FOR SELECT 
TO anon, authenticated 
USING (true);

-- Authenticated (Admin) All Access
DROP POLICY IF EXISTS "Admin can manage gallery images" ON gallery_images;
CREATE POLICY "Admin can manage gallery images" 
ON gallery_images 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. RLS Policies for Storage (Important!)

-- Public Read Objects
DROP POLICY IF EXISTS "Public can view gallery objects" ON storage.objects;
CREATE POLICY "Public can view gallery objects"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery');

-- Authenticated Upload
DROP POLICY IF EXISTS "Admin can upload gallery objects" ON storage.objects;
CREATE POLICY "Admin can upload gallery objects"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Authenticated Delete
DROP POLICY IF EXISTS "Admin can delete gallery objects" ON storage.objects;
CREATE POLICY "Admin can delete gallery objects"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
