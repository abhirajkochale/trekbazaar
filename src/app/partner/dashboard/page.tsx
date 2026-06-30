import React from "react";
import { getCompanyBookings } from "@/lib/company/bookings";
import { getCompanyDepartures } from "@/lib/company/departures";
import { getCompanyTreks } from "@/lib/company/treks";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { Map, CalendarDays, BookOpen, Plus, Settings, CreditCard, ChevronRight, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default async function CompanyDashboardPage() {
  const [treks, departures, bookings] = await Promise.all([
    getCompanyTreks(),
    getCompanyDepartures(),
    getCompanyBookings(),
  ]);

  const activeTreks = treks.filter(t => t.status === "active");
  const draftTreks = treks.filter(t => t.status === "draft");
  
  const upcomingDeparturesList = departures.filter(d => new Date(d.departure_date) >= new Date()).sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());
  const pendingBookings = bookings.filter(b => b.status === "Pending");
  
  const confirmedBookings = bookings.filter(b => b.status === "Confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_amount, 0);

  const totalUpcomingSeats = upcomingDeparturesList.reduce((acc, d) => acc + (d.total_seats || 0), 0);
  const totalUpcomingBooked = upcomingDeparturesList.reduce((acc, d) => acc + (d.booked_seats || 0), 0);
  const upcomingOccupancy = totalUpcomingSeats > 0 ? Math.round((totalUpcomingBooked / totalUpcomingSeats) * 100) : 0;

  // Post-Approval Mandatory Flow
  if (treks.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl p-10 border border-zinc-200 shadow-xl shadow-zinc-200/40 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-tb-primary" />
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
            <span className="text-3xl font-black text-amber-500">1</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Welcome to TrekBazaar!</h1>
          <p className="text-zinc-500 text-lg leading-relaxed mb-8">
            Your partner application has been approved. To start accepting bookings, you need to create your first trek listing.
          </p>
          <Link
            href="/partner/dashboard/treks/new"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors shadow-lg active:scale-95 text-lg"
          >
            <Plus className="w-4 h-4" /> Create First Trek
          </Link>
        </div>
      </div>
    );
  }

  if (treks.length > 0 && departures.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl p-10 border border-zinc-200 shadow-xl shadow-zinc-200/40 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
            <span className="text-3xl font-black text-blue-500">2</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Add a Departure Date</h1>
          <p className="text-zinc-500 text-lg leading-relaxed mb-8">
            Great job! You've created your first trek. Now, add at least one departure date so customers can start booking it.
          </p>
          <Link
            href="/partner/dashboard/departures/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg active:scale-95 text-lg"
          >
            <CalendarDays className="w-4 h-4" /> Add Departure Date
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/partner/dashboard/departures/new" className="h-9 px-4 inline-flex items-center justify-center text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-sm transition-all active:scale-95">
            Add Departure
          </Link>
          <Link href="/partner/dashboard/treks/new" className="h-9 px-4 inline-flex items-center justify-center text-sm font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 shadow-sm transition-all active:scale-95 gap-2">
            <Plus className="w-4 h-4" /> New Trek
          </Link>
        </div>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 relative z-10">Total Revenue</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{formatPrice(totalRevenue)}</h3>
          </div>
          <p className="text-xs font-medium text-emerald-600 mt-2 relative z-10 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12% this month
          </p>
        </div>

        {/* Occupancy Card */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 relative z-10">Occupancy</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{upcomingOccupancy}%</h3>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full mt-3 overflow-hidden relative z-10">
            <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${upcomingOccupancy}%` }} />
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Pending Actions</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-amber-500 tracking-tight">{pendingBookings.length}</h3>
          </div>
          <Link href="/partner/dashboard/bookings" className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 mt-2 inline-flex items-center gap-1 transition-colors">
            Review bookings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Treks */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Active Treks</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{activeTreks.length}</h3>
          </div>
          <p className="text-xs font-medium text-zinc-500 mt-2">
            {draftTreks.length} drafts in progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schedule & Bookings (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule / Upcoming */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-tb-primary" /> Upcoming Departures
              </h2>
              <Link href="/partner/dashboard/departures" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider">
                View Calendar
              </Link>
            </div>
            <div className="p-0 flex-1">
              {upcomingDeparturesList.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {upcomingDeparturesList.slice(0, 4).map(dep => (
                    <div key={dep.id} className="p-4 hover:bg-zinc-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-zinc-500 uppercase leading-none mb-0.5">
                            {new Date(dep.departure_date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-lg font-black text-zinc-900 leading-none">
                            {new Date(dep.departure_date).toLocaleDateString('en-US', { day: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm">{dep.treks?.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-zinc-500">{dep.booked_seats} / {dep.total_seats} booked</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              dep.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {dep.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/partner/dashboard/departures/${dep.id}/edit`} className="opacity-0 group-hover:opacity-100 text-sm font-semibold text-tb-primary transition-opacity">
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-zinc-500">No upcoming departures scheduled.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-500" /> Recent Bookings
              </h2>
              <Link href="/partner/dashboard/bookings" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider">
                View All
              </Link>
            </div>
            <div className="p-4">
              <BookingsTable bookings={bookings.slice(0, 5)} />
            </div>
          </div>
        </div>

        {/* Right Column: Drafts & Quick Links (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Drafts */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
             <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-500" /> Draft Treks
              </h2>
            </div>
            <div className="p-0">
              {draftTreks.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {draftTreks.slice(0, 4).map(trek => (
                    <Link key={trek.id} href={`/partner/dashboard/treks/${trek.id}/edit`} className="flex flex-col p-4 hover:bg-zinc-50 transition-colors group">
                      <span className="font-bold text-sm text-zinc-900 group-hover:text-tb-primary transition-colors">{trek.title || "Untitled Trek"}</span>
                      <span className="text-xs text-zinc-500 mt-1 font-medium">Last updated {new Date(trek.updated_at).toLocaleDateString()}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-zinc-500 font-medium">You have no draft treks.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Support / Resources */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6 text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tb-primary rounded-full blur-3xl opacity-20"></div>
            <h3 className="font-bold text-lg tracking-tight mb-2 relative z-10">Need help?</h3>
            <p className="text-sm text-zinc-400 font-medium mb-4 relative z-10 leading-relaxed">
              Check out our partner resources to learn how to optimize your listings and increase bookings.
            </p>
            <button className="text-xs font-bold uppercase tracking-wider text-white border border-zinc-700 hover:bg-zinc-800 transition-colors px-4 py-2 rounded-lg relative z-10">
              View Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
