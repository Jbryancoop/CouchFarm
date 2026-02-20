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
      <div className="bg-ranch-50 border border-ranch-200 rounded-xl p-8 text-center">
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
      )}

      <input type="hidden" name="source" value={ref_source || ""} />

      <h2 className="text-lg font-semibold border-b pb-2">Your Information</h2>

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

      <h2 className="text-lg font-semibold border-b pb-2 pt-4">Couch Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input name="brand" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select name="style" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Select style</option>
            {couchStyles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <select name="color" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Select color</option>
            {couchColors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select name="condition" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Select condition</option>
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Age (e.g., 2 years)</label>
          <input name="age" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Asking Price ($)</label>
          <input name="askingPrice" type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Any details about the couch: dimensions, wear, why you're selling, etc."
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ranch-600 hover:bg-ranch-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
      >
        {pending ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  );
}
