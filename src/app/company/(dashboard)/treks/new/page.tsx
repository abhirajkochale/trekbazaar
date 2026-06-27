import React from "react";
import { TrekEditor } from "@/components/admin/treks/editor/TrekEditor";
import { saveCompanyTrekAction } from "../actions";

export default function NewCompanyTrekPage() {
  return (
    <TrekEditor 
      isCompanyPortal={true}
      onSaveOverride={saveCompanyTrekAction}
      companies={[]} // Companies array is unused in company portal since selector is hidden
    />
  );
}
