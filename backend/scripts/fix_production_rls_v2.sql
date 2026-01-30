-- ========================================
-- FIX PRODUCTION RLS POLICIES - IDEMPOTENT VERSION
-- Alerte Santé RDC - Supabase Production
-- ========================================
-- 
-- This version safely handles existing policies
-- Run this in Supabase SQL Editor if the first script failed
--
-- ========================================
-- STEP 1: Drop ALL existing policies (safe - won't error if they don't exist)
-- ========================================
DO $$ 
BEGIN
    -- Drop all possible policy variations
    DROP POLICY IF EXISTS "allow_anonymous_ticket_creation" ON public.tickets;
    DROP POLICY IF EXISTS "Allow anonymous ticket creation" ON public.tickets;
    DROP POLICY IF EXISTS "Enable insert for anon users" ON public.tickets;
    
    DROP POLICY IF EXISTS "allow_public_ticket_read" ON public.tickets;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.tickets;
    DROP POLICY IF EXISTS "Allow public ticket creation" ON public.tickets;
    
    DROP POLICY IF EXISTS "allow_authenticated_update" ON public.tickets;
    DROP POLICY IF EXISTS "allow_authenticated_delete" ON public.tickets;
    
    -- Drop any other custom policies that might exist
    DROP POLICY IF EXISTS "anon_insert_tickets" ON public.tickets;
    DROP POLICY IF EXISTS "public_read_tickets" ON public.tickets;
    DROP POLICY IF EXISTS "auth_update_tickets" ON public.tickets;
    DROP POLICY IF EXISTS "auth_delete_tickets" ON public.tickets;
END $$;

-- ========================================
-- STEP 2: Enable RLS
-- ========================================
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 3: Grant table-level permissions (CRITICAL!)
-- ========================================
GRANT INSERT ON public.tickets TO anon;
GRANT INSERT ON public.tickets TO authenticated;
GRANT SELECT ON public.tickets TO anon;
GRANT SELECT ON public.tickets TO authenticated;
GRANT SELECT ON public.tickets TO service_role;
GRANT UPDATE, DELETE ON public.tickets TO authenticated;
GRANT UPDATE, DELETE ON public.tickets TO service_role;

-- ========================================
-- STEP 4: Grant sequence permissions (for UUID generation)
-- ========================================
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ========================================
-- STEP 5: Create NEW policies
-- ========================================

-- Policy 1: Allow anonymous INSERT
CREATE POLICY "allow_anonymous_ticket_creation" 
ON public.tickets
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow public SELECT
CREATE POLICY "allow_public_ticket_read" 
ON public.tickets
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 3: Allow authenticated UPDATE
CREATE POLICY "allow_authenticated_update" 
ON public.tickets
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Allow authenticated DELETE
CREATE POLICY "allow_authenticated_delete" 
ON public.tickets
FOR DELETE
TO authenticated
USING (true);

-- ========================================
-- VERIFICATION QUERIES (run separately after)
-- ========================================
/*
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'tickets';

-- Check policies
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies WHERE tablename = 'tickets';

-- Check permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'tickets' AND grantee IN ('anon', 'authenticated');
*/

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ RLS policies configured successfully!';
    RAISE NOTICE 'Next: Test ticket submission at your production app';
END $$;
