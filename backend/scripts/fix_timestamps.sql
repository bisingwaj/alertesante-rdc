-- Fix updatedAt column to have a default value
-- The @updatedAt decorator in Prisma doesn't translate to PostgreSQL DEFAULT
-- We need to set DEFAULT NOW() for timestamp fields

ALTER TABLE public.tickets 
ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- Also ensure createdAt has a default (should already have it, but just in case)
ALTER TABLE public.tickets 
ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- Done!
