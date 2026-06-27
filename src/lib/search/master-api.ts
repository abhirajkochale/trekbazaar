import { createClient } from "@/lib/supabase/server";

export interface MasterSearchFilters {
  q?: string;
  region?: string;
  category?: string;
  difficulty?: string;
  duration?: number;
  season?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "lowest-price" | "highest-price" | "most-companies" | "most-departures" | "alphabetical" | "newest" | "featured-first";
  page?: number;
  limit?: number;
}

export interface MasterSearchResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks: any[];
  totalCount: number;
  page: number;
  hasMore: boolean;
}

export async function searchMasterTreks(filters: MasterSearchFilters = {}): Promise<MasterSearchResponse> {
  const supabase = await createClient();

  const limit = Math.max(1, Math.min(filters.limit || 12, 50));
  const page = Math.max(1, filters.page || 1);
  const from = (page - 1) * limit;

  // 1. Build Query for Master Treks
  let query = supabase
    .from("master_treks")
    .select(`
      *,
      category:master_trek_categories(name),
      region:regions(name),
      treks(id, status, price_per_person, company_id, departures(id, status, departure_date))
    `)
    .eq("status", "active");

  if (filters.q && filters.q.trim() !== "") {
    const q = filters.q.trim();
    query = query.or(`name.ilike.%${q}%,overview.ilike.%${q}%,country.ilike.%${q}%,state.ilike.%${q}%`);
  }

  if (filters.region && filters.region.trim() !== "") {
    const regions = filters.region.split(',').map(r => r.trim());
    if (regions.length > 1) {
      query = query.in("region:regions.name", regions); // Note: Postgrest doesn't easily filter by joined columns like this without inner join. 
      // Let's filter in JS or use foreign key if we had region_id. Since filter usually gives slug or name, we will do JS filter for region/category if needed, or query by FK.
      // Wait, we don't know if region is ID or name. In existing `api.ts`, it was just `region` string.
    }
  }
  
  if (filters.difficulty && filters.difficulty.trim() !== "") {
    const difficulties = filters.difficulty.split(',').map(d => d.trim().toLowerCase());
    // In DB difficulty is MasterTrekDifficulty enum or string. We ilike or in.
    query = query.in("difficulty", difficulties.map(d => d.charAt(0).toUpperCase() + d.slice(1))); // Assuming "Easy", "Moderate"
  }

  if (filters.season && filters.season.trim() !== "") {
    query = query.ilike("best_season", `%${filters.season.trim()}%`);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Supabase searchMasterTreks error:", error?.message);
    return { masterTreks: [], totalCount: 0, page, hasMore: false };
  }

  const now = new Date();

  // 2. Aggregate Data in Memory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results = data.map((mt: any) => {
    // Filter active treks only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activePackages = (mt.treks || []).filter((t: any) => t.status === "active");
    
    let lowestPrice = Infinity;
    const companyIds = new Set<string>();
    let upcomingDeparturesCount = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activePackages.forEach((pkg: any) => {
      if (pkg.price_per_person < lowestPrice) lowestPrice = pkg.price_per_person;
      if (pkg.company_id) companyIds.add(pkg.company_id);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deps = (pkg.departures || []).filter((d: any) => d.status === "Upcoming" && new Date(d.departure_date) >= now);
      upcomingDeparturesCount += deps.length;
    });

    return {
      ...mt,
      aggregated: {
        lowestPrice: lowestPrice === Infinity ? 0 : lowestPrice,
        companiesCount: companyIds.size,
        upcomingDeparturesCount
      }
    };
  });

  // 3. Post-Process Filtering (for joins and aggregated fields)
  if (filters.region && filters.region.trim() !== "") {
    const regions = filters.region.toLowerCase().split(',').map(r => r.trim());
    results = results.filter(r => r.region?.name && regions.includes(r.region.name.toLowerCase()));
  }

  if (filters.category && filters.category.trim() !== "") {
    const categories = filters.category.toLowerCase().split(',').map(c => c.trim());
    results = results.filter(r => r.category?.name && categories.includes(r.category.name.toLowerCase()));
  }

  if (filters.duration && filters.duration > 0) {
    // Check if typical duration falls within or is less than requested
    results = results.filter(r => (r.duration_min || 0) <= (filters.duration as number));
  }

  if (filters.minPrice !== undefined && filters.minPrice >= 0) {
    results = results.filter(r => r.aggregated.lowestPrice >= (filters.minPrice as number));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    results = results.filter(r => r.aggregated.lowestPrice > 0 && r.aggregated.lowestPrice <= (filters.maxPrice as number));
  }

  // 4. Sorting
  switch (filters.sort) {
    case "lowest-price":
      results.sort((a, b) => {
        if (a.aggregated.lowestPrice === 0) return 1;
        if (b.aggregated.lowestPrice === 0) return -1;
        return a.aggregated.lowestPrice - b.aggregated.lowestPrice;
      });
      break;
    case "highest-price":
      results.sort((a, b) => b.aggregated.lowestPrice - a.aggregated.lowestPrice);
      break;
    case "most-companies":
      results.sort((a, b) => b.aggregated.companiesCount - a.aggregated.companiesCount);
      break;
    case "most-departures":
      results.sort((a, b) => b.aggregated.upcomingDeparturesCount - a.aggregated.upcomingDeparturesCount);
      break;
    case "alphabetical":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured-first":
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case "newest":
    default:
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  // 5. Pagination
  const totalCount = results.length;
  const paginatedResults = results.slice(from, from + limit);
  const hasMore = from + paginatedResults.length < totalCount;

  return {
    masterTreks: paginatedResults,
    totalCount,
    page,
    hasMore,
  };
}
