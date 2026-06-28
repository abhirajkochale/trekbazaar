import React from "react";
import { getCompanyTreks } from "@/lib/company/treks";
import { TreksClientList } from "@/components/partner/treks/TreksClientList";

export default async function CompanyTreksPage() {
  const treks = await getCompanyTreks();
  
  return <TreksClientList treks={treks} />;
}
