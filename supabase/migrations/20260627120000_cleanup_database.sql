-- 20260627120000_cleanup_database.sql
-- Production Database Cleanup & Constraints Enhancement

-- 1. Remove duplicate indexes that were accidentally recreated in later migrations
DROP INDEX IF EXISTS idx_treks_region;
DROP INDEX IF EXISTS idx_treks_status;

-- 2. Add missing triggers to keep 'updated_at' current on updates
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'companies_set_updated_at') THEN
    CREATE TRIGGER companies_set_updated_at
      BEFORE UPDATE ON public.companies
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'departures_set_updated_at') THEN
    CREATE TRIGGER departures_set_updated_at
      BEFORE UPDATE ON public.departures
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Enhance Departures table with robust CHECK constraints (Idempotent)
DO $$
BEGIN
  -- chk_departures_status
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_departures_status') THEN
    ALTER TABLE public.departures ADD CONSTRAINT chk_departures_status 
      CHECK (status IN ('Upcoming', 'Full', 'Cancelled', 'Completed'));
  END IF;

  -- chk_departures_dates
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_departures_dates') THEN
    ALTER TABLE public.departures ADD CONSTRAINT chk_departures_dates 
      CHECK (return_date >= departure_date);
  END IF;

  -- chk_departures_total_seats
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_departures_total_seats') THEN
    ALTER TABLE public.departures ADD CONSTRAINT chk_departures_total_seats 
      CHECK (total_seats > 0);
  END IF;

  -- chk_departures_seats
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_departures_seats') THEN
    ALTER TABLE public.departures ADD CONSTRAINT chk_departures_seats 
      CHECK (booked_seats >= 0 AND booked_seats <= total_seats);
  END IF;

  -- chk_departures_base_price
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_departures_base_price') THEN
    ALTER TABLE public.departures ADD CONSTRAINT chk_departures_base_price 
      CHECK (base_price > 0);
  END IF;

  -- chk_departures_offer_price
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_departures_offer_price') THEN
    ALTER TABLE public.departures ADD CONSTRAINT chk_departures_offer_price 
      CHECK (offer_price IS NULL OR (offer_price >= 0 AND offer_price <= base_price));
  END IF;
END $$;

-- Note: treks.operator_name and treks.operator_contact are preserved for backwards compatibility,
-- but are considered deprecated in favor of the companies table relations.
