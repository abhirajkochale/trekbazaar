import React from 'react';
import { getCompanies } from '@/lib/admin/companies';
import { TrekEditor } from '@/components/admin/treks/editor/TrekEditor';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = "force-dynamic";

export default async function NewTrekPage() {
  const supabase = createAdminClient();
  const [companies, { data: masterTreks }] = await Promise.all([
    getCompanies(),
    supabase.from('master_treks').select('id, name, category:master_trek_categories(name), region:regions(name)').eq('status', 'active').order('name', { ascending: true })
  ]);
  return <TrekEditor companies={companies} masterTreks={masterTreks || []} />;
}
