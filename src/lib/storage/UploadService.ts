import { SupabaseUploadProvider } from './SupabaseUploadProvider';

export interface UploadProvider {
  upload(file: File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getPublicUrl(path: string): string;
  reorder(images: string[]): Promise<string[]>;
  replace(path: string, newFile: File): Promise<string>;
}

class UploadService {
  private provider: UploadProvider;

  constructor(provider: UploadProvider) {
    this.provider = provider;
  }

  async upload(file: File, path: string): Promise<string> {
    return this.provider.upload(file, path);
  }

  async delete(path: string): Promise<void> {
    return this.provider.delete(path);
  }

  getPublicUrl(path: string): string {
    return this.provider.getPublicUrl(path);
  }

  async reorder(images: string[]): Promise<string[]> {
    return this.provider.reorder(images);
  }

  async replace(path: string, newFile: File): Promise<string> {
    return this.provider.replace(path, newFile);
  }
}

// Export a singleton instance using the Supabase provider by default
// In the future, this can easily be swapped for AWS S3 or Cloudinary
export const uploadService = new UploadService(new SupabaseUploadProvider());
