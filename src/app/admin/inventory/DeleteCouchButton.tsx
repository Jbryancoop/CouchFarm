"use client";

import { useRouter } from "next/navigation";

export function DeleteCouchButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this couch?")) return;

    const res = await fetch(`/api/admin/inventory/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-xs">
      Delete
    </button>
  );
}
