-- 20260627110000_add_departures_table.sql

CREATE TABLE IF NOT EXISTS departures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id uuid NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
  
  departure_date date NOT NULL,
  return_date date NOT NULL,
  
  base_price numeric NOT NULL,
  offer_price numeric,
  
  total_seats integer NOT NULL,
  booked_seats integer DEFAULT 0,
  
  pickup_location text,
  notes text,
  
  status text DEFAULT 'Upcoming', -- Upcoming, Full, Cancelled, Completed
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_departures_trek_id ON departures(trek_id);
CREATE INDEX IF NOT EXISTS idx_departures_departure_date ON departures(departure_date);
CREATE INDEX IF NOT EXISTS idx_departures_status ON departures(status);
CREATE INDEX IF NOT EXISTS idx_departures_is_active ON departures(is_active);
