-- 1. Ensure the Foreign Key definitely exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'event_bookings_table_id_fkey') THEN
        ALTER TABLE event_bookings
        ADD CONSTRAINT event_bookings_table_id_fkey
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Force PostgREST to reload the schema cache
-- This often works right from the SQL Editor
NOTIFY pgrst, 'reload schema';
