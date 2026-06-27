-- Migration: Assign legacy treks to a default company
-- Created at: 2026-06-27 14:00:00

DO $$ 
DECLARE 
    v_company_id uuid;
BEGIN
    -- 1. Try to find the default internal company
    SELECT id INTO v_company_id FROM public.companies WHERE slug = 'trekbazaar-internal' LIMIT 1;
    
    -- 2. If it doesn't exist, ALWAYS create it
    IF v_company_id IS NULL THEN
        INSERT INTO public.companies (
            name, 
            slug, 
            description, 
            verification_status, 
            status,
            contact_person
        ) 
        VALUES (
            'TrekBazaar Internal', 
            'trekbazaar-internal', 
            'Default internal company for legacy and first-party treks.', 
            'verified', 
            'active',
            'TrekBazaar Admin'
        )
        RETURNING id INTO v_company_id;
    END IF;

    -- 3. Update all orphan treks (if any exist)
    UPDATE public.treks 
    SET company_id = v_company_id
    WHERE company_id IS NULL;
    
END $$;
