"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Mountain, 
  Map, 
  CalendarCheck, 
  Users, 
  Settings,
  Building2,
  CalendarDays
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Treks', href: '/admin/treks', icon: Mountain },
  { name: 'Departures', href: '/admin/departures', icon: CalendarDays },
  { name: 'Regions', href: '/admin/regions', icon: Map },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

import { logout } from '@/app/admin/(dashboard)/actions';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-200 h-screen sticky top-0">
      <div className="p-6 border-b border-zinc-200">
        <Link href="/admin" className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-tb-primary rounded-lg flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          TrekBazaar
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-zinc-200 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-600">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-900">Admin User</span>
            <span className="text-xs text-zinc-500">admin@trekbazaar.com</span>
          </div>
        </div>
        <form action={logout} className="px-3">
          <button 
            type="submit"
            className="w-full text-left text-sm text-zinc-500 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
