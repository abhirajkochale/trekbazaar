"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { RegionForm } from './RegionForm';

export function CreateRegionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-tb-primary text-white text-sm font-semibold rounded-lg hover:bg-tb-primary/90 transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Create Region
      </button>
      <RegionForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
