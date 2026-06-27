-- 20260627100000_add_companies_table.sql

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  cover_image_url text,
  description text,
  
  -- Contact Person & Info
  contact_person text,
  email text,
  phone text,
  emergency_contact text,
  website text,
  
  -- Social Links
  instagram text,
  facebook text,
  youtube text,
  
  -- Address
  address text,
  city text,
  state text,
  
  -- Business Details
  gst_number text,
  years_of_experience integer DEFAULT 0,
  
  -- Document URLs (Internal)
  gst_document_url text,
  pan_document_url text,
  registration_document_url text,
  
  -- Statuses
  verification_status text DEFAULT 'pending', -- pending, verified, rejected
  status text DEFAULT 'active', -- active, suspended
  featured boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for companies
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_verification ON companies(verification_status);

-- Update treks table to link to companies
ALTER TABLE treks
ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_treks_company_id ON treks(company_id);
