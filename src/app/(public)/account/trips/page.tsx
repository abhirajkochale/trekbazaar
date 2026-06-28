import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/format';
import { Compass, Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export const metadata = { title: 'My Trips — TrekBazaar' };

export default async function TripsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: trips } = await supabase
    .from('bookings')
    .select('*, treks(title, slug), companies(name)')
    .eq('customer_id', user?.id)
    .order('departure_date', { ascending: false });

  const upcoming = trips?.filter(t => new Date(t.departure_date) >= new Date() && t.status !== 'Cancelled') || [];
  const past     = trips?.filter(t => new Date(t.departure_date) < new Date() || t.status === 'Cancelled') || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TripCard = ({ trip, faded = false }: { trip: any; faded?: boolean }) => (
    <div className={`group bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${faded ? 'opacity-70' : 'border-zinc-100 hover:border-tb-primary/30'}`}>
      <div className="flex flex-col md:flex-row">
        {/* Color accent strip */}
        <div className={`w-full md:w-1.5 h-1.5 md:h-auto rounded-t-2xl md:rounded-t-none md:rounded-l-2xl flex-shrink-0 ${
          trip.status === 'Confirmed' ? 'bg-emerald-500' :
          trip.status === 'Cancelled' ? 'bg-red-400' : 'bg-amber-400'
        }`} />

        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                  trip.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  trip.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {trip.status}
                </span>
                <span className="text-xs text-zinc-400 font-mono">#{trip.booking_reference}</span>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 truncate">
                {trip.treks?.title || 'Unknown Trek'}
              </h3>

              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  {new Date(trip.departure_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  {trip.companies?.name || 'TrekBazaar'}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Users className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  {trip.travellers_count} Traveller{trip.travellers_count > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 border-t sm:border-t-0 pt-4 sm:pt-0">
              <div className="text-xl font-black text-zinc-900">{formatPrice(trip.total_amount)}</div>
              <button className="flex items-center gap-1 text-sm font-semibold text-tb-primary bg-tb-primary/5 hover:bg-tb-primary/10 border border-tb-primary/20 py-2 px-4 rounded-full transition-colors group-hover:border-tb-primary/40">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Hero */}
      <div className="bg-white border-b border-zinc-100">
        <Container>
          <div className="pt-28 pb-8">
            <p className="text-sm font-semibold text-tb-primary mb-1 tracking-wide uppercase">Account</p>
            <h1 className="text-4xl font-black text-zinc-900">My Trips</h1>
            <p className="text-zinc-500 mt-1.5 text-base">
              {trips?.length ? `${trips.length} booking${trips.length > 1 ? 's' : ''} found` : 'Your adventure history'}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10 max-w-4xl mx-auto space-y-10">
          {!trips || trips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-zinc-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Compass className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">No trips yet</h3>
              <p className="text-zinc-500 mt-2 mb-8 max-w-sm mx-auto">
                Looks like you haven&apos;t booked anything yet. Find your next adventure!
              </p>
              <Link href="/search" className="inline-flex items-center gap-2 bg-tb-primary text-white font-bold py-3 px-8 rounded-full hover:bg-tb-primary-hover transition-colors shadow-sm shadow-tb-primary/20 active:scale-95">
                <Compass className="w-4 h-4" /> Explore Treks
              </Link>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-zinc-900">
                      Upcoming <span className="text-zinc-400 font-normal text-base">({upcoming.length})</span>
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {upcoming.map(trip => <TripCard key={trip.id} trip={trip} />)}
                  </div>
                </section>
              )}

              {past.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-zinc-900 mb-5">
                    Past &amp; Cancelled <span className="text-zinc-400 font-normal text-base">({past.length})</span>
                  </h2>
                  <div className="space-y-4">
                    {past.map(trip => <TripCard key={trip.id} trip={trip} faded />)}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
