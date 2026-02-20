"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { couchStyles, couchColors } from "@/lib/config";

type CouchData = {
  id: string;
  title: string;
  style: string;
  color: string;
  fabricType: string;
  length: number | null;
  width: number | null;
  height: number | null;
  notes: string | null;
  buyPrice: number | null;
  sellPrice: number | null;
  status: string;
  featured: boolean;
  images: { id: string; url: string; alt: string; order: number }[];
};

export function CouchForm({ couch }: { couch?: CouchData }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(couch?.images.map((i) => i.url) || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  function addImage() {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  }

  function removeImage(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      title: formData.get("title"),
      style: formData.get("style"),
      color: formData.get("color"),
      fabricType: formData.get("fabricType"),
      length: formData.get("length") ? parseFloat(formData.get("length") as string) : null,
      width: formData.get("width") ? parseFloat(formData.get("width") as string) : null,
      height: formData.get("height") ? parseFloat(formData.get("height") as string) : null,
      notes: formData.get("notes") || null,
      buyPrice: formData.get("buyPrice") ? parseFloat(formData.get("buyPrice") as string) : null,
      sellPrice: formData.get("sellPrice") ? parseFloat(formData.get("sellPrice") as string) : null,
      status: formData.get("status"),
      featured: formData.get("featured") === "on",
      images: imageUrls,
    };

    const url = couch
      ? `/api/admin/inventory/${couch.id}`
      : "/api/admin/inventory";
    const method = couch ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/inventory");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save couch.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input name="title" required defaultValue={couch?.title} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Style *</label>
          <select name="style" required defaultValue={couch?.style} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Select</option>
            {couchStyles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color *</label>
          <select name="color" required defaultValue={couch?.color} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Select</option>
            {couchColors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fabric *</label>
          <input name="fabricType" required defaultValue={couch?.fabricType} placeholder="e.g., Leather, Microfiber" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Length (in)</label>
          <input name="length" type="number" step="0.1" defaultValue={couch?.length ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Width (in)</label>
          <input name="width" type="number" step="0.1" defaultValue={couch?.width ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (in)</label>
          <input name="height" type="number" step="0.1" defaultValue={couch?.height ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Buy Price ($)</label>
          <input name="buyPrice" type="number" step="0.01" defaultValue={couch?.buyPrice ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sell Price ($)</label>
          <input name="sellPrice" type="number" step="0.01" defaultValue={couch?.sellPrice ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" defaultValue={couch?.status || "available"} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={couch?.featured} className="rounded" />
            <span className="text-sm font-medium">Featured on homepage</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea name="notes" rows={3} defaultValue={couch?.notes ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
        <div className="space-y-2 mb-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <img src={url} alt="" className="w-12 h-12 object-cover rounded" />
              <span className="text-xs text-gray-500 truncate flex-1">{url}</span>
              <button type="button" onClick={() => removeImage(i)} className="text-red-500 text-xs hover:text-red-700">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Paste image URL"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addImage}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Add image URLs. For S3 uploads, configure your AWS credentials in .env
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          {pending ? "Saving..." : couch ? "Update Couch" : "Add Couch"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 px-4 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
