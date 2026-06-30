import React from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Lock, Trash2, Bell } from 'lucide-react';

export const metadata = { title: 'Settings — TrekBazaar' };

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Hero */}
      <div className="bg-white border-b border-zinc-100">
        <Container>
          <div className="pt-28 pb-8">
            <p className="text-sm font-semibold text-tb-primary mb-1 tracking-wide uppercase">Account</p>
            <h1 className="text-4xl font-black text-zinc-900">Settings</h1>
            <p className="text-zinc-500 mt-1.5 text-base">Manage your security preferences and account status.</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10 max-w-2xl mx-auto space-y-6">

          {/* Security */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-tb-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-tb-primary" />
              </div>
              <h2 className="text-base font-bold text-zinc-900">Security & Preferences</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1">Change Password</h3>
                  <p className="text-sm text-zinc-500">Update your password to keep your account secure.</p>
                </div>
                <Button type="button" variant="outline" className="shrink-0 bg-white hover:bg-zinc-50 text-sm">
                  Update Password
                </Button>
              </div>
              
              <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Bell className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 mb-1">Email Notifications</h3>
                    <p className="text-sm text-zinc-500">Receive updates about your bookings and new offers.</p>
                  </div>
                </div>
                <Button type="button" variant="outline" className="shrink-0 bg-white hover:bg-zinc-50 text-sm">
                  Manage Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-red-50 flex items-center gap-3 bg-red-50/30">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-zinc-500" />
              </div>
              <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                Once you delete your account, there is no going back. All your saved data, upcoming bookings, and history will be permanently erased. Please be certain.
              </p>
              <Button type="button" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 bg-white text-sm">
                Permanently Delete Account
              </Button>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
