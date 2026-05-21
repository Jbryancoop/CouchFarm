"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CustomerInquiry } from "@prisma/client";
import { UpdateStatusButton } from "@/components/admin/UpdateStatusButton";
import { Modal } from "@/components/admin/Modal";
import { LeadsToolbar, type LeadsToolbarState, type SortOption } from "@/components/admin/LeadsToolbar";
import { InquiryForm } from "@/components/admin/InquiryForm";

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"];

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name (A–Z)" },
  { value: "status", label: "Status" },
  { value: "budget", label: "Budget (high → low)" },
];

export default function InquiriesContent({
  inquiries,
  styles,
}: {
  inquiries: CustomerInquiry[];
  styles: { value: string; label: string }[];
}) {
  const router = useRouter();

  const [toolbar, setToolbar] = useState<LeadsToolbarState>({
    search: "",
    statuses: [],
    sort: "newest",
  });

  // Drawer state: null = closed; { inquiry: undefined } = create; { inquiry } = edit.
  const [editing, setEditing] = useState<{ inquiry?: CustomerInquiry } | null>(null);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState("");

  const visible = useMemo(() => {
    const q = toolbar.search.toLowerCase().trim();
    let rows = inquiries.filter((inq) => {
      if (toolbar.statuses.length > 0 && !toolbar.statuses.includes(inq.status)) return false;
      if (q) {
        const haystack = [inq.name, inq.email, inq.phone].filter(Boolean).join(" ").toLowerCase();
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
        case "budget":
          return (b.budgetMax ?? b.budgetMin ?? 0) - (a.budgetMax ?? a.budgetMin ?? 0);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return rows;
  }, [inquiries, toolbar]);

  function openCreate() {
    setServerError("");
    setEditing({ inquiry: undefined });
  }

  function openEdit(inq: CustomerInquiry) {
    setServerError("");
    setEditing({ inquiry: inq });
  }

  function closeDrawer() {
    if (pending) return;
    setEditing(null);
    setServerError("");
  }

  async function handleSave(body: Record<string, unknown>) {
    setPending(true);
    setServerError("");

    const editingExisting = editing?.inquiry;
    const url = editingExisting
      ? `/api/admin/inquiries/${editingExisting.id}`
      : "/api/admin/inquiries";
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
        setServerError(data.error || "Failed to save inquiry.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(inq: CustomerInquiry) {
    if (!window.confirm(`Delete inquiry from ${inq.name}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/inquiries/${inq.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      window.alert("Failed to delete inquiry.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Inquiries ({inquiries.length})</h1>

      <LeadsToolbar
        state={toolbar}
        onChange={setToolbar}
        statusOptions={STATUS_OPTIONS}
        sortOptions={SORT_OPTIONS}
        resultCount={visible.length}
        onAdd={openCreate}
        addLabel="+ Add Inquiry"
      />

      <div className="space-y-4">
        {visible.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-500">
              {inquiries.length === 0
                ? "No inquiries yet."
                : "No inquiries match your filters."}
            </p>
          </div>
        )}

        {visible.map((inq) => {
          const styleLabel =
            styles.find((s) => s.value === inq.preferredStyle)?.label || inq.preferredStyle;
          return (
            <div key={inq.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold">{inq.name}</h3>
                  <p className="text-sm text-gray-500">
                    <a href={`mailto:${inq.email}`} className="text-brand-600 hover:underline">{inq.email}</a>
                    {inq.phone && (
                      <> · <a href={`tel:${inq.phone}`} className="text-brand-600 hover:underline">{inq.phone}</a></>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={inq.status} />
                  <UpdateStatusButton
                    id={inq.id}
                    type="inquiry"
                    currentStatus={inq.status}
                    options={STATUS_OPTIONS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {styleLabel && <Detail label="Style" value={styleLabel} />}
                {inq.preferredColor && <Detail label="Color" value={inq.preferredColor} />}
                {inq.hasSleeper && <Detail label="Sleeper" value="Yes" />}
                {inq.hasReclining && <Detail label="Reclining" value="Yes" />}
                {(inq.budgetMin || inq.budgetMax) && (
                  <Detail
                    label="Budget"
                    value={`${inq.budgetMin ? `$${inq.budgetMin}` : "Any"} – ${inq.budgetMax ? `$${inq.budgetMax}` : "Any"}`}
                  />
                )}
                {inq.source && <Detail label="Source" value={inq.source} />}
              </div>

              {inq.message && (
                <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">{inq.message}</p>
              )}

              {inq.adminNotes && (
                <p className="text-sm text-amber-700 mt-3 bg-amber-50 rounded-lg p-3">
                  <span className="font-medium">Notes: </span>{inq.adminNotes}
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {new Date(inq.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(inq)}
                    className="text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(inq)}
                    className="text-xs border border-red-200 text-red-600 rounded px-3 py-1 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={editing !== null}
        onClose={closeDrawer}
        title={editing?.inquiry ? "Edit Inquiry" : "Add Inquiry"}
      >
        {editing !== null && (
          <InquiryForm
            // Remount on target change so form state resets per inquiry.
            key={editing.inquiry?.id ?? "new"}
            inquiry={editing.inquiry}
            onSave={handleSave}
            onCancel={closeDrawer}
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    converted: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}
