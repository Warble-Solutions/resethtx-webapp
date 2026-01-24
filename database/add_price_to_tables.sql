-- Ensure tables has 'price' and 'category' columns
ALTER TABLE tables
ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Standard';

-- Notify to reload schema cache
NOTIFY pgrst, 'reload schema';
