"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCompanyContext } from "@/lib/company/auth";
import type { Company } from "@/lib/types";

export async function initializePartnerProfile(): Promise<{ success: boolean; error?: string; company?: Company }> {
  const ctx = await getCompanyContext();
  
  if (ctx.status === "unauthenticated") {
    return { success: false, error: "Not authenticated" };
  }
  
  if (ctx.status === "ok") {
    // Idempotency: Company already exists, return it
    return { success: true, company: ctx.company };
  }
  
  if (ctx.status === "multiple-companies") {
    return { success: false, error: "Multiple companies found. Contact support." };
  }

  // ctx.status === "no-company"
  const adminClient = createAdminClient();
  const uniqueSlug = `company-${ctx.user.id.substring(0, 12)}`;
  
  const fullName = ctx.user.user_metadata?.full_name || null;
  const avatarUrl = ctx.user.user_metadata?.avatar_url || null;
  const email = ctx.user.email || null;
  
  // Use upsert to guarantee idempotency and avoid duplicate key errors
  // This relies on owner_id being unique in the database
  const { data, error } = await adminClient.from("companies").upsert({
    owner_id: ctx.user.id,
    name: fullName ? `${fullName}'s Trekking Company` : "New Partner Company",
    slug: uniqueSlug,
    email: email,
    contact_person: fullName,
    owner_avatar_url: avatarUrl,
    onboarding_status: "REGISTERED",
    status: "suspended",
    featured: false
  }, {
    onConflict: 'owner_id',
    ignoreDuplicates: false // We update if it somehow exists but wasn't caught by getCompanyContext
  }).select().single();
  
  if (error) {
    console.error("Failed to initialize company", error);
    return { success: false, error: error.message };
  }
  
  return { success: true, company: data as Company };
}
