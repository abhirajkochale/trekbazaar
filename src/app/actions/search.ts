"use server";

import { getSearchSuggestions } from "@/lib/search/master-api";

export async function fetchSearchSuggestions(query: string) {
  return await getSearchSuggestions(query);
}
