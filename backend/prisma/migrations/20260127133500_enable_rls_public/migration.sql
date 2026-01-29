-- Enable Row Level Security
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) and authenticated users to insert tickets
CREATE POLICY "Enable insert for everyone" ON "tickets"
FOR INSERT 
WITH CHECK (true);

-- Allow public to read created tickets (optional, but good for success check if needed)
CREATE POLICY "Enable read for everyone" ON "tickets"
FOR SELECT 
USING (true);
