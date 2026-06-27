"use client";

import React, { useState } from 'react';
import type { CategoryWithStats } from '@/lib/admin/categories';
import { Pencil, Trash2 } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

interface CategoryRowProps {
  category: CategoryWithStats;
}

export function CategoryRow({ category }: CategoryRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-zinc-50 transition-colors group">
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900">{category.name}</span>
            <span className="text-xs text-zinc-500">{category.slug}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
            {category.master_treks_count}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            category.status === 'active' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-zinc-100 text-zinc-700'
          }`}>
            {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsEditOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-tb-primary hover:bg-tb-primary/10 rounded-md transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDeleteOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      <CategoryForm 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        category={category} 
      />

      <DeleteCategoryDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        categoryId={category.id}
        categoryName={category.name}
        treksCount={category.master_treks_count}
      />
    </>
  );
}
