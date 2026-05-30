"use client";

import { useRouter } from "next/navigation";

export function DeleteLinkButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this marketing link?")) return;
    await fetch(`/api/admin/marketing/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-xs shrink-0">
      Delete
    </button>
  );
}
