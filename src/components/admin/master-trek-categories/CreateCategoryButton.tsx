"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryForm } from './CategoryForm';

export function CreateCategoryButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-tb-primary text-white rounded-lg hover:bg-tb-primary/90 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Create Category
      </button>

      <CategoryForm 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
