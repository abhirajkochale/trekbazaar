import React from "react";
import { TrekEditor } from "@/components/admin/treks/editor/TrekEditor";
import { getCompanyTrek } from "@/lib/company/treks";
import { notFound } from "next/navigation";
import { saveCompanyTrekAction } from "../../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

import { getCompanyContext } from "@/lib/company/auth";

export default async function EditCompanyTrekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trek = await getCompanyTrek(id);

  if (!trek) {
    notFound();
  }

  const supabase = await createClient();
  const { data: masterTreks } = await supabase.from('master_treks').select('id, name, category:master_trek_categories(name), region:regions(name)').eq('status', 'active').order('name', { ascending: true });

  const ctx = await getCompanyContext();
  const companyName = ctx.status === "ok" ? ctx.company.name : "";

  return (
    <TrekEditor 
      initialTrek={trek} 
      isCompanyPortal={true}
      currentCompanyName={companyName}
      onSaveOverride={saveCompanyTrekAction}
      companies={[]}
      masterTreks={masterTreks || []}
    />
  );
}
