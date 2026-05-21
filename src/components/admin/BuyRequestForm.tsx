"use client";

import { useState } from "react";
import type { BuyRequest } from "@prisma/client";
import { couchStyles, couchColors, conditions } from "@/lib/config";
import { buyRequestStatuses } from "@/lib/lead-input";

export interface BuyRequestFormValues {
  name: string;
  email: string;
  phone: string;
  brand: string;
  style: string;
  color: string;
  condition: string;
  age: string;
  askingPrice: string;
  description: string;
  images: string;
  status: string;
  source: string;
  adminNotes: string;
}

/** Parse the stored images JSON string into newline-separated text. */
function imagesToText(images: string | null | undefined): string {
  if (!images) return "";
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) {
      return parsed.filter((u) => typeof u === "string").join("\n");
    }
  } catch {
    // Invalid JSON — fall through to empty.
  }
  return "";
}

function toFormValues(req?: BuyRequest): BuyRequestFormValues {
  return {
    name: req?.name ?? "",
    email: req?.email ?? "",
    phone: req?.phone ?? "",
    brand: req?.brand ?? "",
    style: req?.style ?? "",
    color: req?.color ?? "",
    condition: req?.condition ?? "",
    age: req?.age ?? "",
    askingPrice: req?.askingPrice != null ? String(req.askingPrice) : "",
    description: req?.description ?? "",
    images: imagesToText(req?.images),
    status: req?.status ?? "new",
    source: req?.source ?? "",
    adminNotes: req?.adminNotes ?? "",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Entity-specific create/edit form for BuyRequest. Renders inside the reusable
 * Modal shell. Validates client-side, then hands a JSON body to onSave (the parent
 * does the POST/PUT + refresh). Inline server errors via the error prop.
 */
export function BuyRequestForm({
  buyRequest,
  onSave,
  onCancel,
  onDirty,
  pending,
  serverError,
}: {
  buyRequest?: BuyRequest;
  onSave: (body: Record<string, unknown>) => void;
  onCancel: () => void;
  /** Called when the user edits any field, so the parent can clear a stale serverError. */
  onDirty?: () => void;
  pending: boolean;
  serverError?: string;
}) {
  const [values, setValues] = useState<BuyRequestFormValues>(() => toFormValues(buyRequest));
  const [localError, setLocalError] = useState("");

  function set<K extends keyof BuyRequestFormValues>(key: K, value: BuyRequestFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Editing after a failed save should clear stale errors so they can't mask a fresh pass.
    if (localError) setLocalError("");
    if (serverError) onDirty?.();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    if (!values.name.trim()) return setLocalError("Name is required.");
    if (!values.email.trim()) return setLocalError("Email is required.");
    if (!EMAIL_RE.test(values.email.trim())) return setLocalError("Please enter a valid email address.");

    const price = values.askingPrice.trim() === "" ? null : parseFloat(values.askingPrice);

    const imageUrls = values.images
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    onSave({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || null,
      brand: values.brand.trim() || null,
      style: values.style || null,
      color: values.color || null,
      condition: values.condition || null,
      age: values.age.trim() || null,
      askingPrice: price,
      description: values.description.trim() || null,
      images: imageUrls,
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
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            value={values.brand}
            onChange={(e) => set("brand", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            value={values.age}
            onChange={(e) => set("age", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Style</label>
          <select
            value={values.style}
            onChange={(e) => set("style", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Any</option>
            {couchStyles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <select
            value={values.color}
            onChange={(e) => set("color", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Any</option>
            {couchColors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select
            value={values.condition}
            onChange={(e) => set("condition", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Any</option>
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Asking Price ($)</label>
          <input
            type="number"
            step="1"
            value={values.askingPrice}
            onChange={(e) => set("askingPrice", e.target.value)}
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
            {buyRequestStatuses.map((s) => (
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
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URLs</label>
        <textarea
          rows={3}
          value={values.images}
          onChange={(e) => set("images", e.target.value)}
          placeholder="One URL per line"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <p className="text-xs text-gray-400 mt-1">One image URL per line.</p>
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
          {pending ? "Saving..." : buyRequest ? "Update Buy Request" : "Add Buy Request"}
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
