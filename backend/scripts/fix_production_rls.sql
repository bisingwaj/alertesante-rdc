-- ========================================
-- FIX PRODUCTION RLS POLICIES
-- Alerte Santé RDC - Supabase Production
-- ========================================
-- 
-- PROBLEM: "permission denied for schema public"
-- CAUSE: RLS policies blocking anonymous ticket creation
-- SOLUTION: Grant proper permissions and create permissive RLS policies
--
-- Run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pudmsfbjbcafgebhkrgh/sql/new

-- ========================================
-- STEP 1: Enable RLS on tickets table
-- ========================================
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: Drop existing conflicting policies
-- ========================================
DROP POLICY IF EXISTS "Allow anonymous ticket creation" ON public.tickets;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.tickets;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tickets;
DROP POLICY IF EXISTS "Allow public ticket creation" ON public.tickets;

-- ========================================
-- STEP 3: Grant table-level permissions
-- ========================================
-- Allow anonymous (anon) role to INSERT
GRANT INSERT ON public.tickets TO anon;
GRANT INSERT ON public.tickets TO authenticated;

-- Allow SELECT for dashboard/admin views
GRANT SELECT ON public.tickets TO anon;
GRANT SELECT ON public.tickets TO authenticated;
GRANT SELECT ON public.tickets TO service_role;

-- Restrict UPDATE/DELETE to authenticated users only
GRANT UPDATE, DELETE ON public.tickets TO authenticated;
GRANT UPDATE, DELETE ON public.tickets TO service_role;

-- ========================================
-- STEP 4: Grant USAGE on sequence (for auto-increment)
-- ========================================
-- This fixes potential "permission denied for sequence" errors
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ========================================
-- STEP 5: Create permissive RLS policies
-- ========================================

-- Policy 1: Allow ANYONE to create tickets (anonymous reporting)
CREATE POLICY "allow_anonymous_ticket_creation" 
ON public.tickets
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Allow ANYONE to read tickets (public dashboard)
CREATE POLICY "allow_public_ticket_read" 
ON public.tickets
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 3: Only authenticated users can UPDATE their own tickets
CREATE POLICY "allow_authenticated_update" 
ON public.tickets
FOR UPDATE
TO authenticated
USING (true)  -- Can read any
WITH CHECK (true);  -- Can update any (adjust if needed)

-- Policy 4: Only authenticated users can DELETE
CREATE POLICY "allow_authenticated_delete" 
ON public.tickets
FOR DELETE
TO authenticated
USING (true);

-- ========================================
-- STEP 6: Verify configuration
-- ========================================
-- Run these queries to verify:

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'tickets';

-- Check policies:
-- SELECT * FROM pg_policies WHERE tablename = 'tickets';

-- Check permissions:
-- SELECT grantee, privilege_type FROM information_schema.role_table_grants 
-- WHERE table_name = 'tickets';

-- ========================================
-- DONE! Test by submitting a ticket
-- ========================================
