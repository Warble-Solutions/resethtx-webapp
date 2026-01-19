
-- Allow admins to delete messages
CREATE POLICY "Allow admins delete" ON contact_messages FOR DELETE USING (true);
