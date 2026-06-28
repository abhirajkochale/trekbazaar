import React from "react";
import { getCompanyProfile } from "@/lib/company/profile";
import { CompanyEditor } from "@/components/admin/companies/editor/CompanyEditor";
import { notFound } from "next/navigation";
import { saveCompanyProfileAction } from "./actions";

export default async function CompanyProfilePage() {
  const company = await getCompanyProfile();

  if (!company) {
    // Should never happen if auth is working correctly
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Company Profile</h1>
        <p className="text-zinc-500 mt-1">Manage your public information and branding.</p>
      </div>

      <CompanyEditor 
        initialCompany={company}
        isCompanyPortal={true}
        onSaveOverride={saveCompanyProfileAction}
      />
    </div>
  );
}
