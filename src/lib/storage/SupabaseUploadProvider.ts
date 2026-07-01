import { uploadFileExactPathAction, deleteFileAction } from '@/app/actions/upload';
import type { UploadProvider } from './UploadService';

const BUCKET_NAME = 'media';

export class SupabaseUploadProvider implements UploadProvider {
  async upload(file: File, path: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    formData.append("upsert", "false");
    
    return await uploadFileExactPathAction(formData);
  }

  async delete(path: string): Promise<void> {
    await deleteFileAction(path);
  }

  getPublicUrl(path: string): string {
    if (path.startsWith('http')) return path;
    // Just construct the public URL directly since we know the structure
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${url}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  }

  async reorder(images: string[]): Promise<string[]> {
    return images;
  }

  async replace(path: string, newFile: File): Promise<string> {
    let relativePath = path;
    if (path.includes(`${BUCKET_NAME}/`)) {
      relativePath = path.split(`${BUCKET_NAME}/`)[1];
    }

    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("path", relativePath);
    formData.append("upsert", "true");
    
    const url = await uploadFileExactPathAction(formData);
    return `${url}?t=${Date.now()}`;
  }
}
