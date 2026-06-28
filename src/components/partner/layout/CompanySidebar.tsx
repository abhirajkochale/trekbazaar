"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  CalendarDays, 
  BookOpen, 
  Building2,
  Search,
  Settings
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/partner", icon: LayoutDashboard },
  { name: "Treks", href: "/partner/treks", icon: Map },
  { name: "Departures", href: "/partner/departures", icon: CalendarDays },
  { name: "Bookings", href: "/partner/bookings", icon: BookOpen },
];

export function CompanySidebar() {
  const pathname = usePathname();
  const [os, setOs] = useState('Ctrl');

  useEffect(() => {
    if (navigator.userAgent.includes('Mac')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOs('⌘');
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-zinc-50/50">
      {/* Brand */}
      <div className="h-16 flex-shrink-0 flex items-center px-6">
        <Link href="/partner" className="flex items-center gap-3 text-zinc-900 group">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 shadow-sm">
            T
          </div>
          <span className="font-bold text-sm tracking-tight">TrekBazaar Partner</span>
        </Link>
      </div>

      {/* Global Search / Command Menu Trigger */}
      <div className="px-4 py-2">
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
        >
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          <span className="flex-1 text-left font-medium">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-400 bg-zinc-100 border border-zinc-200">
            {os} K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        <div className="px-3 mb-2 mt-4">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Menu</p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/partner' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-zinc-900 border border-zinc-200/60' 
                  : 'text-zinc-500 hover:bg-white hover:text-zinc-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-tb-primary' : 'text-zinc-400'}`} />
              {item.name}
            </Link>
          );
        })}

        <div className="px-3 mb-2 mt-8">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Settings</p>
        </div>
        <Link
          href="/partner/profile"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            pathname.startsWith('/partner/profile')
              ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-zinc-900 border border-zinc-200/60' 
              : 'text-zinc-500 hover:bg-white hover:text-zinc-900 border border-transparent'
          }`}
        >
          <Building2 className={`w-4 h-4 ${pathname.startsWith('/partner/profile') ? 'text-tb-primary' : 'text-zinc-400'}`} />
          Company Profile
        </Link>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-tb-primary rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-xs font-bold text-zinc-900 mb-1">Need help?</p>
          <p className="text-[10px] text-zinc-500 font-medium mb-3">Check out our guide to getting more bookings.</p>
          <button className="text-[10px] font-bold uppercase tracking-wider text-tb-primary w-full text-center bg-tb-primary/5 hover:bg-tb-primary/10 py-1.5 rounded-lg transition-colors">
            View Guide
          </button>
        </div>
      </div>
    </div>
  );
}
