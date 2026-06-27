import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Booking, BookingStatus } from "@/lib/types";

// The only statuses a company may set. Mirrors the DB CHECK constraint.
const ALLOWED_BOOKING_STATUSES: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Rejected",
  "Cancelled",
  "Completed",
];

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

  // Accept only a valid target status — never an arbitrary payload.
  if (!ALLOWED_BOOKING_STATUSES.includes(status as BookingStatus)) {
    throw new Error("Invalid booking status.");
  }

  const supabase = await createClient();

  // Update ONLY the status column, scoped to a booking owned by this company.
  // Protected snapshot columns are additionally guarded at the database layer
  // by the enforce_booking_immutability trigger.
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .eq("company_id", companyId);

  if (error) throw new Error(error.message);
  return true;
}
