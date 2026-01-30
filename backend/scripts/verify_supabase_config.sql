-- ========================================
-- VÉRIFICATION CONFIGURATION SUPABASE
-- Script de diagnostic pour Alerte Santé RDC
-- ========================================

-- ========================================
-- 1. Vérifier que RLS est activé
-- ========================================
SELECT 
    '✓ RLS Configuration' as check_name,
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS ENABLED'
        ELSE '❌ RLS DISABLED - PROBLEM!'
    END as status
FROM pg_tables 
WHERE tablename = 'tickets' AND schemaname = 'public';

-- ========================================
-- 2. Lister toutes les policies actives
-- ========================================
SELECT 
    '✓ Active Policies' as check_name,
    policyname,
    cmd as operation,
    roles,
    CASE 
        WHEN permissive = 't' THEN 'Permissive'
        ELSE 'Restrictive'
    END as policy_type
FROM pg_policies 
WHERE tablename = 'tickets'
ORDER BY cmd;

-- RESULT ATTENDU: 4 policies
-- - allow_anonymous_ticket_creation (INSERT)
-- - allow_public_ticket_read (SELECT)
-- - allow_authenticated_update (UPDATE)
-- - allow_authenticated_delete (DELETE)

-- ========================================
-- 3. Vérifier les permissions du rôle ANON
-- ========================================
SELECT 
    '✓ Anon Permissions' as check_name,
    grantee,
    privilege_type,
    CASE 
        WHEN privilege_type IN ('INSERT', 'SELECT') THEN '✅ CORRECT'
        ELSE '⚠️ EXTRA PERMISSION'
    END as status
FROM information_schema.role_table_grants 
WHERE table_name = 'tickets' 
  AND grantee = 'anon'
ORDER BY privilege_type;

-- RESULT ATTENDU: anon doit avoir INSERT et SELECT

-- ========================================
-- 4. Vérifier les permissions du rôle AUTHENTICATED
-- ========================================
SELECT 
    '✓ Authenticated Permissions' as check_name,
    grantee,
    privilege_type,
    '✅ OK' as status
FROM information_schema.role_table_grants 
WHERE table_name = 'tickets' 
  AND grantee = 'authenticated'
ORDER BY privilege_type;

-- RESULT ATTENDU: authenticated doit avoir INSERT, SELECT, UPDATE, DELETE

-- ========================================
-- 5. Vérifier la structure de la table tickets
-- ========================================
SELECT 
    '✓ Table Structure' as check_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'tickets' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les champs critiques:
-- - id (uuid, NOT NULL, default gen_random_uuid())
-- - category (text, NOT NULL)
-- - province (text, NOT NULL)
-- - cityOrTerritory (text, NOT NULL)
-- - contactPhone (text, nullable)
-- - contactPref (text, nullable)
-- - createdAt (timestamp, default NOW())
-- - updatedAt (timestamp, default NOW())

-- ========================================
-- 6. Compter les tickets existants
-- ========================================
SELECT 
    '✓ Data Check' as check_name,
    COUNT(*) as total_tickets,
    COUNT(CASE WHEN "contactPhone" IS NOT NULL THEN 1 END) as tickets_with_contact,
    COUNT(CASE WHEN "isAnonymous" = true THEN 1 END) as anonymous_tickets,
    MAX("createdAt")::date as last_ticket_date
FROM public.tickets;

-- ========================================
-- 7. Vérifier les permissions sur les séquences
-- ========================================
SELECT 
    '✓ Sequence Permissions' as check_name,
    grantee,
    privilege_type
FROM information_schema.usage_privileges
WHERE object_schema = 'public'
  AND object_type = 'SEQUENCE'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- RESULT ATTENDU: anon et authenticated doivent avoir USAGE

-- ========================================
-- RÉSUMÉ
-- ========================================
DO $$ 
DECLARE
    rls_enabled boolean;
    policy_count int;
    anon_insert boolean;
BEGIN
    -- Check RLS
    SELECT rowsecurity INTO rls_enabled FROM pg_tables 
    WHERE tablename = 'tickets' AND schemaname = 'public';
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'tickets';
    
    -- Check anon INSERT
    SELECT EXISTS(
        SELECT 1 FROM information_schema.role_table_grants 
        WHERE table_name = 'tickets' AND grantee = 'anon' AND privilege_type = 'INSERT'
    ) INTO anon_insert;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RÉSUMÉ DE LA CONFIGURATION';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS Enabled: %', CASE WHEN rls_enabled THEN '✅ OUI' ELSE '❌ NON' END;
    RAISE NOTICE 'Policies actives: % (attendu: 4)', policy_count;
    RAISE NOTICE 'Anon INSERT permission: %', CASE WHEN anon_insert THEN '✅ OUI' ELSE '❌ NON' END;
    RAISE NOTICE '========================================';
    
    IF rls_enabled AND policy_count = 4 AND anon_insert THEN
        RAISE NOTICE '✅ CONFIGURATION CORRECTE!';
        RAISE NOTICE 'Vous pouvez tester la soumission de tickets.';
    ELSE
        RAISE NOTICE '❌ PROBLÈME DÉTECTÉ!';
        RAISE NOTICE 'Vérifiez les résultats ci-dessus pour identifier le problème.';
    END IF;
    RAISE NOTICE '========================================';
END $$;
