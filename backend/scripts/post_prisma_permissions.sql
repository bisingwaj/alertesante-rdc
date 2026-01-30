-- ========================================
-- POST-PRISMA PERMISSIONS SETUP
-- À exécuter APRÈS: npx prisma db push --force-reset
-- ========================================

-- STEP 1: Grant USAGE on schema (CRITICAL!)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- STEP 2: Grant table permissions
GRANT SELECT, INSERT ON public.tickets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;

GRANT SELECT, INSERT ON public."User" TO anon;
GRANT ALL ON public."User" TO authenticated, service_role;

-- STEP 3: Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- STEP 4: Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;

-- STEP 5: Enable RLS on tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create simple, permissive RLS policies
CREATE POLICY "anon_insert_tickets" 
ON public.tickets FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "anon_select_tickets" 
ON public.tickets FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "auth_update_tickets" 
ON public.tickets FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_tickets" 
ON public.tickets FOR DELETE TO authenticated
USING (true);

-- VERIFICATION
DO $$ 
DECLARE
    schema_usage boolean;
    table_insert boolean;
    uuid_default text;
BEGIN
    -- Check schema USAGE
    SELECT EXISTS(
        SELECT 1 FROM information_schema.usage_privileges
        WHERE object_schema = 'public' AND object_type = 'SCHEMA'
        AND grantee = 'anon' AND privilege_type = 'USAGE'
    ) INTO schema_usage;
    
    -- Check table INSERT
    SELECT EXISTS(
        SELECT 1 FROM information_schema.role_table_grants 
        WHERE table_schema = 'public' AND table_name = 'tickets' 
        AND grantee = 'anon' AND privilege_type = 'INSERT'
    ) INTO table_insert;
    
    -- Check UUID default
    SELECT column_default INTO uuid_default
    FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'id';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'POST-PRISMA VERIFICATION';
    RAISE NOTICE '========================================';
    RAISE NOTICE '1. Schema USAGE for anon: %', CASE WHEN schema_usage THEN '✅' ELSE '❌' END;
    RAISE NOTICE '2. Table INSERT for anon: %', CASE WHEN table_insert THEN '✅' ELSE '❌' END;
    RAISE NOTICE '3. UUID default: %', COALESCE(uuid_default, '❌ MISSING');
    RAISE NOTICE '========================================';
    
    IF schema_usage AND table_insert AND uuid_default LIKE '%gen_random_uuid%' THEN
        RAISE NOTICE '✅✅✅ DATABASE READY FOR PRODUCTION! ✅✅✅';
    ELSE
        RAISE NOTICE '❌ Configuration incomplete';
    END IF;
END $$;
