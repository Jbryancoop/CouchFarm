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
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function removeImage(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.publicUrl);
        } else {
          const data = await res.json();
          console.error("Upload failed:", data.error);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    if (newUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
    setUploading(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
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
        <label className="block text-sm font-medium mb-2">Photos</label>

        {/* Existing images */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img src={url} alt="" className="w-full aspect-square object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => document.getElementById("photo-upload")?.click()}
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <div>
                <span className="text-sm font-medium text-blue-600">Click to upload</span>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </div>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</span>
            </div>
          )}
        </div>
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
