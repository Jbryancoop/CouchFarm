"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { paymentMethods } from "@/lib/config";

type CouchOption = { id: string; title: string; buyPrice: number | null; sellPrice: number | null };

export default function NewSalePage() {
  const router = useRouter();
  const [couches, setCouches] = useState<CouchOption[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/inventory/available")
      .then((r) => r.json())
      .then((d) => setCouches(d.couches || []));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        couchId: formData.get("couchId") || null,
        couchTitle: formData.get("couchTitle"),
        sellPrice: parseFloat(formData.get("sellPrice") as string),
        buyPrice: formData.get("buyPrice") ? parseFloat(formData.get("buyPrice") as string) : null,
        paymentMethod: formData.get("paymentMethod"),
        soldBy: formData.get("soldBy") || null,
        customerName: formData.get("customerName") || null,
        notes: formData.get("notes") || null,
      }),
    });

    if (res.ok) {
      router.push("/admin/sales");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to record sale.");
    }
    setPending(false);
  }

  function handleCouchSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const couch = couches.find((c) => c.id === e.target.value);
    if (couch) {
      const form = e.target.form!;
      (form.elements.namedItem("couchTitle") as HTMLInputElement).value = couch.title;
      if (couch.buyPrice) (form.elements.namedItem("buyPrice") as HTMLInputElement).value = String(couch.buyPrice);
      if (couch.sellPrice) (form.elements.namedItem("sellPrice") as HTMLInputElement).value = String(couch.sellPrice);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Record Sale</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 max-w-lg space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Select from Inventory (optional)</label>
          <select name="couchId" onChange={handleCouchSelect} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="">Manual entry</option>
            {couches.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Couch Title *</label>
          <input name="couchTitle" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sell Price ($) *</label>
            <input name="sellPrice" type="number" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Buy Price ($)</label>
            <input name="buyPrice" type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method *</label>
          <select name="paymentMethod" required className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            {paymentMethods.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sold By</label>
            <input name="soldBy" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input name="customerName" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={pending} className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-medium px-6 py-2.5 rounded-lg transition">
            {pending ? "Saving..." : "Record Sale"}
          </button>
          <button type="button" onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 px-4 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
