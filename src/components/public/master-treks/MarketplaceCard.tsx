import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDuration, difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import { Calendar, MapPin, Users, ShieldCheck } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pkg: any;
}

export function MarketplaceCard({ pkg }: Props) {
  const company = pkg.companies;
  const departures = pkg.departures || [];
  const earliestDeparture = departures[0];
  const upcomingCount = departures.length;
  
  const availableSeats = earliestDeparture 
    ? earliestDeparture.total_seats - earliestDeparture.booked_seats 
    : 0;

  return (
    <div className="bg-white rounded-xl border border-tb-border shadow-tb-subtle overflow-hidden hover:shadow-tb-medium transition-shadow flex flex-col md:flex-row">
      
      {/* Left: Company & Basic Info */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {company?.logo_url ? (
            <div className="w-12 h-12 relative rounded-full overflow-hidden border border-zinc-100 bg-white shrink-0">
              <Image src={company.logo_url} alt={company.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold shrink-0">
              {company?.name?.[0] || 'T'}
            </div>
          )}
          <div>
            <h3 className="font-bold text-tb-text-primary text-lg flex items-center gap-2">
              {company?.name || 'Unknown Operator'}
              {company?.verification_status === 'verified' && (
                <span title="Verified Operator">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </span>
              )}
            </h3>
            <span className="text-sm text-tb-text-secondary line-clamp-1">{pkg.title}</span>
          </div>
        </div>

        <p className="text-sm text-tb-text-secondary mb-4 line-clamp-2">
          {pkg.short_description || 'No description provided by the operator.'}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-tb-text-tertiary uppercase tracking-wider font-semibold mb-1">Difficulty</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit ${difficultyBadgeClasses(pkg.difficulty)}`}>
              {difficultyLabel(pkg.difficulty)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-tb-text-tertiary uppercase tracking-wider font-semibold mb-1">Duration</span>
            <span className="text-sm font-medium text-tb-text-primary">{formatDuration(pkg.duration_days)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-tb-text-tertiary uppercase tracking-wider font-semibold mb-1">Start Point</span>
            <span className="text-sm font-medium text-tb-text-primary flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-tb-primary" />
              {pkg.start_point || 'Not specified'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Price & Departures */}
      <div className="bg-zinc-50 border-l border-zinc-100 p-6 md:w-72 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-4">
            <span className="text-xs text-tb-text-tertiary block mb-1">Starting from</span>
            <div className="text-2xl font-bold text-tb-text-primary">
              {formatPrice(pkg.price_per_person)}
            </div>
            <span className="text-xs text-tb-text-secondary">per person</span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2 text-sm text-tb-text-primary">
              <Calendar className="w-4 h-4 text-tb-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-medium block">
                  {earliestDeparture 
                    ? new Date(earliestDeparture.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'No dates available'}
                </span>
                <span className="text-xs text-tb-text-secondary block">
                  {upcomingCount} upcoming departure{upcomingCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {earliestDeparture && (
              <div className="flex items-center gap-2 text-sm text-tb-text-primary">
                <Users className="w-4 h-4 text-tb-primary shrink-0" />
                <span>
                  <span className="font-medium">{availableSeats}</span> seats available
                </span>
              </div>
            )}
          </div>
        </div>

        <Link 
          href={`/treks/${pkg.slug}`}
          className="w-full inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary rounded-md bg-tb-primary text-white hover:bg-tb-primary-hover h-10 px-4 py-2 text-sm"
        >
          View Package
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>

    </div>
  );
}
