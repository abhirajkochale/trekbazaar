-- Enable Trigrams for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Search Logs Table
CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    results_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_query ON public.search_logs(query);

-- 2. Create standard view for aggregated Master Treks (for filtering and sorting)
-- This view replaces the need to load all data into memory
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
    mt.max_altitude,
    mt.cover_image_url,
    mt.status,
    mt.created_at,
    r.name AS region_name,
    c.name AS category_name,
    
    -- Combine searchable text into one field for basic ILIKE or TSVECTOR (though we use trgm on name/region primarily)
    COALESCE(mt.name, '') || ' ' || COALESCE(r.name, '') || ' ' || COALESCE(c.name, '') || ' ' || COALESCE(mt.state, '') || ' ' || COALESCE(mt.difficulty, '') || ' ' || COALESCE(mt.best_season, '') AS search_text,
    
    -- Aggregated Lowest Price across Active Packages
    COALESCE(
        (SELECT MIN(t.price_per_person) FROM treks t WHERE t.master_trek_id = mt.id AND t.status = 'active'),
        0
    ) AS lowest_price,
    
    -- Number of unique verified companies operating this trek
    COALESCE(
        (SELECT COUNT(DISTINCT t.company_id) 
         FROM treks t 
         JOIN companies comp ON t.company_id = comp.id
         WHERE t.master_trek_id = mt.id AND t.status = 'active' AND comp.verification_status = 'verified'),
        0
    ) AS verified_companies_count,

    -- Total companies count
    COALESCE(
        (SELECT COUNT(DISTINCT t.company_id) FROM treks t WHERE t.master_trek_id = mt.id AND t.status = 'active'),
        0
    ) AS companies_count,
    
    -- Upcoming departures count
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

-- Add indexes on master_treks for trigram search on critical fields
CREATE INDEX IF NOT EXISTS idx_master_treks_name_trgm ON master_treks USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_master_treks_state_trgm ON master_treks USING GIN (state gin_trgm_ops);

-- Add RPC function for intelligent weighted fuzzy search
-- Rank weights: Similarity (40%), Lowest Price (20%), Companies (20%), Upcoming Departures (20%)
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
    -- Similarity on Name (Highest Weight), Region, and Category
    GREATEST(
      similarity(v.name, search_query),
      similarity(v.region_name, search_query) * 0.8,
      similarity(v.category_name, search_query) * 0.7,
      similarity(v.search_text, search_query) * 0.5
    )::FLOAT AS similarity_score,
    
    -- Weighted Rank Score
    (
      -- Similarity (max 1.0) * 40
      GREATEST(
        similarity(v.name, search_query),
        similarity(v.region_name, search_query) * 0.8,
        similarity(v.category_name, search_query) * 0.7
      ) * 40
      +
      -- Verified Companies (max 10 points)
      LEAST(v.verified_companies_count * 2.0, 10.0)
      +
      -- Upcoming Departures (max 10 points)
      LEAST(v.upcoming_departures_count * 0.5, 10.0)
      +
      -- Lowest Price (inverse score, cheaper = better, max 10 points)
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
