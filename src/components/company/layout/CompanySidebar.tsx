"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  CalendarDays, 
  BookOpen, 
  MessageSquare,
  Building2
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/company", icon: LayoutDashboard },
  { name: "My Treks", href: "/company/treks", icon: Map },
  { name: "Departures", href: "/company/departures", icon: CalendarDays },
  { name: "Bookings", href: "/company/bookings", icon: BookOpen },
  { name: "Enquiries", href: "/company/enquiries", icon: MessageSquare },
  { name: "Company Profile", href: "/company/profile", icon: Building2 },
];

export function CompanySidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-zinc-200">
        <Link href="/company" className="flex items-center gap-2 text-zinc-900 group">
          <div className="w-8 h-8 bg-tb-primary rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
            TB
          </div>
          <span className="font-bold text-lg tracking-tight">Partner</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-tb-primary/10 text-tb-primary' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-tb-primary' : 'text-zinc-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200">
        <div className="text-xs text-zinc-500 text-center">
          Powered by TrekBazaar
        </div>
      </div>
    </div>
  );
}
