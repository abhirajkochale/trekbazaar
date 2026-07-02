import React from "react";
import { TrekEditor } from "@/components/admin/treks/editor/TrekEditor";
import { saveCompanyTrekAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

import { getCompanyContext } from "@/lib/company/auth";

export default async function NewCompanyTrekPage() {
  const supabase = await createClient();
  const { data: masterTreks } = await supabase.from('master_treks').select('id, name, category:master_trek_categories(name), region:regions(name)').eq('status', 'active').order('name', { ascending: true });

  const ctx = await getCompanyContext();
  const companyName = ctx.status === "ok" ? ctx.company.name : "";

  return (
    <TrekEditor 
      isCompanyPortal={true}
      currentCompanyName={companyName}
      onSaveOverride={saveCompanyTrekAction}
      companies={[]} // Companies array is unused in company portal since selector is hidden
      masterTreks={masterTreks || []}
    />
  );
}
