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

async function checkPolicies() {
  const { data, error } = await adminClient.from('storage.objects').select('*').limit(1);
  console.log("Can query storage.objects?", !error);
  
  // Let's create an RLS policy for the media bucket if it doesn't exist
  // Wait, I can just create the policy via sql but maybe I can't.
  // Instead of dealing with bucket RLS directly, maybe I should just use a server action for image uploads too!
}
checkPolicies();
