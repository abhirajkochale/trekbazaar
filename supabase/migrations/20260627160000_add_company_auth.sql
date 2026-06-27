-- Migration: Add company auth and strict RLS scoping
-- Created at: 2026-06-27 16:00:00

-- 1. Add owner_id to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);

-- 2. Companies RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to active companies" ON companies;
CREATE POLICY "Allow public read access to active companies" 
ON companies FOR SELECT 
USING (status = 'active');

DROP POLICY IF EXISTS "Allow companies to update their own profile" ON companies;
CREATE POLICY "Allow companies to update their own profile" 
ON companies FOR UPDATE 
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- 3. Treks RLS
ALTER TABLE treks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to active treks" ON treks;
CREATE POLICY "Allow public read access to active treks" 
ON treks FOR SELECT 
USING (status = 'active');

DROP POLICY IF EXISTS "Allow companies to manage their own treks" ON treks;
CREATE POLICY "Allow companies to manage their own treks" 
ON treks FOR ALL 
USING (
  EXISTS (SELECT 1 FROM companies WHERE id = treks.company_id AND owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM companies WHERE id = treks.company_id AND owner_id = auth.uid())
);

-- 4. Departures RLS
-- (RLS already enabled in 20260627150000)
DROP POLICY IF EXISTS "Allow companies to manage their own departures" ON departures;
CREATE POLICY "Allow companies to manage their own departures" 
ON departures FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM treks t
    JOIN companies c ON c.id = t.company_id
    WHERE t.id = departures.trek_id AND c.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM treks t
    JOIN companies c ON c.id = t.company_id
    WHERE t.id = departures.trek_id AND c.owner_id = auth.uid()
  )
);

-- 5. Bookings RLS
-- (RLS already enabled in 130000)
DROP POLICY IF EXISTS "Allow companies to view their own bookings" ON bookings;
CREATE POLICY "Allow companies to view their own bookings" 
ON bookings FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM companies WHERE id = bookings.company_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Allow companies to update their own bookings" ON bookings;
CREATE POLICY "Allow companies to update their own bookings" 
ON bookings FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM companies WHERE id = bookings.company_id AND owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM companies WHERE id = bookings.company_id AND owner_id = auth.uid())
);

-- 6. Enquiries RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to insert enquiries" ON enquiries;
CREATE POLICY "Allow public to insert enquiries" 
ON enquiries FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow companies to manage their own enquiries" ON enquiries;
CREATE POLICY "Allow companies to manage their own enquiries" 
ON enquiries FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM treks t
    JOIN companies c ON c.id = t.company_id
    WHERE t.id = enquiries.trek_id AND c.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM treks t
    JOIN companies c ON c.id = t.company_id
    WHERE t.id = enquiries.trek_id AND c.owner_id = auth.uid()
  )
);

-- Admin policies are not strictly required because createAdminClient() bypasses RLS using the service_role key.
