"use server";

import { createAdminClient } from '@/lib/supabase/admin';

export async function provisionCompanyUser(companyId: string, email: string, password: string) {
  try {
    const supabaseAdmin = createAdminClient();

    // 0. Guard: the company must exist and must not already have a linked login.
    //    Prevents silently orphaning a previous owner by overwriting owner_id.
    const { data: company, error: fetchError } = await supabaseAdmin
      .from('companies')
      .select('owner_id')
      .eq('id', companyId)
      .maybeSingle();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }
    if (!company) {
      return { success: false, error: "Company not found." };
    }
    if (company.owner_id) {
      return {
        success: false,
        error: "This company already has a linked login. Unlink it before provisioning a new one.",
      };
    }

    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Failed to create auth user" };
    }

    // 2. Link owner_id to the company
    const { error: updateError } = await supabaseAdmin
      .from('companies')
      .update({ owner_id: authData.user.id })
      .eq('id', companyId);

    if (updateError) {
      // Rollback user creation if company update fails.
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      // 23505 = unique_violation on the one-company-per-owner index.
      const isDuplicate = (updateError as { code?: string }).code === "23505";
      return {
        success: false,
        error: isDuplicate
          ? "This user is already linked to another company."
          : "Failed to link user to company",
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error provisioning user";
    return { success: false, error: msg };
  }
}
