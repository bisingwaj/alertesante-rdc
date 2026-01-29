-- Fix UUID auto-generation for the id column
-- The Prisma @default(uuid()) doesn't translate to PostgreSQL DEFAULT
-- We need to explicitly set the DEFAULT to gen_random_uuid()

ALTER TABLE public.tickets 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Verify the change
-- You can run: \d tickets to see the default value
