const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching companies...");
  const { data: companies, error: err1 } = await supabase.from('companies').select('id, name');
  if (err1) console.error("Error fetching companies:", err1);
  console.log("Companies count:", companies?.length);
  console.log("Companies:", companies);

  console.log("\nFetching treks...");
  const { data: treks, error: err2 } = await supabase.from('treks').select('id, title, company_id');
  if (err2) console.error("Error fetching treks:", err2);
  console.log("Treks count:", treks?.length);
  console.log("Treks:", treks);
}

run();
