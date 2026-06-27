"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Trek, Company } from '@/lib/types';
import { slugify } from '@/lib/format';
import Link from 'next/link';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
  companies?: Company[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks?: any[];
  isCompanyPortal?: boolean;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function BasicInfoSection({ trek, updateField, companies = [], masterTreks = [], isCompanyPortal }: Props) {
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    updateField('title', newTitle);
    if (!trek.id) { // Only auto-slug for new treks to prevent breaking existing URLs
      updateField('slug', slugify(newTitle));
    }
  };

  const selectedMasterTrek = masterTreks.find(mt => mt.id === trek.master_trek_id);
  const filteredMasterTreks = masterTreks.filter(mt => {
    const searchStr = `${mt.name} ${mt.category?.name || ''} ${mt.region?.name || ''}`.toLowerCase();
    return searchStr.includes(mtSearch.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={trek.title || ''}
            onChange={handleTitleChange}
            className={inputClasses}
            placeholder="e.g. Hampta Pass Trek"
          />
        </div>
        <div>
          <label className={labelClasses}>Slug <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={trek.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            className={inputClasses}
            placeholder="e.g. hampta-pass-trek"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div ref={dropdownRef} className="relative">
          <label className={labelClasses}>Master Trek <span className="text-red-500">*</span></label>
          <div 
            className={`${inputClasses} flex items-center justify-between cursor-pointer bg-white`}
            onClick={() => {
              setMtOpen(!mtOpen);
              setMtSearch('');
            }}
          >
            <span className={selectedMasterTrek ? "text-zinc-900" : "text-zinc-500"}>
              {selectedMasterTrek ? selectedMasterTrek.name : "Search and select a Master Trek..."}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
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
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-zinc-50 flex items-center justify-between ${mt.id === trek.master_trek_id ? 'bg-tb-primary/5 text-tb-primary font-medium' : 'text-zinc-700'}`}
                      onClick={() => {
                        updateField('master_trek_id', mt.id);
                        setMtOpen(false);
                      }}
                    >
                      <div>
                        <div>{mt.name}</div>
                        <div className="text-xs text-zinc-500 font-normal">
                          {mt.category?.name || 'Uncategorized'} • {mt.region?.name || 'No Region'}
                        </div>
                      </div>
                      {mt.id === trek.master_trek_id && <Check className="w-4 h-4" />}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          
          {isCompanyPortal && (
            <p className="mt-2 text-xs text-zinc-500">
              Can&apos;t find your trek? <Link href="/company/enquiries" className="text-tb-primary hover:underline">Contact TrekBazaar Admin</Link> to add it.
            </p>
          )}
        </div>

        {!isCompanyPortal && (
          <div>
            <label className={labelClasses}>Company (Partner) <span className="text-red-500">*</span></label>
            <select
              value={trek.company_id || ''}
              onChange={(e) => updateField('company_id', e.target.value || null)}
              className={inputClasses}
              required
            >
              <option value="">Select a Company</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelClasses}>Region</label>
          <select
            value={trek.region || ''}
            onChange={(e) => updateField('region', e.target.value)}
            className={inputClasses}
          >
            <option value="">Select Region</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Sikkim">Sikkim</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Difficulty</label>
          <select
            value={trek.difficulty || 'moderate'}
            onChange={(e) => updateField('difficulty', e.target.value as Trek['difficulty'])}
            className={inputClasses}
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Status</label>
          <select
            value={trek.status || 'draft'}
            onChange={(e) => updateField('status', e.target.value as Trek['status'])}
            className={inputClasses}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Duration (Days)</label>
          <input
            type="number"
            min="1"
            value={trek.duration_days || ''}
            onChange={(e) => updateField('duration_days', parseInt(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Price Per Person (₹)</label>
          <input
            type="number"
            min="0"
            value={trek.price_per_person || ''}
            onChange={(e) => updateField('price_per_person', parseInt(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Short Description</label>
        <textarea
          rows={2}
          value={trek.short_description || ''}
          onChange={(e) => updateField('short_description', e.target.value)}
          className={inputClasses}
          placeholder="Brief 1-2 sentence summary for cards..."
        />
      </div>

      <div>
        <label className={labelClasses}>Full Description</label>
        <textarea
          rows={5}
          value={trek.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          className={inputClasses}
          placeholder="Detailed description of the trek..."
        />
      </div>
    </div>
  );
}
