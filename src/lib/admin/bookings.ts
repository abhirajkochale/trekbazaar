import { createAdminClient } from '../supabase/admin';
import type { Booking } from '../types';

export async function getBookings(): Promise<Booking[]> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      departures (*),
      treks (title),
      companies (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return data as unknown as Booking[];
}

export async function getBookingStats() {
  const supabase = createAdminClient();
  
  const [totalRes, pendingRes, confirmedRes, revenueRes] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Confirmed'),
    supabase.from('bookings').select('total_amount').eq('status', 'Confirmed')
  ]);

  let totalRevenue = 0;
  if (revenueRes.data) {
    totalRevenue = revenueRes.data.reduce((sum, item) => sum + Number(item.total_amount), 0);
  }

  return {
    totalBookings: totalRes.count || 0,
    pendingBookings: pendingRes.count || 0,
    confirmedBookings: confirmedRes.count || 0,
    totalRevenue
  };
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating booking status:", error);
    throw new Error(error.message);
  }
}
