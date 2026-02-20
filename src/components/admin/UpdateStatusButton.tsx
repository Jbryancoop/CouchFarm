"use client";

import { useRouter } from "next/navigation";

export function UpdateStatusButton({
  id,
  type,
  currentStatus,
  options,
}: {
  id: string;
  type: "inquiry" | "buy-request";
  currentStatus: string;
  options: string[];
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    await fetch(`/api/admin/${type === "inquiry" ? "inquiries" : "buy-requests"}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
