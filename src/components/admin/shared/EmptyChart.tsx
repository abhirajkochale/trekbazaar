import React from 'react';
import { BarChart3 } from 'lucide-react';

interface EmptyChartProps {
  title?: string;
  message?: string;
}

export function EmptyChart({ 
  title = "Not enough data", 
  message = "Check back later when more activity occurs." 
}: EmptyChartProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[250px] w-full bg-zinc-50/50 rounded-lg border border-dashed border-zinc-200">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-zinc-100 mb-3">
        <BarChart3 className="w-4 h-4 text-zinc-400" />
      </div>
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      <p className="text-xs text-zinc-500 max-w-[200px] text-center mt-1">{message}</p>
    </div>
  );
}
