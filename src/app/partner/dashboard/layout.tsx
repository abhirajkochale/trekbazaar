import React from "react";
import { CompanySidebar } from "@/components/partner/layout/CompanySidebar";
import { CompanyNotLinked } from "@/components/partner/layout/CompanyNotLinked";
import { CommandMenu } from "@/components/partner/layout/CommandMenu";
import { logoutCompany } from "@/app/actions/company-auth";
import { LogOut, LayoutDashboard, Map, CalendarDays, BookOpen, Menu } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCompanyContext } from "@/lib/company/auth";

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCompanyContext();

  if (ctx.status === "unauthenticated") {
    return <>{children}</>;
  }

  if (ctx.status !== "ok") {
    return <CompanyNotLinked variant={ctx.status} />;
  }

  if (ctx.company.verification_status !== "approved") {
    redirect("/partner/onboarding/status");
  }

  const companyName = ctx.company.name || "Partner Portal";

  return (
    <div className="flex h-[100dvh] bg-white md:bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 border-r border-zinc-200/80 bg-white hidden md:block">
        <CompanySidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-l-none md:rounded-l-2xl md:border-l border-zinc-200/50 md:shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.05)] md:my-2 md:mr-2 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-14 md:h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              T
            </div>
            <div className="text-sm font-bold text-zinc-900 tracking-tight">
              {companyName}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank"
              className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:flex items-center gap-2"
            >
              View Storefront
            </Link>
            
            <div className="hidden sm:block h-4 w-px bg-zinc-200" />
            
            <form action={logoutCompany}>
              <button 
                type="submit"
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200 flex items-center justify-around px-2 pb-safe z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <Link href="/partner/dashboard" className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-900 w-16">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <Link href="/partner/dashboard/treks" className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-900 w-16">
          <Map className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Treks</span>
        </Link>
        <Link href="/partner/dashboard/departures" className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-900 w-16">
          <CalendarDays className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Dates</span>
        </Link>
        <Link href="/partner/dashboard/bookings" className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-900 w-16">
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Books</span>
        </Link>
        <Link href="/partner/dashboard/profile" className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-900 w-16">
          <Menu className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">More</span>
        </Link>
      </div>

      <CommandMenu />
    </div>
  );
}
