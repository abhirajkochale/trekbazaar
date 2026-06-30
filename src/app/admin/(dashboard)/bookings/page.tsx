import React from 'react';
import { getBookings, getBookingStats } from '@/lib/admin/bookings';
import { formatPrice } from '@/lib/format';
import { BookOpen, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { BookingsClientWrapper } from './BookingsClientWrapper';

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Bookings Management | TrekBazaar Admin",
};

export default async function BookingsPage() {
  const [bookings, stats] = await Promise.all([
    getBookings(),
    getBookingStats()
  ]);

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Bookings Management</h1>
        <p className="text-zinc-500 mt-1">View and manage customer reservations across all treks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Total Bookings</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{stats.totalBookings}</div>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Pending</h3>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{stats.pendingBookings}</div>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Confirmed</h3>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{stats.confirmedBookings}</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500">Confirmed Revenue</h3>
            <div className="w-8 h-8 rounded-full bg-tb-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-tb-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{formatPrice(stats.totalRevenue)}</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
        <BookingsClientWrapper initialBookings={bookings} />
      </div>
    </div>
  );
}
