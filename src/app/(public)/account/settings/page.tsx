import React from 'react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Lock, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <Container>
      <div className="space-y-8 animate-in fade-in duration-500 pt-24 pb-20 max-w-3xl mx-auto">
        <header>
          <h1 className="text-3xl font-bold text-zinc-900">Account Settings</h1>
          <p className="text-zinc-500 mt-1">Manage your security preferences and account status.</p>
        </header>

        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-tb-primary" />
            Security
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1">Change Password</h3>
              <p className="text-sm text-zinc-500 mb-4">Update your password to keep your account secure.</p>
              <Button type="button" variant="outline">Update Password</Button>
            </div>
            
            <div className="pt-6 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-1">Email Preferences</h3>
              <p className="text-sm text-zinc-500 mb-4">Manage the notifications you receive from TrekBazaar.</p>
              <Button type="button" variant="outline">Manage Preferences</Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button type="button" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
            Delete Account
          </Button>
        </div>
      </div>
    </Container>
  );
}
