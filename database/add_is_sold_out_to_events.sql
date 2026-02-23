-- Add is_sold_out column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT false;
