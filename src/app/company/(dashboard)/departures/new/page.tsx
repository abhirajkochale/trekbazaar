import React from "react";
import { DepartureEditor } from "@/components/admin/departures/editor/DepartureEditor";
import { getCompanyTreks } from "@/lib/company/treks";
import { saveCompanyDepartureAction } from "../actions";

export default async function NewCompanyDeparturePage() {
  const treks = await getCompanyTreks();
  
  return (
    <DepartureEditor 
      companies={[]} // Unused in company portal
      treks={treks}
      isCompanyPortal={true}
      onSaveOverride={saveCompanyDepartureAction}
    />
  );
}
