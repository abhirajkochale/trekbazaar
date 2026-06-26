import Link from "next/link";
import { logout } from "./actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-100">
      <header className="border-b border-zinc-300 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-6 px-4 py-3">
          <Link href="/admin" className="font-semibold text-zinc-900">
            TrekBazaar Admin
          </Link>
          <nav className="flex gap-4 text-sm text-zinc-600">
            <Link href="/admin" className="hover:text-zinc-900">
              Treks
            </Link>
            <Link href="/admin/enquiries" className="hover:text-zinc-900">
              Enquiries
            </Link>
          </nav>
          <Link
            href="/"
            className="ml-auto text-sm text-zinc-500 hover:text-zinc-900"
          >
            View site ↗
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
