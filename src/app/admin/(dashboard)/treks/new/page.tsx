import React from 'react';
import { getCompanies } from '@/lib/admin/companies';
import { TrekEditor } from '@/components/admin/treks/editor/TrekEditor';

export default async function NewTrekPage() {
  const companies = await getCompanies();
  return <TrekEditor companies={companies} />;
}
