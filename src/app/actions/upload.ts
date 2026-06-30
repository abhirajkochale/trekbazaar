"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string || "uploads";

  if (!file) {
    throw new Error("No file provided");
  }

  const adminClient = createAdminClient();
  const bucketName = "media";

  // Ensure bucket exists (soft check/create for local dev robustness)
  const { data: buckets } = await adminClient.storage.listBuckets();
  if (!buckets?.find(b => b.name === bucketName)) {
    await adminClient.storage.createBucket(bucketName, { public: true });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${uuidv4()}.${fileExt}`;

  const { data, error } = await adminClient.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = adminClient.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
