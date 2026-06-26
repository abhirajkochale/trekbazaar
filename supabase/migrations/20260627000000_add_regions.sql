-- Migration: Add regions table and seed initial data
-- Created at: 2026-06-27 00:00:00

CREATE TABLE public.regions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    hero_image_url text,
    best_season text,
    altitude_range text,
    weather text,
    nearby_attractions text[],
    safety_tips text[],
    things_to_know text[],
    status text NOT NULL DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX regions_slug_idx ON public.regions (slug);
CREATE INDEX regions_status_idx ON public.regions (status);

-- RLS Policies
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active regions"
    ON public.regions FOR SELECT
    USING (status = 'active');

-- Trigger to update 'updated_at'
CREATE TRIGGER handle_updated_at_regions
    BEFORE UPDATE ON public.regions
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime(updated_at);

-- Seed initial regions
INSERT INTO public.regions (
    name, slug, description, hero_image_url, best_season, altitude_range, weather, nearby_attractions, safety_tips, things_to_know
) VALUES 
(
    'Uttarakhand', 
    'uttarakhand', 
    'Uttarakhand, the Land of Gods, offers some of the most diverse and dramatic trekking routes in the Indian Himalayas. From the pristine meadows of Ali Bedni Bugyal to the towering peaks surrounding the Kuari Pass, it is a paradise for trekkers of all levels.',
    'https://images.unsplash.com/photo-1626014903706-e78fb5635f78?auto=format&fit=crop&q=80&w=1920',
    'May to June, Sep to Nov',
    '3,000m - 5,500m',
    'Pleasant in summer, sub-zero in winter. Expect sudden rain/snow at higher altitudes.',
    ARRAY['Rishikesh', 'Nanda Devi National Park', 'Valley of Flowers', 'Badrinath'],
    ARRAY['Acclimatize properly before climbing above 3,500m.', 'Carry layered clothing as temperatures drop sharply at night.', 'Hire a local guide for remote trails.'],
    ARRAY['Permits are required for inner line areas.', 'Mobile network is scarce beyond base camps.', 'ATMs are only available in major towns.']
),
(
    'Himachal Pradesh', 
    'himachal-pradesh', 
    'Known for its lush green valleys and stark cold deserts, Himachal Pradesh is home to legendary treks like Hampta Pass and Pin Parvati. It beautifully bridges the gap between the vibrant lower Himalayas and the barren, majestic Spiti Valley.',
    'https://images.unsplash.com/photo-1605649487212-4d4ce77fd23d?auto=format&fit=crop&q=80&w=1920',
    'June to October',
    '2,500m - 5,300m',
    'Summers are mild, winters are freezing with heavy snowfall. Monsoons can trigger landslides.',
    ARRAY['Manali', 'Spiti Valley', 'Dharamshala', 'Rohtang Pass'],
    ARRAY['Stay hydrated to prevent altitude sickness.', 'Check road conditions during monsoon.', 'Ensure your gear is waterproof.'],
    ARRAY['Manali and Shimla are the best base camps.', 'Local transport is available but can be delayed.', 'Respect local customs in remote villages.']
),
(
    'Kashmir', 
    'kashmir', 
    'Trekking in Kashmir is like walking through a canvas. With its vast alpine lakes, endless meadows, and dramatic landscapes, treks like the Kashmir Great Lakes and Tarsar Marsar are unparalleled in their scenic beauty.',
    'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1920',
    'July to September',
    '3,500m - 4,300m',
    'Pleasant days, chilly nights. Mostly dry during trekking season but occasional showers occur.',
    ARRAY['Srinagar', 'Pahalgam', 'Gulmarg', 'Sonamarg'],
    ARRAY['Always travel with a registered local agency.', 'Carry a robust medical kit.', 'Do not wander off marked trails.'],
    ARRAY['Army checkpoints require valid ID and permits.', 'Post-paid mobile connections are mandatory (prepaid outside J&K won''t work).', 'Cash is essential on the trail.']
),
(
    'Ladakh', 
    'ladakh', 
    'The cold desert of Ladakh offers a raw, challenging, and spiritually uplifting trekking experience. High-altitude passes, ancient monasteries, and stark, moon-like landscapes make treks like Chadar and Markha Valley legendary.',
    'https://images.unsplash.com/photo-1591889709298-50fae9baea19?auto=format&fit=crop&q=80&w=1920',
    'June to September (Jan-Feb for Chadar)',
    '3,500m - 6,000m+',
    'Extremely cold in winter. Summers are warm in the sun but cold in the shade. Very low humidity.',
    ARRAY['Leh', 'Pangong Tso', 'Nubra Valley', 'Hemis Monastery'],
    ARRAY['Strict 2-3 days acclimatization in Leh is mandatory.', 'Drink 4-5 liters of water daily.', 'Protect yourself from intense UV radiation with high SPF and sunglasses.'],
    ARRAY['Inner Line Permits are required for most areas.', 'Physical fitness must be top-notch.', 'Vegetarian food is the staple on treks.']
),
(
    'Sikkim', 
    'sikkim', 
    'Dominated by the majestic Mt. Kangchenjunga, Sikkim offers pristine and less-crowded trails like the Goechala Trek. It features dense rhododendron forests, rich biodiversity, and towering snow-capped peaks.',
    'https://images.unsplash.com/photo-1625442542475-4fc142490cc9?auto=format&fit=crop&q=80&w=1920',
    'April to May, Oct to Nov',
    '2,000m - 5,000m',
    'Heavy monsoons. Spring is clear and colorful. Autumn offers the best mountain views.',
    ARRAY['Gangtok', 'Pelling', 'Kangchenjunga National Park', 'Tsomgo Lake'],
    ARRAY['Expect rain; waterproof gear is non-negotiable.', 'Pace yourself on steep ascents.', 'Listen to your guide regarding weather changes.'],
    ARRAY['Sikkim is a plastic-free state.', 'Restricted Area Permits are required.', 'Respect Buddhist shrines and prayer flags.']
);
