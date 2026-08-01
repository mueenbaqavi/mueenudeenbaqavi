"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file uploaded");

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Unauthorized");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filePath, file);

  if (uploadError) throw new Error("Failed to upload file to storage: " + uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(filePath);

  const { data: asset, error: dbError } = await supabase
    .from("media_assets")
    .insert({
      title: file.name,
      kind: "image",
      bucket: "media",
      path: filePath,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: authData.user.id,
    })
    .select("id")
    .single();

  if (dbError) throw new Error("Failed to save media asset: " + dbError.message);

  return { id: asset.id, url: publicUrl };
}
