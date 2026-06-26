"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED = ["open", "responded", "closed"];

export async function updateEnquiryStatus(formData: FormData) {
  const id = (formData.get("id") as string) ?? "";
  const status = (formData.get("status") as string) ?? "";
  if (!id || !ALLOWED.includes(status)) return;

  const supabase = createAdminClient();
  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/enquiries");
}
