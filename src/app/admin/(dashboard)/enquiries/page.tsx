import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateEnquiryStatus } from "./actions";

export const dynamic = "force-dynamic";

type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "open" | "responded" | "closed";
  created_at: string;
  trek: { title: string; slug: string } | null;
};

const statusBadge: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  responded: "bg-green-100 text-green-800",
  closed: "bg-zinc-200 text-zinc-600",
};

export default async function AdminEnquiriesPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, trek:treks(title, slug)")
    .order("created_at", { ascending: false });

  const enquiries = (data ?? []) as EnquiryRow[];

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900">Enquiries</h1>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Failed to load enquiries: {error.message}
        </p>
      )}

      {enquiries.length === 0 ? (
        <p className="mt-4 rounded border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
          No enquiries yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {enquiries.map((enq) => (
            <li
              key={enq.id}
              className="rounded border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-900">
                    {enq.name}{" "}
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusBadge[enq.status]
                      }`}
                    >
                      {enq.status}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-600">
                    <a
                      href={`mailto:${enq.email}`}
                      className="text-emerald-700 hover:underline"
                    >
                      {enq.email}
                    </a>
                    {enq.phone ? ` · ${enq.phone}` : ""}
                  </p>
                </div>
                <p className="text-xs text-zinc-400">
                  {new Date(enq.created_at).toLocaleString()}
                </p>
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                Re:{" "}
                {enq.trek ? (
                  <Link
                    href={`/treks/${enq.trek.slug}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {enq.trek.title}
                  </Link>
                ) : (
                  <span className="italic">General enquiry</span>
                )}
              </p>

              {enq.message && (
                <p className="mt-2 whitespace-pre-line rounded bg-zinc-50 p-3 text-sm text-zinc-700">
                  {enq.message}
                </p>
              )}

              <div className="mt-3 flex gap-2">
                <form action={updateEnquiryStatus}>
                  <input type="hidden" name="id" value={enq.id} />
                  <input type="hidden" name="status" value="responded" />
                  <button
                    type="submit"
                    disabled={enq.status === "responded"}
                    className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark responded
                  </button>
                </form>
                <form action={updateEnquiryStatus}>
                  <input type="hidden" name="id" value={enq.id} />
                  <input type="hidden" name="status" value="closed" />
                  <button
                    type="submit"
                    disabled={enq.status === "closed"}
                    className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark closed
                  </button>
                </form>
                {enq.status !== "open" && (
                  <form action={updateEnquiryStatus}>
                    <input type="hidden" name="id" value={enq.id} />
                    <input type="hidden" name="status" value="open" />
                    <button
                      type="submit"
                      className="rounded border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Reopen
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
