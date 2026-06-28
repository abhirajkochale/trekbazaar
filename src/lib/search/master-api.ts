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

// NLP Parsing logic
export function parseNaturalLanguageQuery(query: string, filters: MasterSearchFilters = {}): { parsedQuery: string, extractedFilters: MasterSearchFilters } {
  let text = (query || "").toLowerCase().trim();
  const extractedFilters = { ...filters };

  // 1. Budget extraction (e.g. "under 10000", "below 5000", "< 15000")
  const budgetRegex = /(under|below|max|<)\s*([0-9,]+)/i;
  const budgetMatch = text.match(budgetRegex);
  if (budgetMatch) {
    extractedFilters.maxPrice = parseInt(budgetMatch[2].replace(/,/g, ''), 10);
    text = text.replace(budgetRegex, '').trim();
  }

  // 2. Duration extraction (e.g. "5 days", "7 day")
  const durationRegex = /([0-9]+)\s*(day|days)/i;
  const durationMatch = text.match(durationRegex);
  if (durationMatch) {
    extractedFilters.duration = parseInt(durationMatch[1], 10);
    text = text.replace(durationRegex, '').trim();
  }
  
  if (text.includes("weekend")) {
    extractedFilters.duration = 4;
    text = text.replace(/weekend/i, '').trim();
  }

  // 3. Difficulty extraction
  if (/\b(easy|beginner)\b/.test(text)) {
    extractedFilters.difficulty = "Easy";
    text = text.replace(/\b(easy|beginner)\b/gi, '').trim();
  } else if (/\b(moderate|intermediate)\b/.test(text)) {
    extractedFilters.difficulty = "Moderate";
    text = text.replace(/\b(moderate|intermediate)\b/gi, '').trim();
  } else if (/\b(difficult|hard|advanced)\b/.test(text)) {
    extractedFilters.difficulty = "Difficult";
    text = text.replace(/\b(difficult|hard|advanced)\b/gi, '').trim();
  } else if (/\b(extreme|expert)\b/.test(text)) {
    extractedFilters.difficulty = "Extreme";
    text = text.replace(/\b(extreme|expert)\b/gi, '').trim();
  }

  // 4. Season extraction
  if (/\b(winter|snow|december|january|february)\b/.test(text)) {
    extractedFilters.season = "Winter";
    text = text.replace(/\b(winter|snow)\b/gi, '').trim();
  } else if (/\b(summer|may|june)\b/.test(text)) {
    extractedFilters.season = "Summer";
    text = text.replace(/\b(summer)\b/gi, '').trim();
  } else if (/\b(monsoon|july|august)\b/.test(text)) {
    extractedFilters.season = "Monsoon";
    text = text.replace(/\b(monsoon)\b/gi, '').trim();
  } else if (/\b(autumn|october|november)\b/.test(text)) {
    extractedFilters.season = "Autumn";
    text = text.replace(/\b(autumn)\b/gi, '').trim();
  } else if (/\b(spring|march|april)\b/.test(text)) {
    extractedFilters.season = "Spring";
    text = text.replace(/\b(spring)\b/gi, '').trim();
  }

  // Sanitize the remaining query (remove excessive spaces, generic words like "trek", "treks", "in")
  text = text.replace(/\b(trek|treks|in)\b/gi, '').replace(/\s+/g, ' ').trim();

  return { parsedQuery: text, extractedFilters };
}

export async function searchMasterTreks(filters: MasterSearchFilters = {}): Promise<MasterSearchResponse> {
  const supabase = await createClient();

  const limit = Math.max(1, Math.min(filters.limit || 12, 50));
  const page = Math.max(1, filters.page || 1);
  const from = (page - 1) * limit;

  // NLP extraction if a text query exists
  const { parsedQuery, extractedFilters } = parseNaturalLanguageQuery(filters.q || "", filters);

  // If using the RPC function, we execute fuzzy search on DB
  let query = supabase.from('v_search_master_treks').select('*', { count: 'exact' });

  // Use the RPC for fuzzy search and ranking if a query exists
  if (parsedQuery.length > 0) {
    const { data: rpcData, error: rpcError } = await supabase.rpc('rpc_search_master_treks_weighted', {
      search_query: parsedQuery,
      match_threshold: 0.1
    });

    if (!rpcError && rpcData) {
      const matchedIds = rpcData.map((d: { id: string }) => d.id);
      if (matchedIds.length === 0) {
        return { masterTreks: [], totalCount: 0, page, hasMore: false };
      }
      query = query.in('id', matchedIds);
      
      // When fuzzy searching, the user usually wants relevance ordering, but we can override it via standard sort later
      if (!filters.sort) {
        // Unfortunately postgrest `.in()` doesn't preserve order. 
        // For MVP, we will sort via JS after fetch, or let the standard sort take over.
      }
    }
  }

  // Exact Match Filters
  if (extractedFilters.region && extractedFilters.region.trim() !== "") {
    const regions = extractedFilters.region.split(',').map(r => r.trim());
    query = query.in('region_name', regions);
  }

  if (extractedFilters.category && extractedFilters.category.trim() !== "") {
    const categories = extractedFilters.category.split(',').map(c => c.trim());
    query = query.in('category_name', categories);
  }

  if (extractedFilters.difficulty && extractedFilters.difficulty.trim() !== "") {
    const difficulties = extractedFilters.difficulty.split(',').map(d => d.trim());
    // Use ILIKE or IN
    const formatted = difficulties.map(d => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase());
    query = query.in('difficulty', formatted);
  }

  if (extractedFilters.season && extractedFilters.season.trim() !== "") {
    query = query.ilike('best_season', `%${extractedFilters.season.trim()}%`);
  }

  if (extractedFilters.duration && extractedFilters.duration > 0) {
    query = query.lte('duration_min', extractedFilters.duration);
  }

  if (extractedFilters.minPrice !== undefined && extractedFilters.minPrice >= 0) {
    query = query.gte('lowest_price', extractedFilters.minPrice);
  }

  if (extractedFilters.maxPrice !== undefined && extractedFilters.maxPrice > 0) {
    query = query.lte('lowest_price', extractedFilters.maxPrice).gt('lowest_price', 0);
  }

  // Sorting
  switch (extractedFilters.sort) {
    case "lowest-price":
      query = query.order('lowest_price', { ascending: true });
      break;
    case "highest-price":
      query = query.order('lowest_price', { ascending: false });
      break;
    case "most-companies":
      query = query.order('companies_count', { ascending: false });
      break;
    case "most-departures":
      query = query.order('upcoming_departures_count', { ascending: false });
      break;
    case "alphabetical":
      query = query.order('name', { ascending: true });
      break;
    case "featured-first":
    case "newest":
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    console.error("Supabase searchMasterTreks error:", error?.message);
    return { masterTreks: [], totalCount: 0, page, hasMore: false };
  }

  const totalCount = count || data.length;
  const hasMore = from + data.length < totalCount;

  // Map the results
  const mappedData = data.map((d: Record<string, unknown>) => ({
    ...d,
    region: { name: d.region_name },
    category: { name: d.category_name },
    aggregated: {
      lowestPrice: d.lowest_price,
      companiesCount: d.companies_count,
      upcomingDeparturesCount: d.upcoming_departures_count
    }
  }));

  // Asynchronous Search Logging (fire and forget)
  if (filters.q && filters.q.trim() !== "") {
    supabase.from('search_logs').insert({
      query: filters.q.trim(),
      results_count: totalCount
    }).then(({ error }) => {
      if (error) console.error("Search logging failed:", error.message);
    });
  }

  return {
    masterTreks: mappedData,
    totalCount,
    page,
    hasMore,
  };
}

export async function getSearchSuggestions(query: string) {
  const supabase = await createClient();
  const q = query.trim();
  
  if (!q) return { destinations: [], regions: [], categories: [] };

  // Fetch top 3 fuzzy matched destinations
  const { data: destinations } = await supabase
    .from('v_search_master_treks')
    .select('slug, name, region_name')
    .ilike('name', `%${q}%`)
    .limit(3);

  // Fetch top 2 regions
  const { data: regions } = await supabase
    .from('regions')
    .select('slug, name')
    .ilike('name', `%${q}%`)
    .limit(2);

  return {
    destinations: destinations || [],
    regions: regions || [],
    categories: []
  };
}
