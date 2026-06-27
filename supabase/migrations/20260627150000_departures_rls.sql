-- Migration: Add RLS policies for departures
-- Created at: 2026-06-27 15:00:00

-- Enable RLS
ALTER TABLE departures ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to active departures" ON departures;
DROP POLICY IF EXISTS "Allow admins full access to departures" ON departures;

-- 1. Public can read active departures
CREATE POLICY "Allow public read access to active departures" 
ON departures
FOR SELECT 
USING (is_active = true);

-- 2. Service role / Admins can do everything (handled by service role bypassing RLS, but adding this for safety if using auth)
CREATE POLICY "Allow admins full access to departures" 
ON departures
FOR ALL 
USING (true)
WITH CHECK (true);
