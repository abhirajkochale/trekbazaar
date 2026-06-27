import React from 'react';
import { DepartureEditor } from '@/components/admin/departures/editor/DepartureEditor';
import { getCompanies } from '@/lib/admin/companies';
import { getTreks } from '@/lib/admin/treks';

export default async function NewDeparturePage() {
  const [companies, treks] = await Promise.all([
    getCompanies(),
    getTreks()
  ]);
  
  return <DepartureEditor companies={companies} treks={treks} />;
}
