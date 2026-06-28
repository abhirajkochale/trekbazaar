import { createClient } from "@/lib/supabase/server";
import { searchMasterTreks } from "@/lib/search/master-api";

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
      id, title, slug, short_description, difficulty, duration_days, price_per_person, start_point, included, excluded, itinerary,
      companies(id, name, logo_url, verification_status, years_of_experience, featured, description),
      departures(id, departure_date, total_seats, booked_seats, base_price, offer_price, status)
    `)
    .eq("master_trek_id", masterTrek.id)
    .eq("status", "active");

  if (pkError || !packages) return { 
    masterTrek, 
    packages: [], 
    allDepartures: [], 
    allInclusions: [], 
    allExclusions: [], 
    similarTreks: [] 
  };

  const now = new Date();
  
  // Aggregate all departures from all packages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allDepartures: any[] = [];
  const allInclusions = new Set<string>();
  const allExclusions = new Set<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedPackages = packages.map((pkg: any) => {
    const validDepartures = (pkg.departures || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((d: any) => d.status === "Upcoming" && new Date(d.departure_date) >= now)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());
    
    // Inject company context into departures for the global calendar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validDepartures.forEach((d: any) => {
      allDepartures.push({
        ...d,
        package_id: pkg.id,
        company: pkg.companies,
        duration_days: pkg.duration_days,
        title: pkg.title
      });
    });

    (pkg.included || []).forEach((inc: string) => allInclusions.add(inc.trim()));
    (pkg.excluded || []).forEach((exc: string) => allExclusions.add(exc.trim()));

    return {
      ...pkg,
      departures: validDepartures
    };
  });

  allDepartures.sort((a: { departure_date: string }, b: { departure_date: string }) => 
    new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
  );

  // Fetch Similar Treks
  // Prioritize region match, then category
  const similarResponse = await searchMasterTreks({ 
    region: masterTrek.region?.name, 
    limit: 5 
  });
  
  const similarTreks = similarResponse.masterTreks.filter(t => t.id !== masterTrek.id).slice(0, 4);

  return { 
    masterTrek, 
    packages: mappedPackages, 
    allDepartures, 
    allInclusions: Array.from(allInclusions),
    allExclusions: Array.from(allExclusions),
    similarTreks 
  };
}
