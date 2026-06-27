import React from 'react';
import { getMasterTrekCategories } from '@/lib/admin/categories';
import { CategoryRow } from './CategoryRow';
import { AdminCard } from '../shared/AdminCard';

interface CategoriesTableProps {
  searchQuery?: string;
  sortBy?: string;
}

export async function CategoriesTable({ searchQuery, sortBy }: CategoriesTableProps) {
  const categories = await getMasterTrekCategories(searchQuery, sortBy);

  return (
    <AdminCard title="All Categories" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Master Treks</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  {searchQuery ? "No categories found matching your search." : "No categories created yet."}
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
