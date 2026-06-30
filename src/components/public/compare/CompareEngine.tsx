"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { Check, Minus, ShieldCheck, Star, MapPin, Navigation, Coffee, ArrowRight, Info } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function CompareEngine({ masterTrek, packages }: Props) {
  // Memoize performance-heavy metric aggregations
  const { cheapestPkgId, mostDeparturesId } = useMemo(() => {
    let minPrice = Infinity;
    let cheapestId = null;
    let maxDeps = -1;
    let mostDepsId = null;

    packages.forEach(pkg => {
      const price = pkg.departures?.[0]?.offer_price || pkg.departures?.[0]?.base_price || pkg.price_per_person || Infinity;
      if (price < minPrice && price > 0) {
        minPrice = price;
        cheapestId = pkg.id;
      }

      const depCount = pkg.departures?.length || 0;
      if (depCount > maxDeps) {
        maxDeps = depCount;
        mostDepsId = pkg.id;
      }
    });

    return { cheapestPkgId: cheapestId, mostDeparturesId: mostDepsId };
  }, [packages]);

  if (packages.length <= 1) {
    const singlePackage = packages[0];
    return (
      <Container className="py-24">
        <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">One Operator Available</h2>
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
            This trek currently has only one verified operator. More partners coming soon.
          </p>
          {singlePackage && (
            <Link 
              href={`/company/${singlePackage.companies?.slug}/${masterTrek.slug}`}
              className="inline-flex items-center gap-2 bg-tb-primary hover:bg-tb-primary-hover text-white font-bold px-8 py-4 rounded-full transition-all active:scale-95 shadow-md"
            >
              View {singlePackage.companies?.name} Package <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
          Compare <span className="text-tb-primary">{masterTrek.name}</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl">
          Side-by-side comparison of {packages.length} verified operators. Find the best price, dates, and inclusions for your trek.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse relative">
            <thead>
              <tr>
                <th className="p-6 text-left border-b border-zinc-200 bg-white sticky left-0 z-20 w-64 shadow-[2px_0_8px_rgba(0,0,0,0.02)] align-bottom">
                  <span className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">Feature Comparison</span>
                </th>
                {packages.map(pkg => (
                  <th key={pkg.id} className="p-6 text-left border-b border-zinc-100 min-w-[280px] bg-white align-top">
                    {/* Operator Header */}
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {pkg.id === cheapestPkgId && (
                          <div className="mb-4 inline-block bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200">
                            Lowest Price
                          </div>
                        )}
                        {pkg.id === mostDeparturesId && pkg.id !== cheapestPkgId && (
                          <div className="mb-4 inline-block bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200">
                            Most Flexibility
                          </div>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                          {pkg.companies?.logo_url ? (
                            <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-zinc-100 bg-white shrink-0 shadow-sm">
                              <Image src={pkg.companies.logo_url} alt={pkg.companies.name} fill sizes="56px" className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xl shrink-0 border border-zinc-200/50">
                              {pkg.companies?.name?.[0] || 'T'}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-zinc-900 text-xl flex items-center gap-1.5 line-clamp-1">
                              {pkg.companies?.name}
                              {pkg.companies?.verification_status === 'approved' && (
                                <ShieldCheck className="w-4 h-4 text-tb-primary shrink-0" />
                              )}
                            </h3>
                            <div className="flex items-center gap-1 text-sm font-medium text-amber-500 mt-0.5">
                              <Star className="w-4 h-4 .5 .5 fill-current" /> 4.9 <span className="text-zinc-400 text-xs">(Verified)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="text-3xl font-black text-zinc-900 tracking-tight">
                          {formatPrice(pkg.departures?.[0]?.offer_price || pkg.departures?.[0]?.base_price || pkg.price_per_person)}
                        </div>
                        <div className="text-sm text-zinc-500 font-medium mt-1 mb-4">Total per person</div>
                        <Link 
                          href={`/company/${pkg.companies?.slug}/${masterTrek.slug}`}
                          className="w-full block text-center bg-tb-primary hover:bg-tb-primary-hover text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md"
                        >
                          Book with {pkg.companies?.name.split(' ')[0]}
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-zinc-100 text-[14px]">
              
              {/* Basic Info */}
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Duration</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className="p-5 text-zinc-900 font-medium">{pkg.duration_days} Days</td>
                ))}
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Difficulty</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className="p-5 text-zinc-900 font-medium capitalize">{pkg.difficulty}</td>
                ))}
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Starting Point</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className="p-5 text-zinc-900 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" /> {pkg.start_point || masterTrek.region?.name || 'Not specified'}
                  </td>
                ))}
              </tr>

              {/* Inclusions */}
              <tr className="bg-white">
                <td colSpan={packages.length + 1} className="px-6 py-4 font-bold text-[13px] text-zinc-900 uppercase tracking-wider sticky left-0">Inclusions & Policies</td>
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Meals Included</td>
                {packages.map(pkg => {
                  const hasMeals = (pkg.included || []).some((i: string) => i.toLowerCase().includes('meal') || i.toLowerCase().includes('food') || i.toLowerCase().includes('breakfast'));
                  return (
                    <td key={pkg.id} className="p-5">
                      {hasMeals ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-medium"><Check className="w-4 h-4" /> All Meals</div>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-400 font-medium"><Minus className="w-4 h-4" /> Not Included</div>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Transport / Pickup</td>
                {packages.map(pkg => {
                  const hasTransport = (pkg.included || []).some((i: string) => i.toLowerCase().includes('transport') || i.toLowerCase().includes('pickup') || i.toLowerCase().includes('drive'));
                  return (
                    <td key={pkg.id} className="p-5">
                      {hasTransport ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-medium"><Navigation className="w-4 h-4" /> Included</div>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-400 font-medium"><Minus className="w-4 h-4" /> Extra</div>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Guide & Support</td>
                {packages.map(pkg => {
                  const hasGuide = (pkg.included || []).some((i: string) => i.toLowerCase().includes('guide') || i.toLowerCase().includes('leader') || i.toLowerCase().includes('expert'));
                  return (
                    <td key={pkg.id} className="p-5">
                      {hasGuide ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-medium"><Check className="w-4 h-4" /> Certified Leader</div>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-400 font-medium"><Minus className="w-4 h-4" /> None</div>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Cancellation</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className="p-5 text-zinc-900 font-medium">
                    {pkg.cancellation_policy || 'Standard Flexible'}
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr className="bg-white">
                <td colSpan={packages.length + 1} className="px-6 py-4 font-bold text-[13px] text-zinc-900 uppercase tracking-wider sticky left-0 border-t border-zinc-100">Availability</td>
              </tr>
              <tr className="group transition-colors">
                <td className="p-5 font-medium text-zinc-500 bg-white sticky left-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">Upcoming Departures</td>
                {packages.map(pkg => (
                  <td key={pkg.id} className="p-5 text-zinc-900 font-bold">
                    {pkg.departures?.length || 0} Dates
                  </td>
                ))}
              </tr>
              
              {/* Bottom Action Row */}
              <tr>
                <td className="p-6 bg-white sticky left-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.02)] border-t border-zinc-100"></td>
                {packages.map(pkg => (
                  <td key={pkg.id} className="p-6 bg-white border-t border-zinc-100 text-center">
                     <Link 
                        href={`/company/${pkg.companies?.slug}/${masterTrek.slug}`}
                        className="inline-flex items-center justify-center font-bold text-tb-primary hover:text-tb-primary-hover hover:underline"
                      >
                        View Full Details <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
