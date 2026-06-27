import React from "react";
import { getCompanyDepartures } from "@/lib/company/departures";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function CompanyDeparturesPage() {
  const departures = await getCompanyDepartures();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Departures</h1>
          <p className="text-zinc-500 mt-1">Manage your batch schedules and capacity.</p>
        </div>
        <Link href="/company/departures/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Departure
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Trek Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {departures.map(dep => (
              <tr key={dep.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{dep.treks?.title}</td>
                <td className="px-6 py-4 text-zinc-600">
                  {new Date(dep.departure_date).toLocaleDateString()} - {new Date(dep.return_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-tb-primary" 
                        style={{ width: `${Math.min(100, (dep.booked_seats / dep.total_seats) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-600">
                      {dep.booked_seats} / {dep.total_seats}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    dep.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                    dep.status === 'Full' ? 'bg-red-100 text-red-800' : 
                    dep.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-zinc-100 text-zinc-800'
                  }`}>
                    {dep.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/company/departures/${dep.id}/edit`} className="text-sm text-tb-primary hover:underline font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {departures.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No departures found. Create your first one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
