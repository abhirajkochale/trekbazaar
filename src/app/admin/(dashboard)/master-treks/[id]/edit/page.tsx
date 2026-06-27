import React from 'react';
import { MasterTrekEditor } from '@/components/admin/master-treks/editor/MasterTrekEditor';
import { getMasterTrekCategories } from '@/lib/admin/categories';
import { getRegions } from '@/lib/admin/regions';
import { getMasterTrekById } from '@/lib/admin/master-treks';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

interface EditMasterTrekPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMasterTrekPage({ params }: EditMasterTrekPageProps) {
  const { id } = await params;
  
  const [masterTrek, categories, regions] = await Promise.all([
    getMasterTrekById(id),
    getMasterTrekCategories(),
    getRegions()
  ]);

  if (!masterTrek) {
    notFound();
  }

  return <MasterTrekEditor initialMasterTrek={masterTrek} categories={categories} regions={regions} />;
}
