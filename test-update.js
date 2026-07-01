const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
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


async function testUpdate() {
  const payload = {
    name: "",
    logo_url: null,
    website: "",
    gst_number: "",
    years_of_experience: 0,
    email: "admin@agroconnect.com",
    phone: "9374181932",
    address: "vbsv",
    city: "obsvb",
    state: "obsfbv",
    contact_person: "",
    updated_at: new Date().toISOString()
  };

  // We need to update any company to see if there's a schema error
  const { data: companies, error: fetchError } = await supabase
    .from("companies")
    .select("id")
    .limit(1);

  if (fetchError || !companies.length) {
    console.error("Fetch error:", fetchError);
    return;
  }

  const { error } = await supabase
    .from("companies")
    .update(payload)
    .eq("id", companies[0].id);

  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Update successful!");
  }
}

testUpdate();
