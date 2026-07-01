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

async function testUpload() {
  // Use anon key, simulating a user. But we need a valid JWT.
  // Let's use service key to bypass RLS, or admin client to check bucket.
  const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await adminClient.storage.getBucket('media');
  console.log("Media Bucket Details:", data, error);
}

testUpload();
