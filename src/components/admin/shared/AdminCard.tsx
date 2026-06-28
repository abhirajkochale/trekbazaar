import React from 'react';

interface AdminCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AdminCard({ title, description, action, children, className = "", noPadding = false }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
        <div>
          <h3 className="text-base font-bold text-zinc-900 tracking-tight">{title}</h3>
          {description && <p className="text-sm text-zinc-500 mt-1 font-medium">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={`flex-1 ${noPadding ? '' : 'p-6 sm:p-8'}`}>
        {children}
      </div>
    </div>
  );
}
