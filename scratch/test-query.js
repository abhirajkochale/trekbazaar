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

async function testQuery() {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      treks(
        id,
        status,
        price_per_person,
        master_treks(id, name, region_id, difficulty, category_id, regions(id, name), master_trek_categories(id, name)),
        departures(id, departure_date, status, base_price, offer_price)
      )
    `)
    .eq('onboarding_status', 'APPROVED');
    
  console.log("Error:", error);
}

testQuery();
