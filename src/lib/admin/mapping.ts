import { createAdminClient } from "@/lib/supabase/admin";

export interface MappingStats {
  totalMasterTreks: number;
  totalCompanyPackages: number;
  mappedPackages: number;
  unmappedPackages: number;
  completionPercentage: number;
}

export async function getMappingStats(): Promise<MappingStats> {
  const supabase = createAdminClient();

  const [
    { count: totalMasterTreks },
    { count: totalCompanyPackages },
    { count: unmappedPackages },
  ] = await Promise.all([
    supabase.from("master_treks").select("*", { count: "exact", head: true }),
    supabase.from("treks").select("*", { count: "exact", head: true }),
    supabase.from("treks").select("*", { count: "exact", head: true }).is("master_trek_id", null),
  ]);

  const mapped = (totalCompanyPackages || 0) - (unmappedPackages || 0);
  const completion = totalCompanyPackages ? Math.round((mapped / totalCompanyPackages) * 100) : 0;

  return {
    totalMasterTreks: totalMasterTreks || 0,
    totalCompanyPackages: totalCompanyPackages || 0,
    mappedPackages: mapped,
    unmappedPackages: unmappedPackages || 0,
    completionPercentage: completion,
  };
}

export async function getUnmappedTreks() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("treks")
    .select("id, title, slug, region, status, companies(name)")
    .is("master_trek_id", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getActiveMasterTreksForMapping() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("master_treks")
    .select("id, name, category:master_trek_categories(name), region:regions(name)")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
