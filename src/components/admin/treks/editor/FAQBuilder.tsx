"use client";

import React, { useState } from 'react';
import type { Trek, FAQ } from '@/lib/types';
import { Plus, X, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
}

export function FAQBuilder({ trek, updateField }: Props) {
  const faqs = (trek.faqs as FAQ[]) || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddFAQ = () => {
    const newFAQ: FAQ = { question: '', answer: '' };
    updateField('faqs', [...faqs, newFAQ]);
    setExpandedIndex(faqs.length);
  };

  const handleRemoveFAQ = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    updateField('faqs', newFaqs);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleUpdateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    updateField('faqs', newFaqs);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === faqs.length - 1) return;

    const newFaqs = [...faqs];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newFaqs[index], newFaqs[swapIndex]] = [newFaqs[swapIndex], newFaqs[index]];
    
    updateField('faqs', newFaqs);
    
    // Update expanded index to follow the item if it was expanded
    if (expandedIndex === index) setExpandedIndex(swapIndex);
    else if (expandedIndex === swapIndex) setExpandedIndex(index);
  };

  return (
    <div className="space-y-4">
      {faqs.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-lg">
          <p className="text-sm text-zinc-500 mb-4">No FAQs added yet.</p>
          <button
            type="button"
            onClick={handleAddFAQ}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => {
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
                  
                  <div className="flex-1 font-medium text-sm text-zinc-900 truncate">
                    {faq.question || `Question ${index + 1}`}
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveFAQ(index); }}
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
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary"
                        placeholder="e.g. Is this trek safe for beginners?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">Answer</label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                        className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary"
                        placeholder="Detailed answer..."
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <button
            type="button"
            onClick={handleAddFAQ}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-tb-primary border-2 border-dashed border-tb-primary/30 rounded-lg hover:bg-tb-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another FAQ
          </button>
        </div>
      )}
    </div>
  );
}
