/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const url = urlMatch[1].trim().replace(/['"]/g, '');
const key = keyMatch[1].trim().replace(/['"]/g, '');

async function run() {
  const tRes = await fetch(`${url}/rest/v1/departures?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const text = await tRes.text();
  console.log("Departures via anon:", text);
}

run();
