"use client";

import React, { useState } from 'react';
import type { Trek, ItineraryDay } from '@/lib/types';
import { Plus, X, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-xs font-medium text-zinc-500";

export function ItineraryBuilder({ trek, updateField }: Props) {
  const itinerary = (trek.itinerary as ItineraryDay[]) || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddDay = () => {
    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      title: '',
      description: '',
      altitude: '',
      accommodation: '',
      distance: '',
      meals: '',
      hours: ''
    };
    updateField('itinerary', [...itinerary, newDay]);
    setExpandedIndex(itinerary.length);
  };

  const handleRemoveDay = (index: number) => {
    const newItin = [...itinerary];
    newItin.splice(index, 1);
    
    // Re-number days
    newItin.forEach((dayItem, i) => {
      dayItem.day = i + 1;
    });
    
    updateField('itinerary', newItin);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: string) => {
    const newItin = [...itinerary];
    newItin[index] = { ...newItin[index], [field]: value };
    updateField('itinerary', newItin);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === itinerary.length - 1) return;

    const newItin = [...itinerary];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newItin[index], newItin[swapIndex]] = [newItin[swapIndex], newItin[index]];
    
    // Re-number days
    newItin.forEach((dayItem, i) => {
      dayItem.day = i + 1;
    });
    
    updateField('itinerary', newItin);
    
    if (expandedIndex === index) setExpandedIndex(swapIndex);
    else if (expandedIndex === swapIndex) setExpandedIndex(index);
  };

  return (
    <div className="space-y-4">
      {itinerary.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-lg">
          <p className="text-sm text-zinc-500 mb-4">No itinerary days added yet.</p>
          <button
            type="button"
            onClick={handleAddDay}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Day 1
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {itinerary.map((dayItem, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div key={index} className="border border-zinc-200 rounded-lg bg-white overflow-hidden shadow-sm">
                <div 
                  className="flex items-center gap-3 p-3 bg-zinc-50 border-b border-zinc-200 cursor-pointer"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <div className="flex flex-col gap-0.5 text-zinc-400">
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }}
                      disabled={index === 0}
                      className="hover:text-zinc-700 disabled:opacity-0 p-0.5"
                    >
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                  
                  <div className="flex-shrink-0 bg-tb-primary text-white text-xs font-bold px-2 py-1 rounded">
                    Day {dayItem.day}
                  </div>
                  
                  <div className="flex-1 font-medium text-sm text-zinc-900 truncate">
                    {dayItem.title || 'Untitled Day'}
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveDay(index); }}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className={labelClasses}>Day Title</label>
                      <input
                        type="text"
                        value={dayItem.title}
                        onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g. Drive from Manali to Jobra"
                      />
                    </div>
                    
                    <div>
                      <label className={labelClasses}>Description</label>
                      <textarea
                        rows={4}
                        value={dayItem.description}
                        onChange={(e) => handleUpdateDay(index, 'description', e.target.value)}
                        className={inputClasses}
                        placeholder="Detailed itinerary for the day..."
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className={labelClasses}>Altitude</label>
                        <input
                          type="text"
                          value={dayItem.altitude}
                          onChange={(e) => handleUpdateDay(index, 'altitude', e.target.value)}
                          className={inputClasses}
                          placeholder="9,800 ft"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Distance</label>
                        <input
                          type="text"
                          value={dayItem.distance}
                          onChange={(e) => handleUpdateDay(index, 'distance', e.target.value)}
                          className={inputClasses}
                          placeholder="2 km"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Accommodation</label>
                        <input
                          type="text"
                          value={dayItem.accommodation}
                          onChange={(e) => handleUpdateDay(index, 'accommodation', e.target.value)}
                          className={inputClasses}
                          placeholder="Tents"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Meals</label>
                        <input
                          type="text"
                          value={dayItem.meals}
                          onChange={(e) => handleUpdateDay(index, 'meals', e.target.value)}
                          className={inputClasses}
                          placeholder="B, L, D"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Hours</label>
                        <input
                          type="text"
                          value={dayItem.hours || ''}
                          onChange={(e) => handleUpdateDay(index, 'hours', e.target.value)}
                          className={inputClasses}
                          placeholder="e.g. 5-6 hours"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <button
            type="button"
            onClick={handleAddDay}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-tb-primary border-2 border-dashed border-tb-primary/30 rounded-lg hover:bg-tb-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Day {itinerary.length + 1}
          </button>
        </div>
      )}
    </div>
  );
}
