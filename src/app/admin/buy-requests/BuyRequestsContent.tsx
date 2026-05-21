"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { BuyRequest } from "@prisma/client";
import { UpdateStatusButton } from "@/components/admin/UpdateStatusButton";
import { Modal } from "@/components/admin/Modal";
import { LeadsToolbar, type LeadsToolbarState, type SortOption } from "@/components/admin/LeadsToolbar";
import { BuyRequestForm } from "@/components/admin/BuyRequestForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buyRequestStatuses } from "@/lib/lead-input";

const STATUS_OPTIONS: string[] = [...buyRequestStatuses];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-600",
};

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name (A–Z)" },
  { value: "status", label: "Status" },
  { value: "price", label: "Asking price (high → low)" },
];

export default function BuyRequestsContent({
  buyRequests,
  styles,
  conditions,
}: {
  buyRequests: BuyRequest[];
  styles: { value: string; label: string }[];
  conditions: { value: string; label: string }[];
}) {
  const router = useRouter();

  const [toolbar, setToolbar] = useState<LeadsToolbarState>({
    search: "",
    statuses: [],
    sort: "newest",
  });

  // Drawer state: null = closed; { buyRequest: undefined } = create; { buyRequest } = edit.
  const [editing, setEditing] = useState<{ buyRequest?: BuyRequest } | null>(null);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState("");

  // Per-row delete state: the id currently being deleted (guards double-submit),
  // plus an inline error message surfaced on the affected card (mirrors save UX).
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<{ id: string; message: string } | null>(null);

  const visible = useMemo(() => {
    const q = toolbar.search.toLowerCase().trim();
    let rows = buyRequests.filter((req) => {
      if (toolbar.statuses.length > 0 && !toolbar.statuses.includes(req.status)) return false;
      if (q) {
        const haystack = [req.name, req.email, req.brand].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    rows = [...rows].sort((a, b) => {
      switch (toolbar.sort) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "price":
          return (b.askingPrice ?? 0) - (a.askingPrice ?? 0);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return rows;
  }, [buyRequests, toolbar]);

  function openCreate() {
    setServerError("");
    setEditing({ buyRequest: undefined });
  }

  function openEdit(req: BuyRequest) {
    setServerError("");
    setEditing({ buyRequest: req });
  }

  function closeDrawer() {
    if (pending) return;
    setEditing(null);
    setServerError("");
  }

  async function handleSave(body: Record<string, unknown>) {
    setPending(true);
    setServerError("");

    const editingExisting = editing?.buyRequest;
    const url = editingExisting
      ? `/api/admin/buy-requests/${editingExisting.id}`
      : "/api/admin/buy-requests";
    const method = editingExisting ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditing(null);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || "Failed to save buy request.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(req: BuyRequest) {
    if (deletingId) return; // guard against concurrent / double-click deletes
    if (!window.confirm(`Delete buy request from ${req.name}? This cannot be undone.`)) return;

    setDeletingId(req.id);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/buy-requests/${req.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setDeleteError({ id: req.id, message: data.error || "Failed to delete buy request." });
      }
    } catch {
      setDeleteError({ id: req.id, message: "Network error. Please try again." });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Buy Requests ({buyRequests.length})</h1>

      <LeadsToolbar
        state={toolbar}
        onChange={setToolbar}
        statusOptions={STATUS_OPTIONS}
        sortOptions={SORT_OPTIONS}
        resultCount={visible.length}
        onAdd={openCreate}
        addLabel="+ Add Buy Request"
        searchPlaceholder="Search name, email, brand..."
      />

      <div className="space-y-4">
        {visible.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-500">
              {buyRequests.length === 0
                ? "No buy requests yet."
                : "No buy requests match your filters."}
            </p>
          </div>
        )}

        {visible.map((req) => {
          const styleLabel = styles.find((s) => s.value === req.style)?.label || req.style;
          const condLabel =
            conditions.find((c) => c.value === req.condition)?.label || req.condition;
          return (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold">{req.name}</h3>
                  <p className="text-sm text-gray-500">
                    <a href={`mailto:${req.email}`} className="text-brand-600 hover:underline">{req.email}</a>
                    {req.phone && (
                      <> · <a href={`tel:${req.phone}`} className="text-brand-600 hover:underline">{req.phone}</a></>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} colors={STATUS_COLORS} />
                  <UpdateStatusButton
                    id={req.id}
                    type="buy-request"
                    currentStatus={req.status}
                    options={STATUS_OPTIONS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {req.brand && <Detail label="Brand" value={req.brand} />}
                {styleLabel && <Detail label="Style" value={styleLabel} />}
                {req.color && <Detail label="Color" value={req.color} />}
                {condLabel && <Detail label="Condition" value={condLabel} />}
                {req.age && <Detail label="Age" value={req.age} />}
                {req.askingPrice != null && <Detail label="Asking Price" value={`$${req.askingPrice}`} />}
              </div>

              {req.description && (
                <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">{req.description}</p>
              )}

              {req.adminNotes && (
                <p className="text-sm text-amber-700 mt-3 bg-amber-50 rounded-lg p-3">
                  <span className="font-medium">Notes: </span>{req.adminNotes}
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(req)}
                    className="text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(req)}
                    disabled={deletingId === req.id}
                    className="text-xs border border-red-200 text-red-600 rounded px-3 py-1 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === req.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {deleteError?.id === req.id && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm mt-3">
                  {deleteError.message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        open={editing !== null}
        onClose={closeDrawer}
        title={editing?.buyRequest ? "Edit Buy Request" : "Add Buy Request"}
      >
        {editing !== null && (
          <BuyRequestForm
            // Remount on target change so form state resets per buy request.
            key={editing.buyRequest?.id ?? "new"}
            buyRequest={editing.buyRequest}
            onSave={handleSave}
            onCancel={closeDrawer}
            onDirty={() => setServerError("")}
            pending={pending}
            serverError={serverError}
          />
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500 text-xs">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
