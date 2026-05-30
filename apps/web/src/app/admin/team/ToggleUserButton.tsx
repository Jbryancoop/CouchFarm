"use client";

import { useRouter } from "next/navigation";

export function ToggleUserButton({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    const action = active ? "disable" : "enable";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    await fetch(`/api/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className={`text-xs px-3 py-1 rounded-lg font-medium transition ${
        active
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-green-50 text-green-600 hover:bg-green-100"
      }`}
    >
      {active ? "Disable" : "Enable"}
    </button>
  );
}
