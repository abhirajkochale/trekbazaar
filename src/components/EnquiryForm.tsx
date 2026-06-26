import type { Trek } from "@/lib/types";

/**
 * Enquiry form layout. Submission is NOT wired up yet — that comes in the
 * next step. The fields are here so the page is visually complete and the
 * "Enquire Now" button has a target to scroll to (#enquiry).
 */
export function EnquiryForm({ trek }: { trek: Trek }) {
  return (
    <section
      id="enquiry"
      className="scroll-mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <h2 className="text-xl font-semibold text-zinc-900">
        Enquire about this trek
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Send your details and {trek.operator_name} will get back to you.
      </p>

      <form className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Your full name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-zinc-700"
            >
              Phone <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="+91 ..."
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-zinc-700"
          >
            Message <span className="text-zinc-400">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Dates you're considering, group size, questions..."
          />
        </div>

        {/* Submission is wired up in the next step. */}
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-emerald-600/60 px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
          title="Form submission is coming in the next step"
        >
          Send enquiry (coming soon)
        </button>
      </form>
    </section>
  );
}
