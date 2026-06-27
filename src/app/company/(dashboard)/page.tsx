import React from "react";
import { getCompanyId } from "@/lib/company/auth";
import { getCompanyBookings } from "@/lib/company/bookings";
import { getCompanyDepartures } from "@/lib/company/departures";
import { getCompanyTreks } from "@/lib/company/treks";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { Map, CalendarDays, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function CompanyDashboardPage() {
  const [treks, departures, bookings] = await Promise.all([
    getCompanyTreks(),
    getCompanyDepartures(),
    getCompanyBookings(),
  ]);

  const activeTreks = treks.filter(t => t.status === "active").length;
  const upcomingDepartures = departures.filter(d => new Date(d.departure_date) >= new Date()).length;
  const pendingBookings = bookings.filter(b => b.status === "Pending").length;
  const totalRevenue = bookings.filter(b => b.status === "Confirmed").reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Partner Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of your inventory and bookings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Active Treks</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Map className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{activeTreks}</div>
          <div className="text-xs text-zinc-500 mt-1">out of {treks.length} total</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Upcoming Departures</h3>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{upcomingDepartures}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Pending Bookings</h3>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{pendingBookings}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Total Revenue</h3>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <span className="font-bold">₹</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Confirmed only</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/company/treks/new">
          <Button variant="primary">Create New Trek</Button>
        </Link>
        <Link href="/company/departures/new">
          <Button variant="outline">Add Departure</Button>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Bookings</h2>
          <Link href="/company/bookings" className="text-sm text-tb-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="p-6">
          <BookingsTable bookings={bookings.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
