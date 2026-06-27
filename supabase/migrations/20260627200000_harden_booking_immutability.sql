-- Migration: Enforce booking immutability for company users (TB-015.4)
-- Created at: 2026-06-27 20:00:00
--
-- WHY A TRIGGER (not column privileges / RLS):
--   RLS controls which ROWS a role may read/write, not which COLUMNS. The
--   existing company UPDATE policy correctly limits a company to its own
--   booking rows, but cannot stop that company from changing total_amount,
--   departure_price, customer details, etc. Column-level GRANTs are fragile
--   under Supabase (the `authenticated` role is granted table privileges by
--   default and can be re-granted by tooling) and give no clear error. A
--   BEFORE UPDATE trigger is the reliable, self-documenting DB-level guard and
--   can raise a precise error message.
--
-- A booking is an immutable commercial snapshot. Company users may change ONLY
-- `status` (updated_at is maintained by the existing set_updated_at trigger).
--
-- TRUST MODEL:
--   * auth.role() = 'authenticated'  -> company user, RESTRICTED to status.
--   * auth.role() = 'service_role'   -> admin client, trusted (passes through).
--   * auth.role() IS NULL            -> internal: migrations, and the
--     SECURITY DEFINER create_booking RPC. Trusted (passes through).
--   The trigger is BEFORE UPDATE only, so it never affects INSERTs from
--   create_booking, and never touches the departures seat-update logic.
--
-- Idempotent: CREATE OR REPLACE FUNCTION + DROP TRIGGER IF EXISTS / CREATE.

CREATE OR REPLACE FUNCTION public.enforce_booking_immutability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- Only restrict authenticated (company) users. Admin service_role and
  -- internal/SECURITY DEFINER/migration contexts pass through unchanged.
  IF auth.role() IS DISTINCT FROM 'authenticated' THEN
    RETURN NEW;
  END IF;

  -- Block any change to a protected / snapshot column. IS DISTINCT FROM is
  -- null-safe. `status` (and the trigger-maintained `updated_at`) are the only
  -- columns a company user may effectively change.
  IF NEW.id               IS DISTINCT FROM OLD.id
  OR NEW.booking_reference IS DISTINCT FROM OLD.booking_reference
  OR NEW.departure_id     IS DISTINCT FROM OLD.departure_id
  OR NEW.trek_id          IS DISTINCT FROM OLD.trek_id
  OR NEW.company_id       IS DISTINCT FROM OLD.company_id
  OR NEW.customer_name    IS DISTINCT FROM OLD.customer_name
  OR NEW.customer_email   IS DISTINCT FROM OLD.customer_email
  OR NEW.customer_phone   IS DISTINCT FROM OLD.customer_phone
  OR NEW.travellers_count IS DISTINCT FROM OLD.travellers_count
  OR NEW.departure_date   IS DISTINCT FROM OLD.departure_date
  OR NEW.departure_price  IS DISTINCT FROM OLD.departure_price
  OR NEW.total_amount     IS DISTINCT FROM OLD.total_amount
  OR NEW.notes            IS DISTINCT FROM OLD.notes
  OR NEW.created_at       IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'Company users may only update booking status.';
  END IF;

  RETURN NEW;
END;
$$;

-- Runs BEFORE the existing bookings_set_updated_at trigger (alphabetical order:
-- 'enforce' < 'set'), so updated_at is still stamped after the check passes.
DROP TRIGGER IF EXISTS bookings_enforce_immutability ON public.bookings;
CREATE TRIGGER bookings_enforce_immutability
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_booking_immutability();
