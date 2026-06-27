"use server";

import { createAdminClient } from '@/lib/supabase/admin';

export async function provisionCompanyUser(companyId: string, email: string, password: string) {
  try {
    const supabaseAdmin = createAdminClient();
    
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
      // Rollback user creation if company update fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: "Failed to link user to company" };
    }

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error provisioning user";
    return { success: false, error: msg };
  }
}
