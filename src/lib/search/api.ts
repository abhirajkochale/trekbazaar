import { createClient } from "@/lib/supabase/server";
import type { Trek } from "@/lib/types";

export interface SearchFilters {
  q?: string;
  region?: string;
  difficulty?: string;
  duration?: number;
  season?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "price_low" | "price_high" | "duration" | "newest";
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  treks: Trek[];
  totalCount: number;
  page: number;
  hasMore: boolean;
}

/**
 * Searches and filters treks securely via Supabase.
 * Optimized to fetch only the columns required by TrekCard.
 */
export async function searchTreks(filters: SearchFilters = {}): Promise<SearchResponse> {
  const supabase = await createClient();

  // Safely parse and set defaults for pagination
  const limit = Math.max(1, Math.min(filters.limit || 12, 50)); // cap at 50 to prevent abuse
  const page = Math.max(1, filters.page || 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Specify only the columns needed by the TrekCard component
  const TREKCARD_COLUMNS = 
    "id, title, slug, region, difficulty, duration_days, price_per_person, operator_name, cover_image_url, status";

  // Build the query
  // We use `count: 'exact'` to get the total number of matching records
  let query = supabase
    .from("treks")
    .select(TREKCARD_COLUMNS, { count: 'exact' })
    .eq("status", "active");

  // 1. Text Search (title)
  if (filters.q && filters.q.trim() !== "") {
    query = query.ilike("title", `%${filters.q.trim()}%`);
  }

  // 2. Region Filter (supports comma-separated)
  if (filters.region && filters.region.trim() !== "") {
    const regions = filters.region.split(',').map(r => r.trim());
    if (regions.length > 1) {
      query = query.in("region", regions);
    } else {
      query = query.eq("region", regions[0]);
    }
  }

  // 3. Difficulty Filter (supports comma-separated)
  if (filters.difficulty && filters.difficulty.trim() !== "") {
    const difficulties = filters.difficulty.split(',').map(d => d.trim());
    if (difficulties.length > 1) {
      query = query.in("difficulty", difficulties);
    } else {
      query = query.eq("difficulty", difficulties[0]);
    }
  }

  // 4. Duration Filter (treat as Max Duration)
  if (filters.duration && filters.duration > 0) {
    query = query.lte("duration_days", filters.duration);
  }

  // 5. Season Filter
  // Note: The database blueprint specifies `best_seasons` as text[],
  // but we can query if a specific season is inside it using the `contains` or `cs` operator.
  // Actually, we are only fetching TrekCard columns, but we can still filter on unselected columns in Supabase.
  if (filters.season && filters.season.trim() !== "") {
    query = query.contains("best_seasons", [filters.season.trim()]);
  }

  // 6. Price Filters
  if (filters.minPrice !== undefined && filters.minPrice >= 0) {
    query = query.gte("price_per_person", filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    query = query.lte("price_per_person", filters.maxPrice);
  }

  // 7. Sorting
  switch (filters.sort) {
    case "price_low":
      query = query.order("price_per_person", { ascending: true });
      break;
    case "price_high":
      query = query.order("price_per_person", { ascending: false });
      break;
    case "duration":
      query = query.order("duration_days", { ascending: true });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "popular":
    default:
      // Assuming 'popular' might eventually sort by reviews or bookings.
      // For now, default to newest or a fallback sort.
      query = query.order("created_at", { ascending: false });
      break;
  }

  // 8. Pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Supabase searchTreks error:", error.message);
    return {
      treks: [],
      totalCount: 0,
      page,
      hasMore: false,
    };
  }

  const totalCount = count || 0;
  const hasMore = from + (data?.length || 0) < totalCount;

  return {
    treks: (data as Trek[]) || [],
    totalCount,
    page,
    hasMore,
  };
}
