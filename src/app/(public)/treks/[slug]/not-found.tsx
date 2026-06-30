import Link from "next/link";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TrekNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 text-zinc-400">
        <Map className="w-4 h-4" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900">Trek not found</h1>
      <p className="mt-2 max-w-md text-zinc-600">
        We couldn&apos;t find the trek you were looking for. It may have been
        removed, or the link might be incorrect.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary">
          Browse all treks
        </Button>
      </Link>
    </main>
  );
}
