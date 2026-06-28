import { logoutCompany } from "@/app/actions/company-auth";

/**
 * Clean, non-technical screen shown when an authenticated user is not cleanly
 * linked to exactly one company. Covers both the "no company yet" case and the
 * impossible "linked to multiple companies" drift case.
 */
export function CompanyNotLinked({
  variant,
}: {
  variant: "no-company" | "multiple-companies";
}) {
  const isDuplicate = variant === "multiple-companies";

  const title = isDuplicate
    ? "Invalid company configuration"
    : "No company linked";

  const message = isDuplicate
    ? "Your account is linked to more than one company, which isn't allowed. Please contact TrekBazaar Admin to resolve this."
    : "Your account is not linked to a company yet. Please contact TrekBazaar Admin.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center">
        <h1 className="text-xl font-bold text-zinc-900 mb-2">{title}</h1>
        <p className="text-zinc-500 mb-6">{message}</p>
        <form action={logoutCompany}>
          <button
            type="submit"
            className="text-sm font-medium text-tb-primary hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
