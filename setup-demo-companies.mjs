import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omrjjrswvhcbvibuhgvq.supabase.co';
const serviceRoleKey = '***REMOVED***';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createDemoCompany(email, password, companyName) {
  // 1. Check if user exists, if not create them
  const { data: listData } = await supabase.auth.admin.listUsers();
  let user = listData.users.find(u => u.email === email);
  
  if (!user) {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (authErr) {
      console.error(`Failed to create user ${email}:`, authErr);
      return;
    }
    user = authData.user;
    console.log(`Created user ${email} with ID ${user.id}`);
  } else {
    console.log(`User ${email} already exists with ID ${user.id}`);
  }

  // 2. Assign user as owner of the company
  const { data: companies, error: compErr } = await supabase.from('companies').select('id, name').eq('name', companyName);
  if (compErr || !companies || companies.length === 0) {
    console.error(`Could not find company ${companyName}`);
    return;
  }
  
  const company = companies[0];
  const { error: updateErr } = await supabase.from('companies').update({ owner_id: user.id }).eq('id', company.id);
  if (updateErr) {
    console.error(`Failed to assign owner for ${companyName}:`, updateErr);
  } else {
    console.log(`Successfully assigned ${email} as owner of ${companyName}`);
  }
}

async function run() {
  console.log('Setting up demo companies...');
  await createDemoCompany('demo@indiahikes.com', 'Indiahikes@123', 'Indiahikes');
  await createDemoCompany('demo@tth.com', 'Tth@1234', 'Trek The Himalayas');
  console.log('Done!');
}

run();
