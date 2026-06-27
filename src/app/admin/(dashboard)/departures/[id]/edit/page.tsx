import React from 'react';
import { getDeparture } from '@/lib/admin/departures';
import { getCompanies } from '@/lib/admin/companies';
import { getTreks } from '@/lib/admin/treks';
import { DepartureEditor } from '@/components/admin/departures/editor/DepartureEditor';
import { notFound } from 'next/navigation';

export default async function EditDeparturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let departure, companies, treks;
  try {
    [departure, companies, treks] = await Promise.all([
      getDeparture(id),
      getCompanies(),
      getTreks()
    ]);
  } catch {
    notFound();
  }
  
  return <DepartureEditor initialDeparture={departure} companies={companies} treks={treks} />;
}
