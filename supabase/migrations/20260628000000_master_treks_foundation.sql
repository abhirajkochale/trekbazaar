-- Migration: TB-016.1 Master Trek Database Foundation
-- Description: Introduces master_trek_categories and master_treks for canonical routing.

-- 1. Create master_trek_categories
CREATE TABLE public.master_trek_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  status text default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create master_treks
CREATE TABLE public.master_treks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.master_trek_categories(id) on delete set null,
  region_id uuid references public.regions(id) on delete set null,
  country text default 'India',
  state text,
  
  -- Standarized Difficulty
  difficulty text check (difficulty in ('Easy', 'Moderate', 'Difficult', 'Extreme')),
  
  -- Typical Duration (Companies own exact durations)
  duration_min int,
  duration_max int,
  
  altitude text,
  best_season text,
  overview text,
  cover_image text,
  gallery text[] default '{}'::text[],
  highlights text[] default '{}'::text[],
  seo_title text,
  seo_description text,
  status text default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Update existing treks table
ALTER TABLE public.treks
  ADD COLUMN master_trek_id uuid references public.master_treks(id) on delete set null;

-- Ensure a company only has ONE package per Master Trek
ALTER TABLE public.treks
  ADD CONSTRAINT unique_company_master_trek UNIQUE (company_id, master_trek_id);

-- 4. Triggers for updated_at
CREATE TRIGGER master_trek_categories_set_updated_at
BEFORE UPDATE ON public.master_trek_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER master_treks_set_updated_at
BEFORE UPDATE ON public.master_treks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. Enable RLS
ALTER TABLE public.master_trek_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_treks ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Categories
CREATE POLICY "Public can view active master_trek_categories" 
  ON public.master_trek_categories FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admin full access master_trek_categories" 
  ON public.master_trek_categories FOR ALL 
  TO service_role 
  USING (true) WITH CHECK (true);

-- 7. RLS Policies for Master Treks
CREATE POLICY "Public can view active master_treks" 
  ON public.master_treks FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admin full access master_treks" 
  ON public.master_treks FOR ALL 
  TO service_role 
  USING (true) WITH CHECK (true);

-- 8. Indexes for performance
CREATE INDEX idx_master_treks_category_id ON public.master_treks(category_id);
CREATE INDEX idx_master_treks_region_id ON public.master_treks(region_id);
CREATE INDEX idx_master_treks_status ON public.master_treks(status);
CREATE INDEX idx_treks_master_trek_id ON public.treks(master_trek_id);
