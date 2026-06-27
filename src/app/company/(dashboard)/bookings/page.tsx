import React from "react";
import { getCompanyBookings } from "@/lib/company/bookings";
import { BookingsClientWrapper } from "./BookingsClientWrapper";

export default async function CompanyBookingsPage() {
  const bookings = await getCompanyBookings();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Bookings</h1>
          <p className="text-zinc-500 mt-1">Manage and track your trek reservations.</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm">
        <BookingsClientWrapper initialBookings={bookings} />
      </div>
    </div>
  );
}
