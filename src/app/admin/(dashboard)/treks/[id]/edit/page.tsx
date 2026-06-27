import React from 'react';
import { getTrek } from '@/lib/admin/treks';
import { getCompanies } from '@/lib/admin/companies';
import { TrekEditor } from '@/components/admin/treks/editor/TrekEditor';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = "force-dynamic";

export default async function EditTrekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let trek, companies, masterTreks;
  try {
    const supabase = createAdminClient();
    const results = await Promise.all([
      getTrek(id),
      getCompanies(),
      supabase.from('master_treks').select('id, name, category:master_trek_categories(name), region:regions(name)').eq('status', 'active').order('name', { ascending: true })
    ]);
    trek = results[0];
    companies = results[1];
    masterTreks = results[2].data;
  } catch {
    notFound();
  }
  
  return <TrekEditor initialTrek={trek} companies={companies} masterTreks={masterTreks || []} />;
}
