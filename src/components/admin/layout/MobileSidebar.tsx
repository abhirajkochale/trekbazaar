"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Mountain, Map, MessageSquare, CalendarCheck, Users, Settings, Building2, ShieldCheck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Partner Applications', href: '/admin/partner-applications', icon: ShieldCheck },
  { name: 'Treks', href: '/admin/treks', icon: Mountain },
  { name: 'Departures', href: '/admin/departures', icon: CalendarCheck },
  { name: 'Regions', href: '/admin/regions', icon: Map },
  { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

import { logout } from '@/app/admin/(dashboard)/actions';

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 focus:outline-none"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <Link href="/admin" onClick={() => setIsOpen(false)} className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-tb-primary rounded-lg flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            TrekBazaar
          </Link>
          <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-zinc-200">
          <form action={logout}>
            <button 
              type="submit"
              className="w-full text-left text-sm text-zinc-500 hover:text-red-600 transition-colors font-medium"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
