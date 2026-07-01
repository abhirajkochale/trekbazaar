const fs = require('fs');
const envContent = fs.readFileSync('c:/Projects/trekbazaar/.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...value] = line.split('=');
    if (key) env[key.trim()] = value.join('=').trim();
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function clearDatabase() {
  const tablesToDelete = [
    'bookings',
    'enquiries',
    'partner_documents',
    'partner_application_history',
    'search_logs',
    'master_wishlists',
    'departures',
    'treks',
    'master_treks',
    'companies',
    'customer_profiles'
  ];

  console.log("Starting deletion process...");

  for (const table of tablesToDelete) {
    console.log(`Deleting data from ${table}...`);
    // In Supabase, delete all requires a filter. We can use .neq('id', 'some-impossible-uuid') or .neq('id', '00000000-0000-0000-0000-000000000000') 
    // but the easiest way to delete all rows is to use .not('id', 'is', null) 
    
    // We don't know the exact primary key for all, but most use 'id'
    const { data, error } = await supabase
      .from(table)
      .delete()
      .not('id', 'is', null);

    if (error) {
      console.error(`Error deleting from ${table}:`, error.message);
    } else {
      console.log(`Successfully cleared ${table}`);
    }
  }
  
  console.log("Database cleanup complete!");
}

clearDatabase();
