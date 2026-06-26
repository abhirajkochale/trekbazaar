"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type SaveTrekState = { error: string } | null;

function str(formData: FormData, key: string): string {
  return ((formData.get(key) as string) ?? "").trim();
}

export async function saveTrek(
  _prev: SaveTrekState,
  formData: FormData
): Promise<SaveTrekState> {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = str(formData, "slug");
  const description = str(formData, "description");
  const region = str(formData, "region");
  const difficulty = str(formData, "difficulty");
  const cover = str(formData, "cover_image_url");
  const operatorName = str(formData, "operator_name");
  const operatorContact = str(formData, "operator_contact");
  const status = str(formData, "status");

  if (
    !title ||
    !slug ||
    !description ||
    !region ||
    !operatorName ||
    !operatorContact
  ) {
    return { error: "Please fill in all required fields." };
  }

  const duration_days = Number.parseInt(str(formData, "duration_days"), 10);
  const price_per_person = Number.parseFloat(str(formData, "price_per_person"));
  if (!Number.isFinite(duration_days) || duration_days <= 0) {
    return { error: "Duration must be a positive whole number of days." };
  }
  if (!Number.isFinite(price_per_person) || price_per_person < 0) {
    return { error: "Price must be a valid, non-negative number." };
  }

  const payload = {
    title,
    slug,
    description,
    region,
    difficulty,
    duration_days,
    price_per_person,
    cover_image_url: cover || null,
    operator_name: operatorName,
    operator_contact: operatorContact,
    status,
  };

  const supabase = createAdminClient();
  const { error } = id
    ? await supabase.from("treks").update(payload).eq("id", id)
    : await supabase.from("treks").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return {
        error: `The slug "${slug}" is already used by another trek. Please choose a unique slug.`,
      };
    }
    return { error: error.message };
  }

  // Refresh the admin list and any public pages that show this trek.
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/treks/${slug}`);
  redirect("/admin");
}
