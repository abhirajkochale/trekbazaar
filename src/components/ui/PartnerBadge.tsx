import React from 'react';
import { ShieldCheck, Star, Sparkles, TrendingUp } from 'lucide-react';

interface PartnerBadgeProps {
  type: string;
}

export function PartnerBadge({ type }: PartnerBadgeProps) {
  switch (type.toLowerCase()) {
    case 'verified':
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          {type}
        </div>
      );
    case 'popular':
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
          <TrendingUp className="w-3.5 h-3.5" />
          {type}
        </div>
      );
    case 'new':
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" />
          {type}
        </div>
      );
    case 'featured':
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
          <Star className="w-3.5 h-3.5 fill-purple-700" />
          {type}
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
          {type}
        </div>
      );
  }
}
