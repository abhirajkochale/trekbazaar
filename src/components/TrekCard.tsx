import Link from "next/link";
import { CoverImage } from "@/components/CoverImage";
import {
  difficultyBadgeClasses,
  difficultyLabel,
  formatDuration,
  formatPrice,
} from "@/lib/format";
import type { Trek } from "@/lib/types";

export function TrekCard({ trek }: { trek: Trek }) {
  return (
    <Link
      href={`/treks/${trek.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <CoverImage
          src={trek.cover_image_url}
          alt={trek.title}
          className="transition group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-zinc-900">
            {trek.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyBadgeClasses(
              trek.difficulty
            )}`}
          >
            {difficultyLabel(trek.difficulty)}
          </span>
        </div>

        <p className="text-sm text-zinc-500">📍 {trek.region}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-sm text-zinc-600">
            {formatDuration(trek.duration_days)}
          </span>
          <span className="text-right">
            <span className="block text-base font-semibold text-zinc-900">
              {formatPrice(trek.price_per_person)}
            </span>
            <span className="block text-xs text-zinc-500">per person</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
