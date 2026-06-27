"use server";

import { revalidatePath } from 'next/cache';
import { saveCompany, deleteCompany, toggleCompanyFeatured } from '@/lib/admin/companies';
import type { Company } from '@/lib/types';

export async function saveCompanyAction(payload: Partial<Company>) {
  try {
    const company = await saveCompany(payload);
    revalidatePath('/admin/companies');
    revalidatePath(`/admin/companies/${company.id}/edit`);
    return { success: true, companyId: company.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save company";
    return { success: false, error: msg };
  }
}

export async function deleteCompanyAction(id: string) {
  try {
    await deleteCompany(id);
    revalidatePath('/admin/companies');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete company";
    return { success: false, error: msg };
  }
}

export async function toggleCompanyFeaturedAction(id: string, currentFeatured: boolean) {
  try {
    await toggleCompanyFeatured(id, currentFeatured);
    revalidatePath('/admin/companies');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to toggle featured status";
    return { success: false, error: msg };
  }
}
