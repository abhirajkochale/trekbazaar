import React from 'react';
import { MasterTrekEditor } from '@/components/admin/master-treks/editor/MasterTrekEditor';
import { getMasterTrekCategories } from '@/lib/admin/categories';
import { getRegions } from '@/lib/admin/regions';

export const dynamic = "force-dynamic";

export default async function NewMasterTrekPage() {
  const categories = await getMasterTrekCategories();
  const regions = await getRegions();

  return <MasterTrekEditor categories={categories} regions={regions} />;
}
