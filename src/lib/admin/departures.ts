import { createAdminClient } from '@/lib/supabase/admin';
import type { Departure } from '../types';

export async function getDepartures(
  trekFilter?: string,
  companyFilter?: string,
  statusFilter?: string,
  sortBy: string = 'date_asc'
): Promise<Departure[]> {
  const supabase = createAdminClient();
  
  let query = supabase
    .from("departures")
    .select(`
      *,
      treks:trek_id (
        title,
        company_id,
        companies:company_id (name)
      )
    `);

  if (trekFilter && trekFilter !== 'all') {
    query = query.eq('trek_id', trekFilter);
  }
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  // Sorting
  switch (sortBy) {
    case 'date_asc':
      query = query.order('departure_date', { ascending: true });
      break;
    case 'date_desc':
      query = query.order('departure_date', { ascending: false });
      break;
    case 'price_asc':
      query = query.order('base_price', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  // Client-side filter for company if necessary (since we joined twice, filtering in PostgREST is complex)
  let results = data as Departure[];
  if (companyFilter && companyFilter !== 'all') {
    results = results.filter(d => d.treks?.company_id === companyFilter);
  }
  
  return results;
}

export async function getDeparture(id: string): Promise<Departure> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("departures")
    .select(`
      *,
      treks:trek_id (
        title,
        company_id,
        companies:company_id (name)
      )
    `)
    .eq("id", id)
    .single();
    
  if (error) throw new Error(error.message);
  return data as Departure;
}

export async function getDepartureStats() {
  const supabase = createAdminClient();
  
  const [
    { count: total },
    { count: upcoming },
    { data: allDepartures }
  ] = await Promise.all([
    supabase.from("departures").select("*", { count: "exact", head: true }),
    supabase.from("departures").select("*", { count: "exact", head: true }).eq("status", "Upcoming"),
    supabase.from("departures").select("total_seats, booked_seats").eq("status", "Upcoming")
  ]);

  let totalSeats = 0;
  let bookedSeats = 0;
  if (allDepartures) {
    for (const d of allDepartures) {
      totalSeats += d.total_seats || 0;
      bookedSeats += d.booked_seats || 0;
    }
  }

  const occupancy = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
  const availableSeats = totalSeats - bookedSeats;

  return {
    total: total || 0,
    upcoming: upcoming || 0,
    availableSeats,
    occupancy
  };
}

export async function saveDeparture(payload: Partial<Departure>): Promise<Departure> {
  const supabase = createAdminClient();
  const id = payload.id;
  
  const updatePayload = { ...payload };
  delete updatePayload.id;
  delete updatePayload.created_at;
  delete updatePayload.updated_at;
  delete updatePayload.treks; // Never try to save joined relations
  
  if (!id) {
    const { data, error } = await supabase
      .from("departures")
      .insert([updatePayload])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Departure;
  }

  const { data, error } = await supabase
    .from("departures")
    .update({ ...updatePayload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Departure;
}

export async function deleteDeparture(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("departures").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
