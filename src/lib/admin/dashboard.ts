import { createAdminClient } from "@/lib/supabase/admin";
import type { Trek, Enquiry } from "@/lib/types";
import { cache } from "react";

export interface DashboardStats {
  totalTreks: number;
  activeRegions: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  avgTrekPrice: number;
  avgTrekDuration: number;
}

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const supabase = createAdminClient();

  // We run queries in parallel
  const [
    { count: totalTreks, data: treksData },
    { count: activeRegions },
    { count: totalEnquiries },
    { count: pendingEnquiries }
  ] = await Promise.all([
    supabase.from("treks").select("price_per_person, duration_days", { count: "exact" }),
    supabase.from("regions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  let avgPrice = 0;
  let avgDuration = 0;

  if (treksData && treksData.length > 0) {
    avgPrice = treksData.reduce((acc, t) => acc + (t.price_per_person || 0), 0) / treksData.length;
    avgDuration = treksData.reduce((acc, t) => acc + (t.duration_days || 0), 0) / treksData.length;
  }

  return {
    totalTreks: totalTreks || 0,
    activeRegions: activeRegions || 0,
    totalEnquiries: totalEnquiries || 0,
    pendingEnquiries: pendingEnquiries || 0,
    avgTrekPrice: Math.round(avgPrice),
    avgTrekDuration: Math.round(avgDuration),
  };
});

export const getRecentTreks = cache(async (limit = 5): Promise<Trek[]> => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("treks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Trek[]) || [];
});

export const getRecentEnquiries = cache(async (limit = 10): Promise<Enquiry[]> => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*, treks(title)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Enquiry[]) || [];
});

export const getTreksByRegion = cache(async () => {
  const supabase = createAdminClient();
  const { data } = await supabase.from("treks").select("region");
  
  if (!data) return [];
  
  const regionCounts: Record<string, number> = {};
  data.forEach((t) => {
    regionCounts[t.region] = (regionCounts[t.region] || 0) + 1;
  });

  return Object.entries(regionCounts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
});

export const getDifficultyDistribution = cache(async () => {
  const supabase = createAdminClient();
  const { data } = await supabase.from("treks").select("difficulty");
  
  if (!data) return [];

  const counts: Record<string, number> = { easy: 0, moderate: 0, difficult: 0, extreme: 0 };
  data.forEach((t) => {
    if (counts[t.difficulty] !== undefined) {
      counts[t.difficulty]++;
    }
  });

  return [
    { name: "Easy", value: counts.easy, color: "#22c55e" },       // green-500
    { name: "Moderate", value: counts.moderate, color: "#3b82f6" }, // blue-500
    { name: "Difficult", value: counts.difficult, color: "#f97316" }, // orange-500
    { name: "Extreme", value: counts.extreme, color: "#dc2626" },   // red-600
  ].filter(d => d.value > 0);
});

export const getEnquiryTrend = cache(async () => {
  const supabase = createAdminClient();
  
  // Get last 6 months of enquiries
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Start of that month
  
  const { data } = await supabase
    .from("enquiries")
    .select("created_at")
    .gte("created_at", sixMonthsAgo.toISOString());
    
  if (!data) return [];

  // Group by month
  const monthlyCounts: Record<string, number> = {};
  
  // Pre-fill last 6 months so empty months show 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthlyCounts[monthName] = 0;
  }

  data.forEach(enquiry => {
    const date = new Date(enquiry.created_at);
    const monthName = date.toLocaleString('default', { month: 'short' });
    if (monthlyCounts[monthName] !== undefined) {
      monthlyCounts[monthName]++;
    }
  });

  return Object.entries(monthlyCounts).map(([month, count]) => ({
    month,
    enquiries: count
  }));
});
