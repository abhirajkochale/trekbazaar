import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-100 text-zinc-700 border-transparent',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  outline: 'bg-white text-zinc-600 border-zinc-200',
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <div 
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
