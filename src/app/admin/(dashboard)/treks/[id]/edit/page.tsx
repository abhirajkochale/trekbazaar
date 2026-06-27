import React from 'react';
import { getTrek } from '@/lib/admin/treks';
import { getCompanies } from '@/lib/admin/companies';
import { TrekEditor } from '@/components/admin/treks/editor/TrekEditor';
import { notFound } from 'next/navigation';

export default async function EditTrekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let trek, companies;
  try {
    [trek, companies] = await Promise.all([
      getTrek(id),
      getCompanies()
    ]);
  } catch {
    notFound();
  }
  
  return <TrekEditor initialTrek={trek} companies={companies} />;
}
