import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omrjjrswvhcbvibuhgvq.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  const { data: companies, error: cError } = await supabase.from('companies').select('id, name, owner_id');
  if (cError) {
    console.error('Error fetching companies:', cError);
    return;
  }

  console.log('--- Company Credentials ---');
  for (const c of companies) {
    if (c.owner_id) {
      const user = users.users.find(u => u.id === c.owner_id);
      if (user) {
        console.log(`Company: ${c.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: password123 (Default for seeds)`);
        console.log('---------------------------');
      }
    }
  }
  
  // also print all users just in case
  console.log('\n--- All Users ---');
  for (const u of users.users) {
    console.log(`Email: ${u.email} | ID: ${u.id}`);
  }
}

run();
