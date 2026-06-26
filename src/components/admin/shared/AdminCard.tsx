import React from 'react';

interface AdminCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AdminCard({ title, action, children, className = "", noPadding = false }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
}
