"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { platforms } from "@/lib/config";

export function CreateLinkForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        destination: formData.get("destination") || "/inventory",
        platform: formData.get("platform") || null,
        campaign: formData.get("campaign") || null,
      }),
    });

    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create link.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-4">
      <h2 className="font-semibold">Create New Link</h2>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input name="name" required placeholder="e.g., FB Post - Modular Couch" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug *</label>
        <input name="slug" required placeholder="e.g., fb-modular-jan" pattern="[a-z0-9-]+" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-gray-400 mt-0.5">Lowercase letters, numbers, and hyphens only</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Destination</label>
        <select name="destination" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="/inventory">Inventory Page</option>
          <option value="/inquiry">Inquiry Form</option>
          <option value="/sell">Sell Your Couch</option>
          <option value="/">Home Page</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Platform</label>
        <select name="platform" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Select platform</option>
          {platforms.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Campaign</label>
        <input name="campaign" placeholder="e.g., January Sale" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg text-sm transition"
      >
        {pending ? "Creating..." : "Create Link"}
      </button>
    </form>
  );
}
