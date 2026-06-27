import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';
import { Compass } from 'lucide-react';
import Link from 'next/link';

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Using email as fallback for customer_id since local migrations didn't run.
  // In production, the trigger sets customer_id and we could query by that.
  const { data: trips } = await supabase
    .from('bookings')
    .select('*, treks(title, slug), companies(name)')
    .eq('customer_email', user?.email)
    .order('departure_date', { ascending: false });

  const upcoming = trips?.filter(t => new Date(t.departure_date) >= new Date() && t.status !== 'Cancelled') || [];
  const past = trips?.filter(t => new Date(t.departure_date) < new Date() || t.status === 'Cancelled') || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TripCard = ({ trip }: { trip: any }) => (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm hover:border-tb-primary/30 transition-colors">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ref: {trip.booking_reference}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
            trip.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
            trip.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {trip.status}
          </span>
        </div>
        <h3 className="font-bold text-xl text-zinc-900">{trip.treks?.title || 'Unknown Trek'}</h3>
        <p className="text-sm text-zinc-600 mt-1">
          {new Date(trip.departure_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-zinc-500 mt-0.5">Operated by {trip.companies?.name || 'TrekBazaar'}</p>
        
      </div>
      <div className="text-left md:text-right border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0">
        <div className="text-sm text-zinc-500 mb-0.5">{trip.travellers_count} Traveller{trip.travellers_count > 1 ? 's' : ''}</div>
        <div className="text-xl font-black text-zinc-900">{formatPrice(trip.total_amount)}</div>
        <button className="mt-3 bg-zinc-50 text-tb-primary font-bold py-2 px-4 rounded-lg w-full md:w-auto hover:bg-tb-primary/10 transition-colors border border-tb-primary/20">
          Booking Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">My Trips</h1>
        <p className="text-zinc-500 mt-1">Manage all your upcoming and past bookings.</p>
      </header>

      {trips?.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
          <Compass className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-zinc-900">No trips found</h3>
          <p className="text-zinc-500 mb-6">Looks like you haven&apos;t booked anything yet.</p>
          <Link href="/search" className="bg-tb-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-tb-primary-hover">
            Explore Treks
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Upcoming ({upcoming.length})</h2>
              <div className="space-y-4">
                {upcoming.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Past & Cancelled ({past.length})</h2>
              <div className="space-y-4 opacity-75 grayscale-[0.2]">
                {past.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
