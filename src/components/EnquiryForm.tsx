"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  /** When rendered on a trek detail page, ties the enquiry to that trek. */
  trekId?: string;
  trekTitle?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EnquiryForm({ trekId, trekTitle }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    trekTitle ? `I'm interested in ${trekTitle}.` : ""
  );

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setState("submitting");

    const supabase = createClient();
    // No .select() here: the anon key can INSERT but not SELECT enquiries
    // (by design), so reading the row back would falsely report an error.
    const { error } = await supabase.from("enquiries").insert({
      trek_id: trekId ?? null,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim() || null,
    });

    if (error) {
      console.error("Enquiry submission failed:", error.message);
      setSubmitError(
        "Something went wrong sending your enquiry. Please try again."
      );
      setState("error");
      return;
    }

    setState("success");
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setMessage(trekTitle ? `I'm interested in ${trekTitle}.` : "");
    setErrors({});
    setSubmitError("");
    setState("idle");
  }

  const headingId = "enquiry-heading";
  const inputClasses =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const errorInputClasses =
    "mt-1 w-full rounded-lg border border-red-400 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

  if (state === "success") {
    return (
      <section
        id="enquiry"
        className="scroll-mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center"
      >
        <p className="text-4xl" aria-hidden="true">
          ✅
        </p>
        <h2 className="mt-2 text-xl font-semibold text-emerald-900">
          Thanks, we&apos;ll be in touch
        </h2>
        <p className="mt-1 text-sm text-emerald-800">
          Your enquiry has been received. The operator will get back to you
          shortly.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-4 text-sm font-medium text-emerald-700 hover:underline"
        >
          Send another enquiry
        </button>
      </section>
    );
  }

  return (
    <section
      id="enquiry"
      aria-labelledby={headingId}
      className="scroll-mt-6 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <h2 id={headingId} className="text-xl font-semibold text-zinc-900">
        {trekTitle ? "Enquire about this trek" : "Have a question?"}
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        {trekTitle
          ? "Send your details and the operator will get back to you."
          : "Send us a general enquiry and we'll get back to you."}
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={errors.name ? errorInputClasses : inputClasses}
            placeholder="Your full name"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? errorInputClasses : inputClasses}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
              Phone <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
              placeholder="+91 ..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
            Message <span className="text-zinc-400">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputClasses}
            placeholder="Dates you're considering, group size, questions..."
          />
        </div>

        {state === "error" && submitError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-600/60 sm:w-auto"
        >
          {state === "submitting" ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </section>
  );
}
