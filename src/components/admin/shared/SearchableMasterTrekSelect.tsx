"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Plus, Loader2 } from 'lucide-react';
import { createInlineMasterTrekAction } from '@/app/partner/dashboard/treks/actions';

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

  const [isCreating, setIsCreating] = useState(false);
  
  // We keep a local list of master treks so we can optimistically add newly created ones without waiting for page reload
  const [localMasterTreks, setLocalMasterTreks] = useState(masterTreks);
  
  // Sync if props change
  useEffect(() => {
    setLocalMasterTreks(masterTreks);
  }, [masterTreks]);

  const selectedMasterTrek = localMasterTreks.find(mt => mt.id === value);
  const filteredMasterTreks = localMasterTreks.filter(mt => {
    const searchStr = `${mt.name} ${mt.category?.name || ''} ${mt.region?.name || ''}`.toLowerCase();
    return searchStr.includes(mtSearch.toLowerCase());
  });

  const exactMatchExists = localMasterTreks.some(mt => mt.name.toLowerCase() === mtSearch.toLowerCase());

  const handleCreate = async () => {
    if (!mtSearch.trim() || isCreating) return;
    setIsCreating(true);
    
    try {
      const res = await createInlineMasterTrekAction(mtSearch.trim());
      if (res.success && res.masterTrekId) {
        // Optimistically add it to the local list so it shows as selected
        setLocalMasterTreks(prev => [...prev, { id: res.masterTrekId, name: res.masterTrekName }]);
        onChange(res.masterTrekId);
        setMtOpen(false);
        setMtSearch('');
      } else {
        alert(res.error || "Failed to create destination");
      }
    } catch (e) {
      console.error(e);
      alert("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

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
            ) : null}
            
            {mtSearch.trim().length > 0 && !exactMatchExists && (
              <li 
                className="px-3 py-2 text-sm cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center border-b border-blue-100"
                onClick={handleCreate}
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                <span className="font-medium">Create new destination: &quot;{mtSearch.trim()}&quot;</span>
              </li>
            )}
            
            {filteredMasterTreks.length > 0 && (
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
