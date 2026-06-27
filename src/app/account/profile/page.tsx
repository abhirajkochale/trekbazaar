import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { User, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Try to get profile from DB, fallback to user metadata for MVP
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const firstName = profile?.first_name || user?.user_metadata?.first_name || '';
  const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
  const email = user?.email || '';
  const phone = profile?.phone || '';
  
  // Parse saved travellers from JSONB (empty array for MVP if not set)
  // Important: This structure is documented to easily migrate to a relational table
  const savedTravellers = profile?.saved_travellers || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">My Profile</h1>
        <p className="text-zinc-500 mt-1">Manage your personal information and saved travellers.</p>
      </header>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-tb-primary" />
          Personal Information
        </h2>
        
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">First Name</label>
              <input 
                type="text" 
                defaultValue={firstName}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Last Name</label>
              <input 
                type="text" 
                defaultValue={lastName}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                defaultValue={email}
                disabled
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-600" /> Verified via Auth
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                defaultValue={phone}
                placeholder="e.g. +1 234 567 8900"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end border-t border-zinc-100">
            <Button type="button" variant="primary">Save Changes</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 mb-2">
          Saved Travellers
        </h2>
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex items-start gap-2 mb-6">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed">
            Save details for family and friends here to auto-fill bookings faster. Note: This feature is currently in MVP and stores data as JSONB, preparing for a future relational schema migration.
          </p>
        </div>

        {savedTravellers.length === 0 ? (
          <div className="text-center py-8 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
            <p className="text-zinc-500 text-sm mb-4">You haven&apos;t saved any other travellers yet.</p>
            <Button type="button" variant="outline" size="sm">Add New Traveller</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {savedTravellers.map((t: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-4 border border-zinc-200 rounded-xl">
                <div>
                  <div className="font-bold text-sm text-zinc-900">{t.firstName} {t.lastName}</div>
                  <div className="text-xs text-zinc-500">{t.email}</div>
                </div>
                <Button type="button" variant="outline" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
