import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Trek } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-zinc-200 text-zinc-700",
  archived: "bg-amber-100 text-amber-800",
};

export default async function AdminTreksPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("treks")
    .select("*")
    .order("created_at", { ascending: false });

  const treks = (data ?? []) as Trek[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Treks</h1>
        <Link
          href="/admin/treks/new"
          className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Add New Trek
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Failed to load treks: {error.message}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {treks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No treks yet. Click “Add New Trek” to create one.
                </td>
              </tr>
            ) : (
              treks.map((trek) => (
                <tr key={trek.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {trek.title}
                    <span className="block text-xs font-normal text-zinc-400">
                      /{trek.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{trek.region}</td>
                  <td className="px-4 py-3 text-zinc-700">{trek.difficulty}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {formatPrice(trek.price_per_person)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusBadge[trek.status] ?? "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {trek.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/treks/${trek.id}/edit`}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
