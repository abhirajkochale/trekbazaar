import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { User, Shield, Info, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export const metadata = { title: 'Profile — TrekBazaar' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const firstName      = profile?.first_name || user?.user_metadata?.first_name || '';
  const lastName       = profile?.last_name  || user?.user_metadata?.last_name  || '';
  const email          = user?.email || '';
  const phone          = profile?.phone || '';
  const savedTravellers = profile?.saved_travellers || [];

  const inputClass = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary transition";
  const disabledClass = "w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Hero */}
      <div className="bg-white border-b border-zinc-100">
        <Container>
          <div className="pt-28 pb-8">
            <p className="text-sm font-semibold text-tb-primary mb-1 tracking-wide uppercase">Account</p>
            <h1 className="text-4xl font-black text-zinc-900">My Profile</h1>
            <p className="text-zinc-500 mt-1.5 text-base">Manage your personal information and saved travellers.</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10 max-w-2xl mx-auto space-y-6">

          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-tb-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-tb-primary" />
              </div>
              <h2 className="text-base font-bold text-zinc-900">Personal Information</h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">First Name</label>
                  <input type="text" defaultValue={firstName} placeholder="Jane" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input type="text" defaultValue={lastName} placeholder="Doe" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type="email" defaultValue={email} disabled className={`${disabledClass} pl-10`} />
                </div>
                <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-500" /> Verified email — cannot be changed here
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type="tel" defaultValue={phone} placeholder="+91 98765 43210" className={`${inputClass} pl-10`} />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="button" variant="primary" className="px-8">Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Saved Travellers */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900">Saved Travellers</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Save details for family and friends to auto-fill bookings faster. <span className="font-semibold">MVP — stored securely as JSONB, migrating to relational schema soon.</span>
                </p>
              </div>

              {savedTravellers.length === 0 ? (
                <div className="text-center py-10 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  <p className="text-zinc-500 text-sm mb-4">No saved travellers yet.</p>
                  <Button type="button" variant="outline" size="sm">+ Add Traveller</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {savedTravellers.map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 border border-zinc-100 rounded-xl hover:border-zinc-200 transition-colors">
                      <div>
                        <div className="font-semibold text-sm text-zinc-900">{t.firstName} {t.lastName}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{t.email}</div>
                      </div>
                      <Button type="button" variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
