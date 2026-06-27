import React from "react";
import { getCompanyTreks } from "@/lib/company/treks";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function CompanyTreksPage() {
  const treks = await getCompanyTreks();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Treks</h1>
          <p className="text-zinc-500 mt-1">Manage your trekking catalog.</p>
        </div>
        <Link href="/company/treks/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Trek
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Trek Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Region</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {treks.map(trek => (
              <tr key={trek.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{trek.title}</td>
                <td className="px-6 py-4 text-zinc-600">{trek.region || '-'}</td>
                <td className="px-6 py-4 text-zinc-900">₹{trek.price_per_person.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    trek.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                    trek.status === 'draft' ? 'bg-zinc-100 text-zinc-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {trek.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/company/treks/${trek.id}/edit`} className="text-sm text-tb-primary hover:underline font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {treks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No treks found. Create your first one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
