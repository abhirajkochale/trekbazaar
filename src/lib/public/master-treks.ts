import { createClient } from "@/lib/supabase/server";

export async function getMasterTrekPageData(slug: string) {
  const supabase = await createClient();
  
  const { data: masterTrek, error: mtError } = await supabase
    .from("master_treks")
    .select("*, category:master_trek_categories(name), region:regions(name)")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (mtError || !masterTrek) return null;

  const { data: packages, error: pkError } = await supabase
    .from("treks")
    .select(`
      id, title, slug, short_description, difficulty, duration_days, price_per_person, start_point,
      companies(id, name, logo_url, verification_status),
      departures(id, departure_date, total_seats, booked_seats, base_price, offer_price, status)
    `)
    .eq("master_trek_id", masterTrek.id)
    .eq("status", "active");

  if (pkError || !packages) return { masterTrek, packages: [] };

  const now = new Date();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedPackages = packages.map((pkg: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validDepartures = (pkg.departures || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((d: any) => d.status === "Upcoming" && new Date(d.departure_date) >= now)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());
    
    return {
      ...pkg,
      departures: validDepartures
    };
  });

  return { masterTrek, packages: mappedPackages };
}
