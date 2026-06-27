import React from "react";
import { TrekEditor } from "@/components/admin/treks/editor/TrekEditor";
import { getCompanyTrek } from "@/lib/company/treks";
import { notFound } from "next/navigation";
import { saveCompanyTrekAction } from "../../actions";

export default async function EditCompanyTrekPage({ params }: { params: { id: string } }) {
  const trek = await getCompanyTrek(params.id);

  if (!trek) {
    notFound();
  }

  return (
    <TrekEditor 
      initialTrek={trek} 
      isCompanyPortal={true}
      onSaveOverride={saveCompanyTrekAction}
      companies={[]}
    />
  );
}
