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
const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  const { data, error } = await adminClient.from('master_treks').select('*').limit(1);
  if (data && data.length > 0) {
    console.log("Master Treks Columns:", Object.keys(data[0]));
  }
}
checkSchema();
