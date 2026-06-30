"use client";

import React, { useState } from 'react';
import type { Trek } from '@/lib/types';
import { Plus, X, GripVertical } from 'lucide-react';

interface Props {
  trek: Partial<Trek>;
  field: keyof Trek;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
  placeholder?: string;
}

export function DynamicListSection({ trek, field, updateField, placeholder }: Props) {
  const items = (trek[field] as string[]) || [];
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    updateField(field, [...items, newItem.trim()]);
    setNewItem('');
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    updateField(field, newItems);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    
    updateField(field, newItems);
  };

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li 
              key={`${item}-${index}`} 
              className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-md p-2 group"
            >
              <div className="flex flex-col gap-0.5 text-zinc-300">
                <button 
                  type="button" 
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="hover:text-zinc-600 disabled:opacity-0"
                >
                  <GripVertical className="w-4 h-4 rotate-90" />
                </button>
              </div>
              <span className="flex-1 text-sm text-zinc-700">{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-zinc-400 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder || "Add new item..."}
          className="flex-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="p-2 bg-tb-primary text-white rounded-md hover:bg-tb-primary/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
