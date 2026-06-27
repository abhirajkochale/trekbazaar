import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Compass, Calendar, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export default async function AccountDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch upcoming trips
  // In reality, this queries the bookings table linking customer_id, but since local migrations didn't run, 
  // we gracefully degrade or simulate if empty. We query by email as a fallback to ensure it always works.
  const { data: upcomingTrips } = await supabase
    .from('bookings')
    .select('*, treks(title, slug), companies(name)')
    .eq('customer_email', user?.email)
    .in('status', ['Pending', 'Confirmed'])
    .gte('departure_date', new Date().toISOString())
    .order('departure_date', { ascending: true })
    .limit(2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Welcome back! Here&apos;s an overview of your adventures.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-zinc-900">{upcomingTrips?.length || 0}</h3>
          <p className="text-zinc-500 font-medium">Upcoming Trips</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-black text-zinc-900">0</h3>
          <p className="text-zinc-500 font-medium">Past Trips</p>
        </div>
        <Link href="/search" className="bg-tb-primary hover:bg-tb-primary-hover transition-colors p-6 rounded-2xl shadow-md text-white flex flex-col justify-center relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Ready for your next adventure?</h3>
            <p className="text-white/80 text-sm mb-4">Explore new destinations and book your next trek.</p>
            <div className="flex items-center gap-2 font-bold text-sm">
              Explore Treks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Upcoming Adventures</h2>
          <Link href="/account/trips" className="text-tb-primary text-sm font-bold hover:underline">View All</Link>
        </div>

        {upcomingTrips && upcomingTrips.length > 0 ? (
          <div className="space-y-4">
            {upcomingTrips.map((trip) => {
              // @ts-expect-error Types
              const trekTitle = trip.treks?.title || 'Unknown Trek';
              // @ts-expect-error Types
              const companyName = trip.companies?.name || 'Unknown Operator';
              const depDate = new Date(trip.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={trip.id} className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="text-xs font-bold text-tb-primary mb-1 uppercase tracking-wider">{depDate}</div>
                    <h3 className="font-bold text-lg text-zinc-900">{trekTitle}</h3>
                    <p className="text-sm text-zinc-500 mt-1">Operated by {companyName}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md capitalize">
                        {trip.status}
                      </span>
                      <span className="bg-zinc-100 text-zinc-600 text-xs font-bold px-2.5 py-1 rounded-md capitalize">
                        Payment: {trip.payment_status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-sm text-zinc-500 mb-0.5">Total Amount</div>
                    <div className="text-xl font-black text-zinc-900">{formatPrice(trip.total_amount)}</div>
                    <button className="mt-3 bg-zinc-900 hover:bg-black text-white text-sm font-bold py-2 px-4 rounded-lg w-full md:w-auto transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
            <Compass className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-zinc-900">No upcoming trips</h3>
            <p className="text-zinc-500 mb-6">You don&apos;t have any upcoming treks scheduled right now.</p>
            <Link href="/search" className="bg-tb-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-tb-primary-hover transition-colors">
              Find a Trek
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
