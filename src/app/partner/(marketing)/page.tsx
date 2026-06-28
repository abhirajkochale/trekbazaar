import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mountain, Shield, TrendingUp, Users } from 'lucide-react';

export default async function PartnerLandingPage() {
  const ctx = await getCompanyContext();

  // Redirect users who already have an account based on their approval status
  if (ctx.status === "ok") {
    if (ctx.company.approval_status === "approved") {
      redirect("/partner/dashboard");
    } else {
      redirect("/partner/onboarding/status");
    }
  } else if (ctx.status === "no-company" || ctx.status === "multiple-companies") {
    redirect("/partner/onboarding");
  }

  // Render Marketing Page for unauthenticated users
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-900 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-900/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"
            alt="Mountains"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-tb-primary/20 text-tb-primary font-bold text-sm mb-6 border border-tb-primary/30">
              For Trekking Operators
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Grow Your Trekking Business with TrekBazaar
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed font-medium">
              Join India's largest verified marketplace for trekking operators. Get a professional storefront, manage bookings, and reach thousands of trekkers instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/partner/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-tb-primary text-zinc-900 font-bold rounded-xl hover:bg-tb-primary/90 transition-all text-lg shadow-lg active:scale-95"
              >
                Become a Partner <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/partner/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Everything you need to scale</h2>
            <p className="text-zinc-500 text-lg">Stop relying on WhatsApp and Google Forms. Upgrade to a modern booking system.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Mountain className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Free Professional Website</h3>
              <p className="text-zinc-500 leading-relaxed">
                Get a beautifully designed, SEO-optimized microsite for your company instantly. No coding required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Reach More Customers</h3>
              <p className="text-zinc-500 leading-relaxed">
                List your departures alongside top operators. Our comparison engine drives highly qualified leads directly to you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Manage Operations</h3>
              <p className="text-zinc-500 leading-relaxed">
                A powerful dashboard to manage inventory, track bookings, and handle customer details all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Validation */}
      <section className="py-24 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-8">
            <Shield className="w-8 h-8 text-tb-primary" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-6">Verified Operators Only</h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            We maintain strict quality standards to ensure trekkers get the best experience. Registration is free, but every partner must pass our verification process.
          </p>
          <Link
            href="/partner/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all text-lg shadow-lg active:scale-95"
          >
            Start Verification Process
          </Link>
        </div>
      </section>
    </div>
  );
}
