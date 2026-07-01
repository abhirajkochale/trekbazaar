import { createClient } from '@/lib/supabase/client';
import type { UploadProvider } from './UploadService';

const supabase = createClient();
const BUCKET_NAME = 'media';

export class SupabaseUploadProvider implements UploadProvider {
  async upload(file: File, path: string): Promise<string> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message);
    }

    return this.getPublicUrl(path);
  }

  async delete(path: string): Promise<void> {
    // Extract the actual path relative to the bucket if a full URL is provided
    let relativePath = path;
    if (path.includes(`${BUCKET_NAME}/`)) {
      relativePath = path.split(`${BUCKET_NAME}/`)[1];
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([relativePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(error.message);
    }
  }

  getPublicUrl(path: string): string {
    // If it's already a full URL, just return it
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async reorder(images: string[]): Promise<string[]> {
    // Reordering is primarily a UI and database concern since storage
    // is just a bucket of files. This method can just return the sorted array.
    return images;
  }

  async replace(path: string, newFile: File): Promise<string> {
    // To replace, we use upsert: true
    // First ensure we have the relative path
    let relativePath = path;
    if (path.includes(`${BUCKET_NAME}/`)) {
      relativePath = path.split(`${BUCKET_NAME}/`)[1];
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(relativePath, newFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase replace error:', error);
      throw new Error(error.message);
    }

    // Append a timestamp query param to force cache busting in the browser
    return `${this.getPublicUrl(relativePath)}?t=${Date.now()}`;
  }
}
