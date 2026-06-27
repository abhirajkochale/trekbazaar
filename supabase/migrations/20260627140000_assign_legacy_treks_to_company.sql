-- Migration: Assign legacy treks to a default company
-- Created at: 2026-06-27 14:00:00

DO $$ 
DECLARE 
    v_company_id uuid;
BEGIN
    -- Only proceed if there is at least one trek without a company
    IF EXISTS (SELECT 1 FROM public.treks WHERE company_id IS NULL) THEN
        
        -- Try to find the default internal company
        SELECT id INTO v_company_id FROM public.companies WHERE slug = 'trekbazaar-internal' LIMIT 1;
        
        -- If it doesn't exist, create it
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

        -- Update all orphan treks
        UPDATE public.treks 
        SET company_id = v_company_id
        WHERE company_id IS NULL;
        
    END IF;
END $$;
