import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // use service role to avoid RLS for querying

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log("Fetching departure...");
  const { data: dep, error: depError } = await supabase.from('departures').select('*').limit(1).single();
  if (depError) return console.error(depError);
  
  console.log("Calling create_booking...");
  const { data, error } = await supabase.rpc('create_booking', {
      p_departure_id: dep.id,
      p_travellers: 1,
      p_name: "Debug User",
      p_email: "debug@example.com",
      p_phone: "1234567890",
      p_notes: "test",
      p_customer_id: "00000000-0000-0000-0000-000000000000" // A dummy ID that definitely isn't in customer_profiles
  });
  
  console.log("Result:", data);
  console.log("Error:", error);
}

debug();
