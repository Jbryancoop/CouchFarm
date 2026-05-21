"use client";

import { useState } from "react";
import type { CustomerInquiry } from "@prisma/client";
import { couchStyles, couchColors } from "@/lib/config";

const STATUSES = ["new", "contacted", "converted", "closed"] as const;

export interface InquiryFormValues {
  name: string;
  email: string;
  phone: string;
  preferredStyle: string;
  preferredColor: string;
  hasSleeper: boolean;
  hasReclining: boolean;
  budgetMin: string;
  budgetMax: string;
  message: string;
  status: string;
  source: string;
  adminNotes: string;
}

function toFormValues(inq?: CustomerInquiry): InquiryFormValues {
  return {
    name: inq?.name ?? "",
    email: inq?.email ?? "",
    phone: inq?.phone ?? "",
    preferredStyle: inq?.preferredStyle ?? "",
    preferredColor: inq?.preferredColor ?? "",
    hasSleeper: inq?.hasSleeper ?? false,
    hasReclining: inq?.hasReclining ?? false,
    budgetMin: inq?.budgetMin != null ? String(inq.budgetMin) : "",
    budgetMax: inq?.budgetMax != null ? String(inq.budgetMax) : "",
    message: inq?.message ?? "",
    status: inq?.status ?? "new",
    source: inq?.source ?? "",
    adminNotes: inq?.adminNotes ?? "",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Entity-specific create/edit form for CustomerInquiry. Renders inside the
 * reusable Modal shell. Validates client-side, then hands a JSON body to onSave
 * (the parent does the POST/PUT + refresh). Inline server errors via the error prop.
 */
export function InquiryForm({
  inquiry,
  onSave,
  onCancel,
  pending,
  serverError,
}: {
  inquiry?: CustomerInquiry;
  onSave: (body: Record<string, unknown>) => void;
  onCancel: () => void;
  pending: boolean;
  serverError?: string;
}) {
  const [values, setValues] = useState<InquiryFormValues>(() => toFormValues(inquiry));
  const [localError, setLocalError] = useState("");

  function set<K extends keyof InquiryFormValues>(key: K, value: InquiryFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    if (!values.name.trim()) return setLocalError("Name is required.");
    if (!values.email.trim()) return setLocalError("Email is required.");
    if (!EMAIL_RE.test(values.email.trim())) return setLocalError("Please enter a valid email address.");

    const min = values.budgetMin.trim() === "" ? null : parseFloat(values.budgetMin);
    const max = values.budgetMax.trim() === "" ? null : parseFloat(values.budgetMax);
    if (min != null && max != null && min > max) {
      return setLocalError("Minimum budget cannot exceed maximum budget.");
    }

    onSave({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || null,
      preferredStyle: values.preferredStyle || null,
      preferredColor: values.preferredColor || null,
      hasSleeper: values.hasSleeper,
      hasReclining: values.hasReclining,
      budgetMin: min,
      budgetMax: max,
      message: values.message.trim() || null,
      status: values.status,
      source: values.source.trim() || null,
      adminNotes: values.adminNotes.trim() || null,
    });
  }

  const error = localError || serverError;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Style</label>
          <select
            value={values.preferredStyle}
            onChange={(e) => set("preferredStyle", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Any</option>
            {couchStyles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Color</label>
          <select
            value={values.preferredColor}
            onChange={(e) => set("preferredColor", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Any</option>
            {couchColors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.hasSleeper}
            onChange={(e) => set("hasSleeper", e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Wants sleeper</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.hasReclining}
            onChange={(e) => set("hasReclining", e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Wants reclining</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Budget Min ($)</label>
          <input
            type="number"
            step="1"
            value={values.budgetMin}
            onChange={(e) => set("budgetMin", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Budget Max ($)</label>
          <input
            type="number"
            step="1"
            value={values.budgetMax}
            onChange={(e) => set("budgetMax", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={values.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <input
            value={values.source}
            onChange={(e) => set("source", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          rows={3}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Admin Notes</label>
        <textarea
          rows={3}
          value={values.adminNotes}
          onChange={(e) => set("adminNotes", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          {pending ? "Saving..." : inquiry ? "Update Inquiry" : "Add Inquiry"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 px-4 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
