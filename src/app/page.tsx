import { TrekCard } from "@/components/TrekCard";
import { getActiveTreks } from "@/lib/treks";

export default async function Home() {
  const treks = await getActiveTreks();

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-sky-700 px-6 py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            TrekBazaar — Find Your Next Trek
          </h1>
          <p className="mt-4 text-base text-emerald-50 sm:text-lg">
            Discover handpicked Himalayan treks from trusted operators. Compare
            regions, difficulty and price, then enquire in a tap.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 sm:text-2xl">
          Available Treks
        </h2>

        {treks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
            <p className="text-zinc-600">
              No treks are listed yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
