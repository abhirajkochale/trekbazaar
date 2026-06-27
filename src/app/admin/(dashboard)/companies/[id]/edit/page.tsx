import React from 'react';
import { getCompany } from '@/lib/admin/companies';
import { CompanyEditor } from '@/components/admin/companies/editor/CompanyEditor';
import { notFound } from 'next/navigation';

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let company;
  try {
    company = await getCompany(id);
  } catch {
    notFound();
  }
  
  return <CompanyEditor initialCompany={company} />;
}
