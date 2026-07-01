import React from "react";
import { DepartureEditor } from "@/components/admin/departures/editor/DepartureEditor";
import { getCompanyTreks } from "@/lib/company/treks";
import { getCompanyDeparture } from "@/lib/company/departures";
import { notFound } from "next/navigation";
import { saveCompanyDepartureAction } from "../../actions";

export default async function EditCompanyDeparturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [departure, treks] = await Promise.all([
    getCompanyDeparture(id),
    getCompanyTreks()
  ]);

  if (!departure) {
    notFound();
  }

  return (
    <DepartureEditor 
      initialDeparture={departure}
      companies={[]}
      treks={treks}
      isCompanyPortal={true}
      onSaveOverride={saveCompanyDepartureAction}
    />
  );
}
