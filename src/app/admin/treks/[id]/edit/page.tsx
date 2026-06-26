import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Trek } from "@/lib/types";
import { TrekForm } from "../../TrekForm";

export const dynamic = "force-dynamic";

export default async function EditTrekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("treks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const trek = data as Trek;

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-zinc-900">
        Edit Trek: {trek.title}
      </h1>
      <div className="rounded border border-zinc-200 bg-white p-5">
        <TrekForm trek={trek} />
      </div>
    </div>
  );
}
