import React from "react";
import { CompanySidebar } from "@/components/company/layout/CompanySidebar";
import { CompanyNotLinked } from "@/components/company/layout/CompanyNotLinked";
import { logoutCompany } from "@/app/actions/company-auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { getCompanyContext } from "@/lib/company/auth";

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCompanyContext();

  // Unauthenticated (e.g. the /company/login page). Middleware already
  // redirects logged-out users away from protected routes, so just render the
  // page bare without the portal chrome.
  if (ctx.status === "unauthenticated") {
    return <>{children}</>;
  }

  // Authenticated but not cleanly linked to exactly one company: show a clean
  // explanatory screen instead of an empty dashboard or a raw Supabase error.
  if (ctx.status !== "ok") {
    return <CompanyNotLinked variant={ctx.status} />;
  }

  const companyName = ctx.company.name || "Partner Portal";

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-zinc-200 bg-white hidden md:block">
        <CompanySidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger could go here */}
            <div className="text-sm font-medium text-zinc-500">
              {companyName}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank"
              className="text-sm font-medium text-zinc-600 hover:text-tb-primary transition-colors flex items-center gap-2"
            >
              View Website
            </Link>
            
            <div className="h-6 w-px bg-zinc-200" />
            
            <form action={logoutCompany}>
              <button 
                type="submit"
                className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
