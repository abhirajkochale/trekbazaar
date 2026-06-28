import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://omrjjrswvhcbvibuhgvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcmpqcnN3dmhjYnZpYnVoZ3ZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ3NzE3MSwiZXhwIjoyMDk4MDUzMTcxfQ.3bgczk7O8Lplaa3HAFjUHWGD3ZFxirQHcJPLb373J4c'
);

async function check() {
  const { data: comp } = await supabase.from('companies').select('id, slug').limit(2);
  console.log("COMPANIES:", comp);

  const { data, error } = await supabase.from('treks').select('id, company_id, master_trek_id, status').limit(5);
  console.log("TREKS:", data);

  const { data: bData } = await supabase.from('departures').select('id, trek_id, status, start_date').limit(5);
  console.log("DEPARTURES:", bData);
}
check();
