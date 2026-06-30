"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Map, CalendarDays, BookOpen, Settings, LayoutDashboard } from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  const actions = [
    { name: "Dashboard Overview", href: "/partner/dashboard", icon: LayoutDashboard },
    { name: "Create New Trek", href: "/partner/dashboard/treks/new", icon: Map },
    { name: "View All Treks", href: "/partner/dashboard/treks", icon: Map },
    { name: "Add Departure", href: "/partner/dashboard/departures/new", icon: CalendarDays },
    { name: "View Schedule", href: "/partner/dashboard/departures", icon: CalendarDays },
    { name: "Recent Bookings", href: "/partner/dashboard/bookings", icon: BookOpen },
    { name: "Company Settings", href: "/partner/dashboard/profile", icon: Settings },
  ];

  const filteredActions = actions.filter((action) =>
    action.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
      <div 
        className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />
      
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-4 border-b border-zinc-100 gap-3">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search or jump to..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 uppercase">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredActions.length > 0 ? (
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Quick Actions
              </p>
              {filteredActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setOpen(false);
                      router.push(action.href);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-100 text-left group transition-colors focus:bg-zinc-100 focus:outline-none"
                  >
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                    <span className="font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors">
                      {action.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-zinc-500">No results found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
