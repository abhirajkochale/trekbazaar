"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Departure, Company, Trek } from '@/lib/types';
import { saveDepartureAction } from '@/app/admin/(dashboard)/departures/actions';
import toast from 'react-hot-toast';
import { AdminCard } from '../../shared/AdminCard';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialDeparture?: Departure;
  companies: Company[];
  treks: Trek[];
  isCompanyPortal?: boolean;
  onSaveOverride?: (payload: Partial<Departure>) => Promise<{success: boolean, error?: string, departureId?: string}>;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function DepartureEditor({ initialDeparture, companies, treks, isCompanyPortal = false, onSaveOverride }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Find the initial company if we are editing an existing departure
  const initialCompanyId = initialDeparture?.treks?.company_id || '';
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId);
  
  const [departure, setDeparture] = useState<Partial<Departure>>(initialDeparture || {
    trek_id: "",
    departure_date: "",
    return_date: "",
    base_price: 0,
    offer_price: null,
    total_seats: 0,
    booked_seats: 0,
    pickup_location: "",
    notes: "",
    status: "Upcoming",
    is_active: true
  });

  const [isDirty, setIsDirty] = useState(false);

  // Filter treks dynamically based on selected company (unless in company portal where treks are already filtered)
  const availableTreks = isCompanyPortal ? treks : treks.filter(t => t.company_id === selectedCompanyId);

  const updateField = useCallback(<K extends keyof Departure>(field: K, value: Departure[K]) => {
    setDeparture(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
    // Reset trek selection when company changes
    updateField('trek_id', '');
  };

  const handleSave = useCallback(async (showToast = true) => {
    if (!departure.trek_id || !departure.departure_date || !departure.return_date) {
      if (showToast) toast.error("Trek, Departure Date, and Return Date are required.");
      return;
    }
    
    if (new Date(departure.return_date) < new Date(departure.departure_date)) {
      if (showToast) toast.error("Return date must be after departure date.");
      return;
    }

    setIsSaving(true);
    const res = onSaveOverride 
      ? await onSaveOverride(departure)
      : await saveDepartureAction(departure);
    setIsSaving(false);

    if (res.success) {
      setLastSaved(new Date());
      setIsDirty(false);
      if (showToast) toast.success("Departure saved successfully");
      
      if (!initialDeparture && res.departureId) {
        const basePath = isCompanyPortal ? "/partner/dashboard/departures" : "/admin/departures";
        startTransition(() => {
          router.replace(`${basePath}/${res.departureId}/edit`);
        });
      }
    } else {
      if (showToast) toast.error(res.error || "Failed to save departure");
    }
  }, [departure, initialDeparture, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setInterval(() => handleSave(false), 30000);
    return () => clearInterval(timer);
  }, [isDirty, handleSave]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-16 z-20 bg-zinc-50/90 backdrop-blur-md py-4 border-b border-zinc-200 flex items-center justify-between gap-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href={isCompanyPortal ? "/partner/dashboard/departures" : "/admin/departures"} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-200">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              {initialDeparture ? `Edit Departure` : 'Create New Departure'}
            </h1>
            <div className="text-xs font-medium flex items-center gap-2 mt-0.5">
              {isSaving ? (
                <span className="text-tb-primary">Saving...</span>
              ) : isDirty ? (
                <span className="text-amber-600">Unsaved changes</span>
              ) : lastSaved ? (
                <span className="text-zinc-500">Last saved at {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span className="text-zinc-500">Draft</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-tb-primary rounded-lg hover:bg-tb-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <AdminCard title="Core Details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isCompanyPortal && (
                  <div>
                    <label className={labelClasses}>Company <span className="text-red-500">*</span></label>
                    <select
                      value={selectedCompanyId}
                      onChange={handleCompanyChange}
                      className={inputClasses}
                    >
                      <option value="">Select a Company...</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={isCompanyPortal ? "md:col-span-2" : ""}>
                  <label className={labelClasses}>Trek <span className="text-red-500">*</span></label>
                  <select
                    value={departure.trek_id || ''}
                    onChange={(e) => updateField('trek_id', e.target.value)}
                    className={inputClasses}
                    disabled={!isCompanyPortal && !selectedCompanyId}
                  >
                    <option value="">Select a Trek...</option>
                    {availableTreks.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Departure Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={departure.departure_date ? departure.departure_date.split('T')[0] : ''}
                    onChange={(e) => updateField('departure_date', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Return Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={departure.return_date ? departure.return_date.split('T')[0] : ''}
                    onChange={(e) => updateField('return_date', e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </AdminCard>
          
          <AdminCard title="Pricing & Capacity">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Base Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    value={departure.base_price || 0}
                    onChange={(e) => updateField('base_price', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Offer Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={departure.offer_price || ''}
                    onChange={(e) => updateField('offer_price', e.target.value ? parseFloat(e.target.value) : null)}
                    className={inputClasses}
                    placeholder="Leave empty for no discount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Total Seats <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={departure.total_seats || 0}
                    onChange={(e) => updateField('total_seats', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Booked Seats</label>
                  <input
                    type="number"
                    min="0"
                    value={departure.booked_seats || 0}
                    onChange={(e) => updateField('booked_seats', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="md:col-span-1 space-y-6">
          <AdminCard title="Status & Settings">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Departure Status</label>
                <select
                  value={departure.status || 'Upcoming'}
                  onChange={(e) => updateField('status', e.target.value as Departure['status'])}
                  className={inputClasses}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Full">Full</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-200">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={departure.is_active ?? true}
                    onChange={(e) => updateField('is_active', e.target.checked)}
                    className="w-4 h-4 text-tb-primary rounded border-zinc-300 focus:ring-tb-primary"
                  />
                  <div>
                    <span className="block text-sm font-medium text-zinc-900">Active Listing</span>
                    <span className="block text-xs text-zinc-500">Visible on the public website</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-200">
                <label className={labelClasses}>Pickup Location</label>
                <input
                  type="text"
                  value={departure.pickup_location || ''}
                  onChange={(e) => updateField('pickup_location', e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Dehradun ISBT"
                />
              </div>

              <div>
                <label className={labelClasses}>Admin Notes</label>
                <textarea
                  rows={3}
                  value={departure.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className={inputClasses}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
