-- TrekBazaar — sample trek listings for testing.
-- Paste this whole file into the Supabase dashboard SQL Editor and click "Run".
--
-- BEFORE (or after) running: replace every REPLACE_ME operator_name /
-- operator_contact below with your real operator details. The treks, regions,
-- durations and prices are realistic but you should adjust prices to match
-- what your operators actually charge.
--
-- Re-running this file is safe: ON CONFLICT (slug) DO NOTHING means existing
-- rows (matched by slug) are skipped instead of duplicated.

insert into public.treks
  (title, slug, description, region, difficulty, duration_days,
   price_per_person, operator_name, operator_contact, status)
values
  (
    'Hampta Pass Trek',
    'hampta-pass',
    'A dramatic crossover trek that takes you from the green valleys of Kullu to the stark, high-altitude desert of Lahaul in just a few days. Highlights include river crossings, the steep climb to the 14,100 ft pass, and an optional side trip to Chandratal lake.',
    'Himachal Pradesh',
    'moderate',
    5,
    8500,
    'REPLACE_ME Operator Name',
    'REPLACE_ME phone or email',
    'active'
  ),
  (
    'Kedarkantha Trek',
    'kedarkantha',
    'One of India''s most popular winter treks, leading through pine forests and snow-covered clearings to a 12,500 ft summit with sweeping Himalayan views. Beginner-friendly and stunning under fresh snow.',
    'Uttarakhand',
    'easy',
    6,
    9000,
    'REPLACE_ME Operator Name',
    'REPLACE_ME phone or email',
    'active'
  ),
  (
    'Valley of Flowers Trek',
    'valley-of-flowers',
    'A UNESCO World Heritage trek through an alpine valley carpeted with hundreds of species of wildflowers in the monsoon months. Combines gentle meadow walking with a visit to the sacred Hemkund Sahib lake.',
    'Uttarakhand',
    'moderate',
    6,
    11000,
    'REPLACE_ME Operator Name',
    'REPLACE_ME phone or email',
    'active'
  ),
  (
    'Roopkund Trek',
    'roopkund',
    'A challenging high-altitude trek to the mysterious "skeleton lake" at 16,000 ft, set against the Trishul massif. Long summit days, rapidly changing weather, and rich Garhwali folklore make this one for experienced trekkers.',
    'Uttarakhand',
    'difficult',
    8,
    13500,
    'REPLACE_ME Operator Name',
    'REPLACE_ME phone or email',
    'active'
  ),
  (
    'Markha Valley Trek',
    'markha-valley',
    'A classic Ladakh trek through remote villages, Buddhist monasteries and dry mountain canyons, with high passes above 16,000 ft and views of Kang Yatse. Demanding terrain and thin air reward you with one of the Himalaya''s most distinctive landscapes.',
    'Ladakh',
    'difficult',
    7,
    18000,
    'REPLACE_ME Operator Name',
    'REPLACE_ME phone or email',
    'active'
  )
on conflict (slug) do nothing;
