import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Booking } from "@/lib/types";

export async function getCompanyBookings(): Promise<Booking[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("bookings")
    .select("*, treks(title)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []) as Booking[];
}

export async function updateCompanyBookingStatus(id: string, status: string): Promise<boolean> {
  const companyId = await getCompanyId();
  if (!companyId) throw new Error("Unauthorized");

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .eq("company_id", companyId);

  if (error) throw new Error(error.message);
  return true;
}
