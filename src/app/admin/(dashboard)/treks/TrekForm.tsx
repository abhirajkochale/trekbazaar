"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { slugify } from "@/lib/format";
import type { Difficulty, Trek, TrekStatus } from "@/lib/types";
import { saveTrek, type SaveTrekState } from "./actions";

const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "difficult", "extreme"];
const STATUSES: TrekStatus[] = ["draft", "active", "archived"];

const fieldClasses =
  "mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function TrekForm({ trek }: { trek?: Trek }) {
  const [state, formAction, pending] = useActionState<SaveTrekState, FormData>(
    saveTrek,
    null
  );

  const [title, setTitle] = useState(trek?.title ?? "");
  const [slug, setSlug] = useState(trek?.slug ?? "");
  // For existing treks, treat the slug as manually set so we don't rewrite it.
  const [slugEdited, setSlugEdited] = useState(Boolean(trek?.slug));

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="space-y-5">
      {trek && <input type="hidden" name="id" value={trek.id} />}

      <div>
        <label htmlFor="title" className={labelClasses}>
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClasses}>
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(true);
          }}
          className={fieldClasses}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Auto-filled from the title; edit to override. Used in the URL:
          /treks/{slug || "your-slug"}
        </p>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={trek?.description ?? ""}
          className={fieldClasses}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="region" className={labelClasses}>
            Region <span className="text-red-500">*</span>
          </label>
          <input
            id="region"
            name="region"
            type="text"
            required
            defaultValue={trek?.region ?? ""}
            className={fieldClasses}
            placeholder="e.g. Himachal Pradesh"
          />
        </div>
        <div>
          <label htmlFor="difficulty" className={labelClasses}>
            Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={trek?.difficulty ?? "moderate"}
            className={fieldClasses}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="duration_days" className={labelClasses}>
            Duration (days) <span className="text-red-500">*</span>
          </label>
          <input
            id="duration_days"
            name="duration_days"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={trek?.duration_days ?? ""}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="price_per_person" className={labelClasses}>
            Price per person (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="price_per_person"
            name="price_per_person"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={trek?.price_per_person ?? ""}
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cover_image_url" className={labelClasses}>
          Cover image URL <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="cover_image_url"
          name="cover_image_url"
          type="url"
          defaultValue={trek?.cover_image_url ?? ""}
          className={fieldClasses}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="operator_name" className={labelClasses}>
            Operator name <span className="text-red-500">*</span>
          </label>
          <input
            id="operator_name"
            name="operator_name"
            type="text"
            required
            defaultValue={trek?.operator_name ?? ""}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="operator_contact" className={labelClasses}>
            Operator contact <span className="text-red-500">*</span>
          </label>
          <input
            id="operator_contact"
            name="operator_contact"
            type="text"
            required
            defaultValue={trek?.operator_contact ?? ""}
            className={fieldClasses}
            placeholder="phone or email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className={labelClasses}>
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          name="status"
          defaultValue={trek?.status ?? "draft"}
          className={`${fieldClasses} sm:w-48`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-zinc-500">
          Only <strong>active</strong> treks appear on the public site.
        </p>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-600/60"
        >
          {pending ? "Saving…" : "Save trek"}
        </button>
        <Link
          href="/admin"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
