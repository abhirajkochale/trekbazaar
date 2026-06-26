import { redirect } from "next/navigation";

// Search and filtering live on the homepage for the MVP. Keep this route
// as a redirect so any old /search links still work.
export default function SearchPage() {
  redirect("/");
}
