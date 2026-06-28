import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: companies, error: ce } = await supabase.from('companies').select('*').limit(1);
  console.log('Companies:', ce || companies);

  const { data: masterTreks, error: mte } = await supabase.from('master_treks').select('*').limit(1);
  console.log('Master Treks:', mte || masterTreks);

  const { data: treks, error: te } = await supabase.from('treks').select('*').limit(1);
  console.log('Treks:', te || treks);
}
run();
