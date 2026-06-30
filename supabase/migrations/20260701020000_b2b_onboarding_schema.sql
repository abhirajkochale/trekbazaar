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
ALTER TABLE companies DROP COLUMN IF EXISTS verification_status;

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
