"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddUserForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
      }),
    });

    if (res.ok) {
      setSuccess("User created successfully.");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create user.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-4">
      <h2 className="font-semibold">Add Team Member</h2>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-sm">{success}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password *</label>
        <input name="password" type="password" required minLength={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role *</label>
        <select name="role" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="sales">Sales Team</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg text-sm transition"
      >
        {pending ? "Creating..." : "Add User"}
      </button>
    </form>
  );
}
