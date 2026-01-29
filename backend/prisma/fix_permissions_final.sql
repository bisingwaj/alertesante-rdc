-- Grant usage on the public schema itself
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant access to the tickets table (again, to be absolutely sure)
GRANT ALL ON TABLE "tickets" TO anon;
GRANT ALL ON TABLE "tickets" TO authenticated;
GRANT ALL ON TABLE "tickets" TO service_role;

-- Ensure RLS is enabled but policies exist
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;

-- Re-apply policies (IF NOT EXISTS pattern is not standard SQL for policies, so we drop/create to be safe)
DROP POLICY IF EXISTS "Enable insert for everyone" ON "tickets";
CREATE POLICY "Enable insert for everyone" ON "tickets" FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read for everyone" ON "tickets";
CREATE POLICY "Enable read for everyone" ON "tickets" FOR SELECT USING (true);
