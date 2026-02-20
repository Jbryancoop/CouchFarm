"use client";

import { useState } from "react";
import { couchStyles, couchColors } from "@/lib/config";
import { submitInquiry } from "./actions";

export function InquiryForm({ couchId, ref_source }: { couchId?: string; ref_source?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitInquiry(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
    setPending(false);
  }

  if (submitted) {
    return (
      <div className="bg-ranch-50 border border-ranch-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-ranch-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
        <p className="text-gray-600">
          Thanks for reaching out! We&apos;ll review your preferences and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
      )}

      <input type="hidden" name="source" value={ref_source || ""} />
      {couchId && <input type="hidden" name="couchId" value={couchId} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone (optional)</label>
        <input name="phone" type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Style</label>
          <select name="preferredStyle" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Any style</option>
            {couchStyles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Color</label>
          <select name="preferredColor" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Any color</option>
            {couchColors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="hasSleeper" value="true" className="rounded" />
          <span className="text-sm">Sleeper</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="hasReclining" value="true" className="rounded" />
          <span className="text-sm">Reclining</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Budget Min ($)</label>
          <input name="budgetMin" type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Budget Max ($)</label>
          <input name="budgetMax" type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Anything else we should know?</label>
        <textarea name="message" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {pending ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
