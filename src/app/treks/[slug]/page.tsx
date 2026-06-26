import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/CoverImage";
import { EnquiryForm } from "@/components/EnquiryForm";
import {
  difficultyBadgeClasses,
  difficultyLabel,
  formatDuration,
  formatPrice,
} from "@/lib/format";
import { getTrekBySlug } from "@/lib/treks";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);

  if (!trek) {
    return {
      title: "Trek not found — TrekBazaar",
      description: "This trek could not be found on TrekBazaar.",
    };
  }

  // Trim the description to a sensible meta length.
  const description =
    trek.description.length > 155
      ? `${trek.description.slice(0, 152).trimEnd()}…`
      : trek.description;

  const title = `${trek.title} — ${trek.region} | TrekBazaar`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: trek.cover_image_url ? [{ url: trek.cover_image_url }] : undefined,
    },
  };
}

export default async function TrekDetailPage({ params }: Props) {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);

  if (!trek) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="inline-block text-sm text-emerald-700 hover:underline"
        >
          ← Back to all treks
        </Link>

        {/* Cover */}
        <div className="mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <CoverImage src={trek.cover_image_url} alt={trek.title} />
        </div>

        {/* Title + key facts */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {trek.title}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyBadgeClasses(
                trek.difficulty
              )}`}
            >
              {difficultyLabel(trek.difficulty)}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Fact label="Region" value={trek.region} />
            <Fact label="Difficulty" value={difficultyLabel(trek.difficulty)} />
            <Fact label="Duration" value={formatDuration(trek.duration_days)} />
            <Fact
              label="Price"
              value={`${formatPrice(trek.price_per_person)} / person`}
            />
          </dl>
        </div>

        {/* Enquire CTA */}
        <div className="mt-6">
          <a
            href="#enquiry"
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            Enquire Now
          </a>
        </div>

        {/* Description */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">About this trek</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-700">
            {trek.description}
          </p>
        </section>

        {/* Operator */}
        <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Operator</h2>
          <p className="mt-2 text-zinc-700">{trek.operator_name}</p>
          <p className="text-sm text-zinc-500">{trek.operator_contact}</p>
        </section>

        {/* Enquiry form */}
        <div className="mt-8">
          <EnquiryForm trekId={trek.id} trekTitle={trek.title} />
        </div>
      </div>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
