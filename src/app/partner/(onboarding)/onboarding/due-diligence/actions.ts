"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { DocumentType } from "@/lib/types";

export async function savePartnerDocumentAction(companyId: string, documentType: DocumentType, fileUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const adminClient = createAdminClient();

  // Ensure user owns company. Must use adminClient because company is suspended.
  const { data: company } = await adminClient
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .single();

  if (!company) {
    return { success: false, error: "Unauthorized or company not found" };
  }

  // Check if document already exists
  const { data: existingDoc } = await adminClient
    .from("partner_documents")
    .select("id")
    .eq("company_id", companyId)
    .eq("document_type", documentType)
    .single();

  let error = null;

  if (existingDoc) {
    const { error: updateError } = await adminClient
      .from("partner_documents")
      .update({
        file_url: fileUrl,
        status: "PENDING",
        review_notes: null,
        uploaded_at: new Date().toISOString()
      })
      .eq("id", existingDoc.id);
    error = updateError;
  } else {
    const { error: insertError } = await adminClient
      .from("partner_documents")
      .insert({
        company_id: companyId,
        document_type: documentType,
        file_url: fileUrl,
        status: "PENDING"
      });
    error = insertError;
  }

  if (error) {
    console.error("Save document error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/partner/onboarding", "layout");
  return { success: true };
}

export async function advanceToTermsAction(companyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const adminClient = createAdminClient();

  const { data: company } = await adminClient
    .from("companies")
    .select("id, onboarding_status")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .single();

  if (!company) return { success: false, error: "Unauthorized" };

  // Update status if it's currently PROFILE_COMPLETED
  if (company.onboarding_status === "PROFILE_COMPLETED") {
    const { error } = await adminClient
      .from("companies")
      .update({ onboarding_status: "DUE_DILIGENCE" })
      .eq("id", companyId);

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/partner/onboarding");
  return { success: true };
}
