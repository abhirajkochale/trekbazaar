import React from "react";
import { getCompanyDepartures } from "@/lib/company/departures";
import { DeparturesClientList } from "@/components/company/departures/DeparturesClientList";

export default async function CompanyDeparturesPage() {
  const departures = await getCompanyDepartures();
  
  return <DeparturesClientList departures={departures} />;
}
