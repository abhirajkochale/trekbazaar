import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omrjjrswvhcbvibuhgvq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const BAD_URLS = [
  'https://images.unsplash.com/photo-1510007559134-d3b5df54bbf8',
  'https://images.unsplash.com/photo-1506744626753-eda818273503'
];

// Fallback high-quality mountain imagery
const GOOD_URLS = [
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  'https://images.unsplash.com/photo-1521115170560-61fb06fb4606?w=1200&q=80', // the valley of flowers image we know works
];

function replaceBadUrl(url) {
  if (!url) return url;
  if (url.includes('1510007559134-d3b5df54bbf8')) {
    return GOOD_URLS[0];
  }
  if (url.includes('1506744626753-eda818273503')) {
    return GOOD_URLS[1];
  }
  return url;
}

async function fixTreks() {
  const { data: treks, error } = await supabase.from('master_treks').select('*');
  if (error) {
    console.error('Error fetching master_treks', error);
    return;
  }

  for (const trek of treks) {
    let changed = false;
    let newCover = trek.cover_image;
    let newGallery = trek.gallery || [];

    if (newCover && (newCover.includes('1510007559134') || newCover.includes('1506744626753'))) {
      newCover = replaceBadUrl(newCover);
      changed = true;
    }

    if (Array.isArray(newGallery)) {
      for (let i = 0; i < newGallery.length; i++) {
        if (newGallery[i].includes('1510007559134') || newGallery[i].includes('1506744626753')) {
          newGallery[i] = replaceBadUrl(newGallery[i]);
          changed = true;
        }
      }
    }

    if (changed) {
      console.log(`Updating master_trek ${trek.name}`);
      const { error: updateError } = await supabase
        .from('master_treks')
        .update({ cover_image: newCover, gallery: newGallery })
        .eq('id', trek.id);
      if (updateError) {
        console.error('Failed to update', trek.name, updateError);
      }
    }
  }
}

async function fixLegacyTreks() {
  const { data: treks, error } = await supabase.from('treks').select('*');
  if (error) {
    console.error('Error fetching treks', error);
    return;
  }

  for (const trek of treks) {
    let changed = false;
    let newCover = trek.cover_image;
    let newGallery = trek.gallery || [];

    if (newCover && (newCover.includes('1510007559134') || newCover.includes('1506744626753'))) {
      newCover = replaceBadUrl(newCover);
      changed = true;
    }

    if (Array.isArray(newGallery)) {
      for (let i = 0; i < newGallery.length; i++) {
        if (newGallery[i].includes('1510007559134') || newGallery[i].includes('1506744626753')) {
          newGallery[i] = replaceBadUrl(newGallery[i]);
          changed = true;
        }
      }
    }

    if (changed) {
      console.log(`Updating legacy trek ${trek.name}`);
      const { error: updateError } = await supabase
        .from('treks')
        .update({ cover_image: newCover, gallery: newGallery })
        .eq('id', trek.id);
      if (updateError) {
        console.error('Failed to update', trek.name, updateError);
      }
    }
  }
}

async function fixRegions() {
  const { data: regions, error } = await supabase.from('regions').select('*');
  if (error) {
    console.error('Error fetching regions', error);
    return;
  }

  for (const region of regions) {
    if (region.cover_image && (region.cover_image.includes('1510007559134') || region.cover_image.includes('1506744626753'))) {
      console.log(`Updating region ${region.name}`);
      const { error: updateError } = await supabase
        .from('regions')
        .update({ cover_image: replaceBadUrl(region.cover_image) })
        .eq('id', region.id);
      if (updateError) {
        console.error('Failed to update', region.name, updateError);
      }
    }
  }
}

async function run() {
  console.log('Starting image fix script...');
  await fixTreks();
  await fixLegacyTreks();
  await fixRegions();
  console.log('Done fixing images!');
}

run();
