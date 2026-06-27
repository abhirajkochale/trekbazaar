import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export function CreateMasterTrekButton() {
  return (
    <Link 
      href="/admin/master-treks/new"
      className="flex items-center gap-2 px-4 py-2 bg-tb-primary text-white rounded-lg hover:bg-tb-primary/90 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
    >
      <Plus className="w-4 h-4" />
      Create Master Trek
    </Link>
  );
}
