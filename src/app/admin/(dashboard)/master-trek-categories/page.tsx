import React from 'react';
import { CategoryStats } from '@/components/admin/master-trek-categories/CategoryStats';
import { CategoryFilters } from '@/components/admin/master-trek-categories/CategoryFilters';
import { CategoriesTable } from '@/components/admin/master-trek-categories/CategoriesTable';
import { CreateCategoryButton } from '@/components/admin/master-trek-categories/CreateCategoryButton';

export const dynamic = "force-dynamic";

interface CategoriesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Master Trek Categories</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage categories for Master Treks (e.g. Winter Treks, Weekend Treks).</p>
        </div>
        <CreateCategoryButton />
      </div>

      <CategoryStats />
      
      <div className="space-y-4">
        <CategoryFilters />
        <CategoriesTable searchQuery={q} sortBy={sort} />
      </div>
    </div>
  );
}
