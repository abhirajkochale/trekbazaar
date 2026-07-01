"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateBookingInput {
  departureId: string;
  travellersCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export async function createBookingAction(input: CreateBookingInput) {
  try {
    const supabase = await createClient();
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    let customerId = null;

    if (user) {
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        customerId = user.id;
      }
    }
    // 1. Basic validation
    if (!input.departureId || !input.customerName || !input.customerEmail || !input.customerPhone) {
      return { success: false, error: "Please fill in all required fields." };
    }
    
    if (input.travellersCount < 1) {
      return { success: false, error: "Number of travellers must be at least 1." };
    }

    // 3. Call the Postgres RPC function
    const { data, error } = await supabase.rpc('create_booking', {
      p_departure_id: input.departureId,
      p_travellers: input.travellersCount,
      p_name: input.customerName.trim(),
      p_email: input.customerEmail.trim(),
      p_phone: input.customerPhone.trim(),
      p_notes: input.notes?.trim() || null,
      p_customer_id: customerId
    });

    if (error) {
      console.error("Booking RPC error:", error);
      let userError = "Something went wrong while securing your booking. Please try again.";
      if (error.message.includes('Departure not found')) userError = "The selected departure was not found.";
      if (error.message.includes('Departure is')) userError = "This departure is no longer available.";
      if (error.message.includes('Not enough seats available')) {
        // Extract the exact message if possible, else fallback
        userError = error.message; 
      }
      
      return { success: false, error: userError };
    }

    return { success: true, booking: data };
  } catch (err: unknown) {
    console.error("Server action error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
