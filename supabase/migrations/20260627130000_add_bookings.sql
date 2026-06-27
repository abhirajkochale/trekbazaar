-- Migration: Add bookings table and core marketplace RPC
-- Created at: 2026-06-27 13:00:00

CREATE SEQUENCE IF NOT EXISTS booking_ref_seq START 1;

CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_reference text NOT NULL UNIQUE,
    departure_id uuid NOT NULL REFERENCES public.departures(id) ON DELETE RESTRICT,
    trek_id uuid NOT NULL REFERENCES public.treks(id) ON DELETE RESTRICT,
    company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    
    travellers_count integer NOT NULL CHECK (travellers_count > 0),
    
    -- Snapshot fields for data integrity
    departure_date date NOT NULL,
    departure_price numeric NOT NULL CHECK (departure_price >= 0),
    total_amount numeric NOT NULL CHECK (total_amount >= 0),
    
    status text NOT NULL DEFAULT 'Pending' 
        CHECK (status IN ('Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Completed')),
    
    notes text,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_departure_id ON public.bookings(departure_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trek_id ON public.bookings(trek_id);
CREATE INDEX IF NOT EXISTS idx_bookings_company_id ON public.bookings(company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON public.bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Note: In a real system, you'd have policies allowing users to view their own bookings.
-- For this MVP, since we don't have user accounts yet, the public can't SELECT bookings,
-- but the server action (using service role or RPC with SECURITY DEFINER) can create and read them.

-- Trigger for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'bookings_set_updated_at') THEN
    CREATE TRIGGER bookings_set_updated_at
      BEFORE UPDATE ON public.bookings
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- RPC for secure atomic booking creation
CREATE OR REPLACE FUNCTION create_booking(
    p_departure_id uuid,
    p_travellers integer,
    p_name text,
    p_email text,
    p_phone text,
    p_notes text
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

    -- 4. Calculate definitive price (Server-side only)
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
        customer_name, 
        customer_email, 
        customer_phone,
        travellers_count, 
        departure_date,
        departure_price,
        total_amount, 
        status, 
        notes
    ) VALUES (
        v_booking_ref, 
        p_departure_id, 
        v_departure.trek_id, 
        (SELECT company_id FROM public.treks WHERE id = v_departure.trek_id),
        p_name, 
        p_email, 
        p_phone, 
        p_travellers, 
        v_departure.departure_date,
        v_unit_price,
        v_total_amount, 
        'Pending', 
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
