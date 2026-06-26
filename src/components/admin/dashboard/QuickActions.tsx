import React from 'react';
import Link from 'next/link';
import { PlusCircle, ExternalLink, Inbox, MapPin } from 'lucide-react';
import { AdminCard } from '../shared/AdminCard';

export function QuickActions() {
  const actions = [
    {
      name: 'Add New Trek',
      description: 'Create a new trek listing',
      icon: PlusCircle,
      href: '/admin/treks/new',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100 hover:border-emerald-300'
    },
    {
      name: 'Add Region',
      description: 'Expand your catalog',
      icon: MapPin,
      href: '/admin/regions/new',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100 hover:border-blue-300'
    },
    {
      name: 'View Enquiries',
      description: 'Respond to leads',
      icon: Inbox,
      href: '/admin/enquiries',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100 hover:border-amber-300'
    },
    {
      name: 'View Website',
      description: 'See live changes',
      icon: ExternalLink,
      href: '/',
      color: 'text-zinc-600',
      bgColor: 'bg-zinc-100',
      borderColor: 'border-zinc-200 hover:border-zinc-300'
    }
  ];

  return (
    <AdminCard title="Quick Actions">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link 
            key={action.name} 
            href={action.href}
            className={`flex items-start gap-4 p-4 rounded-xl border ${action.borderColor} transition-all hover:shadow-sm group bg-white`}
          >
            <div className={`p-3 rounded-lg ${action.bgColor} ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-0.5">{action.name}</h4>
              <p className="text-xs text-zinc-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminCard>
  );
}
