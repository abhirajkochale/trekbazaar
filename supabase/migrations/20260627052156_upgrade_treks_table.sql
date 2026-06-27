-- Add new columns for the comprehensive Treks CMS
ALTER TABLE treks
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS altitude text,
  ADD COLUMN IF NOT EXISTS distance text,
  ADD COLUMN IF NOT EXISTS base_camp text,
  ADD COLUMN IF NOT EXISTS start_point text,
  ADD COLUMN IF NOT EXISTS end_point text,
  ADD COLUMN IF NOT EXISTS best_season text,
  ADD COLUMN IF NOT EXISTS temperature text,
  ADD COLUMN IF NOT EXISTS age_limit text,
  ADD COLUMN IF NOT EXISTS fitness_level text,
  ADD COLUMN IF NOT EXISTS included text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS excluded text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS things_to_carry text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS itinerary jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS canonical_url text;

-- Backfill default short_description using a substring of the full description if missing
UPDATE treks 
SET short_description = SUBSTRING(description FROM 1 FOR 150) || '...'
WHERE short_description IS NULL AND description IS NOT NULL;

-- Create indexes for performance (slug already has an index, region and status will benefit from one)
CREATE INDEX IF NOT EXISTS idx_treks_region ON treks(region);
CREATE INDEX IF NOT EXISTS idx_treks_status ON treks(status);
