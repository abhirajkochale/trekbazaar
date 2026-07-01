"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  state: SaveState;
  lastSavedAt: Date | null;
}

export function AutoSaveIndicator({ state, lastSavedAt }: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!lastSavedAt) {
      return;
    }

    const updateTimeAgo = () => {
      const seconds = Math.floor((new Date().getTime() - lastSavedAt.getTime()) / 1000);
      if (seconds < 10) setTimeAgo('Just now');
      else if (seconds < 60) setTimeAgo(`${seconds} seconds ago`);
      else if (seconds < 120) setTimeAgo('1 minute ago');
      else setTimeAgo(`${Math.floor(seconds / 60)} minutes ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  return (
    <div className="flex items-center text-sm font-medium transition-all duration-300">
      {state === 'saving' && (
        <div className="flex items-center text-zinc-500 gap-1.5 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Saving...</span>
        </div>
      )}
      
      {state === 'saved' && (
        <div className="flex items-center text-emerald-600 gap-1.5 opacity-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Saved</span>
        </div>
      )}
      
      {state === 'idle' && lastSavedAt && (
        <div className="flex items-center text-zinc-400 gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Last saved {timeAgo}</span>
        </div>
      )}

      {state === 'error' && (
        <div className="flex items-center text-red-500 gap-1.5">
          <span>Failed to save</span>
        </div>
      )}
    </div>
  );
}
