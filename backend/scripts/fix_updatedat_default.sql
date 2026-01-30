-- ========================================
-- FIX UPDATEDAT DEFAULT VALUE
-- Quick fix for missing DEFAULT on updatedAt
-- ========================================

-- Add DEFAULT NOW() to updatedAt columns
ALTER TABLE public.tickets 
ALTER COLUMN "updatedAt" SET DEFAULT NOW();

ALTER TABLE public."User" 
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- Verification
DO $$ 
DECLARE
    updated_default text;
    created_default text;
BEGIN
    SELECT column_default INTO updated_default
    FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'updatedAt';
    
    SELECT column_default INTO created_default
    FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'createdAt';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TIMESTAMP DEFAULTS CHECK';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'updatedAt default: %', COALESCE(updated_default, '❌ MISSING');
    RAISE NOTICE 'createdAt default: %', COALESCE(created_default, '❌ MISSING');
    RAISE NOTICE '========================================';
    
    IF updated_default LIKE '%now()%' AND created_default LIKE '%now()%' THEN
        RAISE NOTICE '✅ ALL TIMESTAMP DEFAULTS CONFIGURED!';
        RAISE NOTICE 'Test ticket submission now!';
    END IF;
END $$;
