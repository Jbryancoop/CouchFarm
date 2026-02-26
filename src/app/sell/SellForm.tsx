"use client";

import { useState } from "react";
import { couchStyles, couchColors, conditions } from "@/lib/config";
import { submitBuyRequest } from "./actions";

export function SellForm({ ref_source }: { ref_source?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitBuyRequest(formData);

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
        <h2 className="text-xl font-bold mb-2">Submission Received!</h2>
        <p className="text-gray-600">
          Thanks for your submission! We&apos;ll review your couch details and get back to you shortly.
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

      {/* Your Information */}
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

      {/* Couch Details */}
      <fieldset>
        <legend className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-ranch-50 text-ranch-600 rounded-lg flex items-center justify-center text-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
            </svg>
          </span>
          Couch Details
        </legend>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
              <input name="brand" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Style</label>
              <select name="style" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition">
                <option value="">Select style</option>
                {couchStyles.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
              <select name="color" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition">
                <option value="">Select color</option>
                {couchColors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
              <select name="condition" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition">
                <option value="">Select condition</option>
                {conditions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age (e.g., 2 years)</label>
              <input name="age" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Asking Price ($)</label>
              <input name="askingPrice" type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Any details about the couch: dimensions, wear, why you're selling, etc."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
            />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ranch-600 hover:bg-ranch-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-sm"
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
          "Submit for Review"
        )}
      </button>
    </form>
  );
}
