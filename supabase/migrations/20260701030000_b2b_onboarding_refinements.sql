-- Migration: B2B Onboarding Architectural Refinements
-- Created at: 2026-07-01 03:00:00

-- 1. Create Document Enums
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type_enum') THEN
        CREATE TYPE document_type_enum AS ENUM (
            'PAN',
            'GST',
            'COMPANY_REGISTRATION',
            'OWNER_ID',
            'BANK_PROOF',
            'OTHER'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status_enum') THEN
        CREATE TYPE document_status_enum AS ENUM (
            'PENDING',
            'APPROVED',
            'REJECTED'
        );
    END IF;
END
$$;

-- 2. Create partner_documents table
CREATE TABLE IF NOT EXISTS public.partner_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    document_type document_type_enum NOT NULL,
    file_url TEXT NOT NULL,
    status document_status_enum DEFAULT 'PENDING',
    review_notes TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_partner_documents_company_id ON public.partner_documents(company_id);

-- 3. Create partner_application_history table (Audit Log)
CREATE TABLE IF NOT EXISTS public.partner_application_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    from_status onboarding_status_enum,
    to_status onboarding_status_enum NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_history_company_id ON public.partner_application_history(company_id);

-- 4. Add Bank Account Type & Terms Version to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bank_account_type TEXT; -- e.g. 'Savings', 'Current'
ALTER TABLE companies ADD COLUMN IF NOT EXISTS terms_version TEXT;

-- 5. Data Migration logic for onboarding_status based on verification_status
-- (Wrapped in DO block so it doesn't fail if the column was already dropped)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'verification_status'
    ) THEN
        EXECUTE 'UPDATE companies SET onboarding_status = ''APPROVED'' WHERE verification_status = ''approved''';
        EXECUTE 'UPDATE companies SET onboarding_status = ''READY_FOR_REVIEW'' WHERE verification_status = ''pending''';
        EXECUTE 'UPDATE companies SET onboarding_status = ''REJECTED'' WHERE verification_status = ''rejected''';
        EXECUTE 'UPDATE companies SET onboarding_status = ''SUSPENDED'' WHERE verification_status = ''suspended''';
        
        -- Any existing ones that don't match those rules fall back to REGISTERED if they are null
        EXECUTE 'UPDATE companies SET onboarding_status = ''REGISTERED'' WHERE onboarding_status IS NULL';
        
        -- Safe drop if required, but since this is phase 1.1 we assume it might already be dropped
        -- EXECUTE 'ALTER TABLE companies DROP COLUMN verification_status CASCADE';
    END IF;
END
$$;

-- 6. Drop document URLs from companies (Since they are now in partner_documents)
ALTER TABLE companies DROP COLUMN IF EXISTS owner_id_document_url;
ALTER TABLE companies DROP COLUMN IF EXISTS registration_document_url;
ALTER TABLE companies DROP COLUMN IF EXISTS gst_document_url;
ALTER TABLE companies DROP COLUMN IF EXISTS pan_document_url;
