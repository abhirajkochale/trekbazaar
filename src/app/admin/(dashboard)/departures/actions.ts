"use server";

import { revalidatePath } from 'next/cache';
import { saveDeparture, deleteDeparture } from '@/lib/admin/departures';
import type { Departure } from '@/lib/types';

export async function saveDepartureAction(payload: Partial<Departure>) {
  try {
    const departure = await saveDeparture(payload);
    revalidatePath('/admin/departures');
    revalidatePath(`/admin/departures/${departure.id}/edit`);
    return { success: true, departureId: departure.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save departure";
    return { success: false, error: msg };
  }
}

export async function deleteDepartureAction(id: string) {
  try {
    await deleteDeparture(id);
    revalidatePath('/admin/departures');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete departure";
    return { success: false, error: msg };
  }
}
