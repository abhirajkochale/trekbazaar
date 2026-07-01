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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  // Check RLS policies for storage and treks
  const { data: policies, error } = await supabase.rpc('get_policies'); // Might not exist
  if (error) {
    // Let's just query pg_policies directly
    const { data: pgPolicies, error: pgError } = await supabase.from('pg_policies').select('*').limit(50);
    console.log(pgError ? "Cannot read pg_policies" : "Policies:", pgPolicies);
  }
}

check();
