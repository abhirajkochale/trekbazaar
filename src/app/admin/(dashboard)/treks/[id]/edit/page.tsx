import React from 'react';
import { getTrek } from '@/lib/admin/treks';
import { TrekEditor } from '@/components/admin/treks/editor/TrekEditor';
import { notFound } from 'next/navigation';

export default async function EditTrekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const trek = await getTrek(id);
    return <TrekEditor initialTrek={trek} />;
  } catch {
    notFound();
  }
}
