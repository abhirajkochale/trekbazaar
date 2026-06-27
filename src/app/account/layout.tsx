import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Compass, Heart, User, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Use raw_user_meta_data for the MVP since we couldn't run migrations locally,
  // this ensures the UI works gracefully without crashing if customer_profiles is missing
  const firstName = user.user_metadata?.first_name || 'Trekker';

  const navItems = [
    { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { label: 'My Trips', href: '/account/trips', icon: Compass },
    { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { label: 'Profile', href: '/account/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-zinc-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <Link href="/" className="font-bold text-xl text-tb-primary tracking-tight">TrekBazaar</Link>
        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-tb-primary">
          {firstName[0]?.toUpperCase()}
        </div>
      </div>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside className="fixed bottom-0 w-full md:w-64 md:sticky md:top-0 md:h-screen bg-white border-t md:border-r border-zinc-200 z-30 flex flex-row md:flex-col justify-around md:justify-start">
        
        <div className="hidden md:block p-6 border-b border-zinc-100">
          <Link href="/" className="font-bold text-2xl text-tb-primary tracking-tight block mb-6">
            TrekBazaar
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tb-primary/10 flex items-center justify-center font-bold text-tb-primary text-lg">
              {firstName[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900">Hi, {firstName}</div>
              <div className="text-xs text-zinc-500">Trekker</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 md:px-3 py-2 md:py-6 flex flex-row md:flex-col w-full gap-1 md:gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex-1 md:flex-none flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 p-2 md:p-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-tb-primary transition-colors font-medium text-[10px] md:text-sm"
            >
              <item.icon className="w-5 h-5 md:w-5 md:h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="hidden md:block mt-auto pt-6 border-t border-zinc-100 px-3">
            <form action={logoutAction}>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm">
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
