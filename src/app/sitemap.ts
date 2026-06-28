import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.trekbazaar.com';
  const supabase = await createClient();

  // Fetch all active master treks
  const { data: masterTreks } = await supabase
    .from('master_treks')
    .select('slug, updated_at')
    .eq('status', 'active');

  // Fetch all active regions
  const { data: regions } = await supabase
    .from('regions')
    .select('slug, updated_at');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const trekRoutes: MetadataRoute.Sitemap = (masterTreks || []).map((trek) => ({
    url: `${baseUrl}/master-treks/${trek.slug}`,
    lastModified: trek.updated_at ? new Date(trek.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const regionRoutes: MetadataRoute.Sitemap = (regions || []).map((region) => ({
    url: `${baseUrl}/regions/${region.slug}`,
    lastModified: region.updated_at ? new Date(region.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...regionRoutes, ...trekRoutes];
}
