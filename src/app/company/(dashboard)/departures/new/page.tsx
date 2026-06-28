import React from "react";
import { DepartureEditor } from "@/components/admin/departures/editor/DepartureEditor";
import { getCompanyTreks } from "@/lib/company/treks";
import { saveCompanyDepartureAction } from "../actions";
import { getCompanyDepartures } from "@/lib/company/departures";

export default async function NewCompanyDeparturePage({ searchParams }: { searchParams: Promise<{ duplicate?: string }> }) {
  const params = await searchParams;
  const duplicateId = params?.duplicate;
  const treks = await getCompanyTreks();
  
  let initialDeparture = undefined;
  
  if (duplicateId) {
    const departures = await getCompanyDepartures();
    const match = departures.find(d => d.id === duplicateId);
    if (match) {
      initialDeparture = {
        ...match,
        id: "", // ensure it's treated as new
        status: "Upcoming" as const, // reset status
        booked_seats: 0, // reset bookings
      };
    }
  }

  return (
    <DepartureEditor 
      initialDeparture={initialDeparture}
      companies={[]} // Unused in company portal
      treks={treks}
      isCompanyPortal={true}
      onSaveOverride={saveCompanyDepartureAction}
    />
  );
}
