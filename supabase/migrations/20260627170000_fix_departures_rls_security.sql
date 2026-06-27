-- Migration: Fix departures RLS security hole (TB-015.1)
-- Created at: 2026-06-27 17:00:00
--
-- PROBLEM:
--   Migration 20260627150000 created a policy "Allow admins full access to
--   departures" as `FOR ALL USING (true) WITH CHECK (true)` with NO role
--   restriction. Because it is not scoped to a role, it applies to the public
--   `anon` (and `authenticated`) roles, effectively letting ANY public user
--   INSERT / UPDATE / DELETE / SELECT any departure (seats, prices, dates,
--   status). Departures are the bookable inventory unit, so this is critical.
--
-- FIX:
--   - Drop the dangerous permissive policy.
--   - Recreate a SELECT-only public policy that exposes ONLY genuinely
--     bookable departures (is_active = true AND status in Upcoming/Full).
--   - Recreate a company-ownership policy (authenticated only) that scopes all
--     access via departures.trek_id -> treks.company_id -> companies.owner_id.
--
-- NOTES:
--   - Admin continues to operate via the service_role key, which BYPASSES RLS
--     entirely. We deliberately do NOT add any permissive admin policy.
--   - The create_booking RPC is SECURITY DEFINER and is invoked from the
--     server via the service_role client, so it is unaffected by these
--     policies (it does not rely on anon write access to departures).
--   - Idempotent: safe to run more than once.

-- Ensure RLS is on (no-op if already enabled).
ALTER TABLE public.departures ENABLE ROW LEVEL SECURITY;

-- 1. Remove the dangerous unrestricted "full access" policy.
DROP POLICY IF EXISTS "Allow admins full access to departures" ON public.departures;

-- 2. Public read policy: SELECT only, bookable departures only.
--    Cancelled / Completed / inactive departures are hidden from the public.
DROP POLICY IF EXISTS "Allow public read access to active departures" ON public.departures;
CREATE POLICY "Allow public read access to active departures"
ON public.departures
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  AND status IN ('Upcoming', 'Full')
);

-- 3. Company ownership policy: full access to OWN departures only.
--    Ownership is validated through the trek -> company -> owner chain.
--    This intentionally covers every status (including Cancelled / Completed /
--    inactive) so companies can manage their full inventory history.
--    Anon is excluded (auth.uid() is NULL for anon), and the WITH CHECK guards
--    against creating/moving a departure onto another company's trek.
DROP POLICY IF EXISTS "Allow companies to manage their own departures" ON public.departures;
CREATE POLICY "Allow companies to manage their own departures"
ON public.departures
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.treks t
    JOIN public.companies c ON c.id = t.company_id
    WHERE t.id = public.departures.trek_id
      AND c.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.treks t
    JOIN public.companies c ON c.id = t.company_id
    WHERE t.id = public.departures.trek_id
      AND c.owner_id = auth.uid()
  )
);
