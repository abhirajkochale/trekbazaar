-- Migration: B2B Onboarding Schema and State Machine
-- Created at: 2026-07-01 02:00:00

-- 1. Create the onboarding_status enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'onboarding_status_enum') THEN
        CREATE TYPE onboarding_status_enum AS ENUM (
            'REGISTERED',
            'PROFILE_COMPLETED',
            'DUE_DILIGENCE',
            'TERMS_ACCEPTED',
            'KYC_COMPLETED',
            'READY_FOR_REVIEW',
            'APPROVED',
            'REJECTED',
            'CHANGES_REQUESTED',
            'SUSPENDED'
        );
    END IF;
END
$$;

-- 2. Add the onboarding_status column and drop the old verification_status
-- We'll add it, default it to REGISTERED for any existing suspended companies or APPROVED for active ones, then drop the old one.
ALTER TABLE companies ADD COLUMN IF NOT EXISTS onboarding_status onboarding_status_enum DEFAULT 'REGISTERED';

-- Migrate existing data (assuming old companies are active -> APPROVED, pending -> REGISTERED)
UPDATE companies SET onboarding_status = 'APPROVED' WHERE status = 'active';
UPDATE companies SET onboarding_status = 'REGISTERED' WHERE status = 'suspended';

-- Optionally drop verification_status. We can leave it for backward compatibility or drop it.
-- We will drop it to enforce the new state machine strictly.
-- Use CASCADE because v_search_master_treks depends on this column.
ALTER TABLE companies DROP COLUMN IF EXISTS verification_status CASCADE;

-- Recreate v_search_master_treks with onboarding_status
CREATE OR REPLACE VIEW public.v_search_master_treks AS
SELECT
    mt.id,
    mt.name,
    mt.slug,
    mt.overview,
    mt.difficulty,
    mt.best_season,
    mt.duration_min,
    mt.duration_max,
    mt.altitude,
    mt.cover_image,
    mt.status,
    mt.created_at,
    r.name AS region_name,
    c.name AS category_name,
    
    COALESCE(mt.name, '') || ' ' || COALESCE(r.name, '') || ' ' || COALESCE(c.name, '') || ' ' || COALESCE(mt.state, '') || ' ' || COALESCE(mt.difficulty, '') || ' ' || COALESCE(mt.best_season, '') AS search_text,
    
    COALESCE(
        (SELECT MIN(t.price_per_person) FROM treks t WHERE t.master_trek_id = mt.id AND t.status = 'active'),
        0
    ) AS lowest_price,
    
    COALESCE(
        (SELECT COUNT(DISTINCT t.company_id) 
         FROM treks t 
         JOIN companies comp ON t.company_id = comp.id
         WHERE t.master_trek_id = mt.id AND t.status = 'active' AND comp.onboarding_status = 'APPROVED'),
        0
    ) AS verified_companies_count,

    COALESCE(
        (SELECT COUNT(DISTINCT t.company_id) FROM treks t WHERE t.master_trek_id = mt.id AND t.status = 'active'),
        0
    ) AS companies_count,
    
    COALESCE(
        (SELECT COUNT(d.id) 
         FROM treks t 
         JOIN departures d ON t.id = d.trek_id 
         WHERE t.master_trek_id = mt.id AND t.status = 'active' AND d.status = 'Upcoming' AND d.departure_date >= CURRENT_DATE),
        0
    ) AS upcoming_departures_count

FROM public.master_treks mt
LEFT JOIN public.regions r ON mt.region_id = r.id
LEFT JOIN public.master_trek_categories c ON mt.category_id = c.id
WHERE mt.status = 'active';

-- Recreate RPC function since CASCADE dropped it
CREATE OR REPLACE FUNCTION rpc_search_master_treks_weighted(
  search_query TEXT,
  match_threshold FLOAT DEFAULT 0.1
)
RETURNS TABLE (
  id UUID,
  similarity_score FLOAT,
  rank_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    GREATEST(
      similarity(v.name, search_query),
      similarity(v.region_name, search_query) * 0.8,
      similarity(v.category_name, search_query) * 0.7,
      similarity(v.search_text, search_query) * 0.5
    )::FLOAT AS similarity_score,
    
    (
      GREATEST(
        similarity(v.name, search_query),
        similarity(v.region_name, search_query) * 0.8,
        similarity(v.category_name, search_query) * 0.7
      ) * 40
      +
      LEAST(v.verified_companies_count * 2.0, 10.0)
      +
      LEAST(v.upcoming_departures_count * 0.5, 10.0)
      +
      CASE WHEN v.lowest_price > 0 THEN LEAST(10000.0 / v.lowest_price, 10.0) ELSE 0 END
    )::FLOAT AS rank_score

  FROM v_search_master_treks v
  WHERE 
    search_query = '' OR 
    GREATEST(
      similarity(v.name, search_query),
      similarity(v.region_name, search_query) * 0.8,
      similarity(v.category_name, search_query) * 0.7,
      similarity(v.search_text, search_query) * 0.5
    ) >= match_threshold
  ORDER BY rank_score DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. Add Banking Fields
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bank_account_holder_name TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bank_ifsc_code TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bank_branch_name TEXT;

-- 4. Add additional Document/KYC Fields
ALTER TABLE companies ADD COLUMN IF NOT EXISTS pan_number TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_id_document_url TEXT;

-- 5. Terms Acceptance
ALTER TABLE companies ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;
