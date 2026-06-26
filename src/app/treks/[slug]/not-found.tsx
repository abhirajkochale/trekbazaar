import Link from "next/link";

export default function TrekNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-5xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Trek not found</h1>
      <p className="mt-2 max-w-md text-zinc-600">
        We couldn&apos;t find the trek you were looking for. It may have been
        removed, or the link might be incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Browse all treks
      </Link>
    </main>
  );
}
