-- Add rating and status columns to testimonials table
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Update existing approved testimonials (is_active=true) to status='approved'
UPDATE testimonials SET status = 'approved' WHERE is_active = true;

-- Update existing inactive testimonials to status='pending' (or rejected, but standardizing on pending if unknown)
UPDATE testimonials SET status = 'pending' WHERE is_active = false AND status IS DISTINCT FROM 'approved';
