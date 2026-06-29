import { createClient } from '@/lib/supabase/server';
import type { Company, Trek, Departure } from '@/lib/types';

export interface PublicCompanyMetrics {
  activeTreksCount: number;
  upcomingDeparturesCount: number;
  lowestPrice: number | null;
  badges: string[];
}

export interface PublicCompany extends Company {
  metrics: PublicCompanyMetrics;
}

export interface CompanySearchFilters {
  q?: string;
  state?: string;
  region?: string;
  activity?: string;
  verifiedOnly?: boolean;
  sortBy?: string;
}

export async function getPublicCompanies(filters: CompanySearchFilters = {}): Promise<PublicCompany[]> {
  const supabase = await createClient();
  
  // We fetch companies along with their treks and departures to aggregate metrics dynamically.
  let query = supabase
    .from('companies')
    .select(`
      *,
      treks (
        id, status, price_per_person, region, difficulty,
        departures (
          id, status, departure_date, base_price, offer_price
        )
      )
    `)
    .eq('status', 'active');
    
  if (filters.verifiedOnly !== false) {
    query = query.eq('approval_status', 'approved');
  }
  
  const { data, error } = await query;
  
  if (error || !data) {
    console.error("Error fetching public companies:", error);
    return [];
  }
  
  let companies = data.map((company: any) => {
    let activeTreksCount = 0;
    let upcomingDeparturesCount = 0;
    let lowestPrice: number | null = null;
    
    // Regions the company operates in
    const companyRegions = new Set<string>();
    const companyActivities = new Set<string>();
    
    if (company.treks && Array.isArray(company.treks)) {
      company.treks.forEach((trek: any) => {
        if (trek.status === 'active') {
          activeTreksCount++;
          if (trek.region) companyRegions.add(trek.region.toLowerCase());
          if (trek.difficulty) companyActivities.add(trek.difficulty.toLowerCase());
          
          if (trek.price_per_person) {
            lowestPrice = lowestPrice === null ? trek.price_per_person : Math.min(lowestPrice, trek.price_per_person);
          }
          
          if (trek.departures && Array.isArray(trek.departures)) {
            trek.departures.forEach((dep: any) => {
              // Ensure departure is in the future
              if (dep.status === 'Upcoming' && new Date(dep.departure_date) > new Date()) {
                upcomingDeparturesCount++;
                const actualPrice = dep.offer_price || dep.base_price;
                if (actualPrice) {
                  lowestPrice = lowestPrice === null ? actualPrice : Math.min(lowestPrice, actualPrice);
                }
              }
            });
          }
        }
      });
    }

    const badges: string[] = [];
    if (company.approval_status === "approved") badges.push("Verified");
    
    // "New" badge if created within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (new Date(company.created_at) > thirtyDaysAgo) {
      badges.push("New");
    }
    
    // "Popular" badge if they have significant upcoming activity
    if (upcomingDeparturesCount >= 5) {
      badges.push("Popular");
    }
    
    // "Top Rated" / "Most Booked" logic can be added here based on actual DB stats later
    if (company.featured) {
      badges.push("Featured");
    }

    const publicCompany: PublicCompany = {
      ...company,
      metrics: {
        activeTreksCount,
        upcomingDeparturesCount,
        lowestPrice,
        badges,
      }
    };
    
    // Attach derived sets for filtering
    (publicCompany as any)._regions = companyRegions;
    (publicCompany as any)._activities = companyActivities;
    
    return publicCompany;
  });

  // Client-side filtering for complex relations (like filtering by Region or Activity)
  if (filters.q) {
    const q = filters.q.toLowerCase();
    companies = companies.filter(c => 
      c.name.toLowerCase().includes(q) || 
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.state && c.state.toLowerCase().includes(q))
    );
  }
  
  if (filters.state) {
    const state = filters.state.toLowerCase();
    companies = companies.filter(c => c.state?.toLowerCase() === state);
  }
  
  if (filters.region) {
    const region = filters.region.toLowerCase();
    companies = companies.filter(c => (c as any)._regions.has(region));
  }
  
  if (filters.activity) {
    const activity = filters.activity.toLowerCase();
    companies = companies.filter(c => (c as any)._activities.has(activity));
  }
  
  // Sorting
  if (filters.sortBy === 'price_asc') {
    companies.sort((a, b) => {
      if (a.metrics.lowestPrice === null) return 1;
      if (b.metrics.lowestPrice === null) return -1;
      return a.metrics.lowestPrice - b.metrics.lowestPrice;
    });
  } else if (filters.sortBy === 'active_desc') {
    companies.sort((a, b) => b.metrics.activeTreksCount - a.metrics.activeTreksCount);
  } else if (filters.sortBy === 'departures_desc') {
    companies.sort((a, b) => b.metrics.upcomingDeparturesCount - a.metrics.upcomingDeparturesCount);
  } else {
    // Default: Sort by Featured, then active treks, then Newest
    companies.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      if (b.metrics.upcomingDeparturesCount !== a.metrics.upcomingDeparturesCount) {
        return b.metrics.upcomingDeparturesCount - a.metrics.upcomingDeparturesCount;
      }
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  // Clean up private attributes
  companies = companies.map(c => {
    delete (c as any).treks;
    delete (c as any)._regions;
    delete (c as any)._activities;
    return c;
  });

  return companies;
}
