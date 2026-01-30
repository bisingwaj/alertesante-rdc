-- ========================================
-- FIX SCHEMA-LEVEL PERMISSIONS - CRITICAL
-- Alerte Santé RDC - Supabase Production
-- ========================================
-- 
-- ERROR: "permission denied for schema public" (Code 42501)
-- ROOT CAUSE: The 'anon' role doesn't have USAGE on schema public
-- SOLUTION: Grant schema-level permissions FIRST, then table permissions
--
-- ========================================
-- STEP 1: Grant USAGE on schema public (CRITICAL!)
-- ========================================
-- Without USAGE on the schema, users can't access ANY objects in it
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Also grant CREATE if you want users to create temp tables (optional)
-- GRANT CREATE ON SCHEMA public TO anon;

-- ========================================
-- STEP 2: Grant ALL on ALL tables to ensure coverage
-- ========================================
-- This is more permissive but ensures anon can INSERT
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ========================================
-- STEP 3: Grant permissions on sequences (for auto-increment/UUID)
-- ========================================
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ========================================
-- STEP 4: Set DEFAULT permissions for future objects
-- ========================================
-- This ensures new tables/sequences automatically get permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- ========================================
-- STEP 5: Specific permissions for tickets table
-- ========================================
GRANT INSERT, SELECT ON public.tickets TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;

-- ========================================
-- STEP 6: Enable RLS and create policies
-- ========================================
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "allow_anonymous_ticket_creation" ON public.tickets;
    DROP POLICY IF EXISTS "allow_public_ticket_read" ON public.tickets;
    DROP POLICY IF EXISTS "allow_authenticated_update" ON public.tickets;
    DROP POLICY IF EXISTS "allow_authenticated_delete" ON public.tickets;
    DROP POLICY IF EXISTS "Allow anonymous ticket creation" ON public.tickets;
    DROP POLICY IF EXISTS "Enable insert for anon users" ON public.tickets;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.tickets;
END $$;

-- Create permissive policies
CREATE POLICY "allow_anonymous_ticket_creation" 
ON public.tickets
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_ticket_read" 
ON public.tickets
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "allow_authenticated_update" 
ON public.tickets
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_authenticated_delete" 
ON public.tickets
FOR DELETE
TO authenticated
USING (true);

-- ========================================
-- STEP 7: Verify configuration
-- ========================================
DO $$ 
DECLARE
    schema_usage boolean;
    table_insert boolean;
    policy_count int;
BEGIN
    -- Check schema USAGE
    SELECT EXISTS(
        SELECT 1 FROM information_schema.usage_privileges
        WHERE object_schema = 'public' 
        AND object_type = 'SCHEMA'
        AND grantee = 'anon'
        AND privilege_type = 'USAGE'
    ) INTO schema_usage;
    
    -- Check table INSERT
    SELECT EXISTS(
        SELECT 1 FROM information_schema.role_table_grants 
        WHERE table_schema = 'public'
        AND table_name = 'tickets' 
        AND grantee = 'anon' 
        AND privilege_type = 'INSERT'
    ) INTO table_insert;
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tickets';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SCHEMA-LEVEL PERMISSIONS FIX - VERIFICATION';
    RAISE NOTICE '========================================';
    RAISE NOTICE '1. Schema USAGE for anon: %', CASE WHEN schema_usage THEN '✅ YES' ELSE '❌ NO - PROBLEM!' END;
    RAISE NOTICE '2. Table INSERT for anon: %', CASE WHEN table_insert THEN '✅ YES' ELSE '❌ NO - PROBLEM!' END;
    RAISE NOTICE '3. RLS Policies active: % (expected: 4)', policy_count;
    RAISE NOTICE '========================================';
    
    IF schema_usage AND table_insert AND policy_count = 4 THEN
        RAISE NOTICE '✅✅✅ ALL PERMISSIONS CONFIGURED CORRECTLY! ✅✅✅';
        RAISE NOTICE '';
        RAISE NOTICE 'Next step: Test ticket submission in production.';
        RAISE NOTICE 'The "permission denied for schema public" error should be GONE.';
    ELSE
        RAISE NOTICE '❌ CONFIGURATION INCOMPLETE!';
        RAISE NOTICE 'Run the verification script to see details.';
    END IF;
    RAISE NOTICE '========================================';
END $$;
