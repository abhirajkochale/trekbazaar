"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks: any[];
  placeholder?: string;
  error?: boolean;
}

export function SearchableMasterTrekSelect({ value, onChange, masterTreks = [], placeholder = "Search and select a Destination...", error }: Props) {
  const [mtSearch, setMtSearch] = useState('');
  const [mtOpen, setMtOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMtOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMasterTrek = masterTreks.find(mt => mt.id === value);
  const filteredMasterTreks = masterTreks.filter(mt => {
    const searchStr = `${mt.name} ${mt.category?.name || ''} ${mt.region?.name || ''}`.toLowerCase();
    return searchStr.includes(mtSearch.toLowerCase());
  });

  return (
    <div ref={dropdownRef} className="relative">
      <div 
        className={`flex items-center justify-between cursor-pointer bg-white rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary ${error ? 'border-red-300 focus:border-red-500' : 'border-zinc-300 focus:border-tb-primary'}`}
        onClick={() => {
          setMtOpen(!mtOpen);
          setMtSearch('');
        }}
      >
        <span className={selectedMasterTrek ? "text-zinc-900 truncate" : "text-zinc-500 truncate"}>
          {selectedMasterTrek ? selectedMasterTrek.name : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
      </div>

      {mtOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-md shadow-lg">
          <div className="p-2 border-b border-zinc-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-400 ml-1" />
            <input
              type="text"
              autoFocus
              className="w-full text-sm outline-none placeholder-zinc-400"
              placeholder="Search by name, category, or region..."
              value={mtSearch}
              onChange={(e) => setMtSearch(e.target.value)}
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filteredMasterTreks.length === 0 ? (
              <li className="px-3 py-2 text-sm text-zinc-500 text-center">No matching treks found.</li>
            ) : (
              filteredMasterTreks.map(mt => (
                <li
                  key={mt.id}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-zinc-50 flex items-center justify-between ${mt.id === value ? 'bg-tb-primary/5 text-tb-primary font-medium' : 'text-zinc-700'}`}
                  onClick={() => {
                    onChange(mt.id);
                    setMtOpen(false);
                  }}
                >
                  <div className="truncate pr-4">
                    <div className="truncate">{mt.name}</div>
                    <div className="text-xs text-zinc-500 font-normal truncate">
                      {mt.category?.name || 'Uncategorized'} • {mt.region?.name || 'No Region'}
                    </div>
                  </div>
                  {mt.id === value && <Check className="w-4 h-4 shrink-0" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
