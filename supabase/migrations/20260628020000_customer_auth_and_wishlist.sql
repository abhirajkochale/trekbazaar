-- Migration: Add customer profiles, wishlists, and future-proof bookings
-- Created at: 2026-06-28 02:00:00

-- 1. Create customer_profiles table
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    saved_travellers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own profile" 
ON public.customer_profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Customers can update their own profile" 
ON public.customer_profiles FOR UPDATE 
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Trigger for updated_at on customer_profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'customer_profiles_set_updated_at') THEN
    CREATE TRIGGER customer_profiles_set_updated_at
      BEFORE UPDATE ON public.customer_profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;


-- 2. Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    trek_id UUID NOT NULL REFERENCES public.treks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(customer_id, trek_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage their own wishlist" 
ON public.wishlists FOR ALL 
USING (customer_id = auth.uid()) WITH CHECK (customer_id = auth.uid());


-- 3. Modify bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'partial', 'paid', 'failed', 'refunded'));

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);

-- RLS for bookings (so customers can view their own)
DROP POLICY IF EXISTS "Customers can view their own bookings" ON public.bookings;
CREATE POLICY "Customers can view their own bookings" 
ON public.bookings FOR SELECT 
USING (customer_id = auth.uid());


-- 4. Auto-Linking Trigger: On User Signup
CREATE OR REPLACE FUNCTION public.handle_new_customer_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if this user has role 'authenticated' (standard signup)
    -- Insert into customer_profiles
    INSERT INTO public.customer_profiles (id, first_name, last_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Trekker'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email
    );
    
    -- Auto-link any existing guest bookings based on email match
    UPDATE public.bookings 
    SET customer_id = NEW.id 
    WHERE customer_email = NEW.email AND customer_id IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_customer_signup();


-- 5. Modify create_booking RPC
-- We drop the existing one and recreate it to add p_customer_id
DROP FUNCTION IF EXISTS public.create_booking(uuid, integer, text, text, text, text);

CREATE OR REPLACE FUNCTION create_booking(
    p_departure_id uuid,
    p_travellers integer,
    p_name text,
    p_email text,
    p_phone text,
    p_notes text,
    p_customer_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_departure record;
    v_available integer;
    v_unit_price numeric;
    v_total_amount numeric;
    v_booking_ref text;
    v_booking record;
BEGIN
    -- 1. Lock the departure row to prevent race conditions
    SELECT * INTO v_departure 
    FROM public.departures 
    WHERE id = p_departure_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Departure not found';
    END IF;

    -- 2. Validate Departure Status and Active state
    IF v_departure.status IN ('Full', 'Cancelled', 'Completed') THEN
        RAISE EXCEPTION 'Departure is %', v_departure.status;
    END IF;

    IF v_departure.is_active = false THEN
        RAISE EXCEPTION 'Departure is no longer active';
    END IF;

    -- 3. Check seat availability
    v_available := v_departure.total_seats - v_departure.booked_seats;
    IF p_travellers > v_available THEN
        RAISE EXCEPTION 'Not enough seats available. Only % left.', v_available;
    END IF;

    -- 4. Calculate definitive price
    v_unit_price := COALESCE(v_departure.offer_price, v_departure.base_price);
    v_total_amount := v_unit_price * p_travellers;

    -- 5. Generate secure booking reference (e.g. TB-000042)
    v_booking_ref := 'TB-' || lpad(nextval('booking_ref_seq')::text, 6, '0');

    -- 6. Insert Booking
    INSERT INTO public.bookings (
        booking_reference, 
        departure_id, 
        trek_id, 
        company_id,
        customer_id,
        customer_name, 
        customer_email, 
        customer_phone,
        travellers_count, 
        departure_date,
        departure_price,
        total_amount, 
        status, 
        payment_status,
        notes
    ) VALUES (
        v_booking_ref, 
        p_departure_id, 
        v_departure.trek_id, 
        (SELECT company_id FROM public.treks WHERE id = v_departure.trek_id),
        p_customer_id,
        p_name, 
        p_email, 
        p_phone, 
        p_travellers, 
        v_departure.departure_date,
        v_unit_price,
        v_total_amount, 
        'Pending',
        'pending', 
        p_notes
    ) RETURNING * INTO v_booking;

    -- 7. Update Departure Seats
    UPDATE public.departures 
    SET 
        booked_seats = booked_seats + p_travellers,
        status = CASE 
            WHEN booked_seats + p_travellers >= total_seats THEN 'Full' 
            ELSE status 
        END
    WHERE id = p_departure_id;

    -- Return JSON representation of the new booking
    RETURN row_to_json(v_booking);
END;
$$;
