"use client";

import React, { useTransition } from "react";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { updateAdminBookingStatusAction } from "./actions";
import toast from "react-hot-toast";
import type { Booking } from "@/lib/types";

export function BookingsClientWrapper({ initialBookings }: { initialBookings: Booking[] }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateAdminBookingStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Booking status updated to ${newStatus}`);
      } else {
        toast.error(res.error || "Failed to update booking status");
      }
    });
  };

  return (
    <div className={isPending ? "opacity-70 pointer-events-none transition-opacity" : ""}>
      <BookingsTable 
        bookings={initialBookings} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}
