-- ============================================================================
-- COMPREHENSIVE PERMISSION FIX FOR SUPABASE TICKETS TABLE
-- This script resolves the "42501: permission denied for schema public" error
-- ============================================================================

-- Step 1: Grant USAGE on the public schema to all roles
-- This is CRITICAL - without this, roles cannot access ANY tables in the schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON SCHEMA public TO postgres;

-- Step 2: Grant table-level permissions
-- Allow insert, select, update, delete on the tickets table
GRANT ALL PRIVILEGES ON TABLE public.tickets TO anon;
GRANT ALL PRIVILEGES ON TABLE public.tickets TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.tickets TO service_role;
GRANT ALL PRIVILEGES ON TABLE public.tickets TO postgres;

-- Step 3: Grant sequence permissions (for auto-incrementing IDs)
-- This ensures the id field can auto-increment properly
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Step 4: Enable Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.tickets;
DROP POLICY IF EXISTS "Enable read for everyone" ON public.tickets;
DROP POLICY IF EXISTS "Enable all for anon" ON public.tickets;

-- Step 6: Create permissive RLS policies
-- Policy for INSERT: Allow anyone to insert tickets
CREATE POLICY "Enable insert for everyone" 
ON public.tickets 
FOR INSERT 
TO anon, authenticated, service_role
WITH CHECK (true);

-- Policy for SELECT: Allow anyone to read tickets
CREATE POLICY "Enable read for everyone" 
ON public.tickets 
FOR SELECT 
TO anon, authenticated, service_role
USING (true);

-- Step 7: Set default privileges for future tables (good practice)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;

-- Step 8: Verify the grants (this will output results you can check)
-- You can run these separately to verify:
-- SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name='tickets';
-- SELECT schemaname, tablename, policyname, roles FROM pg_policies WHERE tablename='tickets';

-- Done! The tickets table should now be accessible for anonymous users.
