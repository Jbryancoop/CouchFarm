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
      <div className="bg-ranch-50 border border-ranch-200 rounded-2xl p-8 text-center">
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      <input type="hidden" name="source" value={ref_source || ""} />
      {couchId && <input type="hidden" name="couchId" value={couchId} />}

      {/* Contact Info */}
      <fieldset>
        <legend className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          Your Information
        </legend>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input name="name" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input name="email" type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
            <input name="phone" type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
          </div>
        </div>
      </fieldset>

      {/* Preferences */}
      <fieldset>
        <legend className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-ranch-50 text-ranch-600 rounded-lg flex items-center justify-center text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          What Are You Looking For?
        </legend>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Style</label>
              <select name="preferredStyle" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition">
                <option value="">Any style</option>
                {couchStyles.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Color</label>
              <select name="preferredColor" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition">
                <option value="">Any color</option>
                {couchColors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6 bg-gray-50 rounded-xl p-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="hasSleeper" value="true" className="rounded border-gray-300 text-brand-500 focus:ring-brand-400" />
              <span className="text-sm text-gray-700">Sleeper</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="hasReclining" value="true" className="rounded border-gray-300 text-brand-500 focus:ring-brand-400" />
              <span className="text-sm text-gray-700">Reclining</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Min ($)</label>
              <input name="budgetMin" type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Max ($)</label>
              <input name="budgetMax" type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Anything else we should know?</label>
            <textarea name="message" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-sm"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Request"
        )}
      </button>
    </form>
  );
}
