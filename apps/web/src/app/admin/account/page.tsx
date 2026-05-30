"use client";

import { useState } from "react";

export default function AccountPage() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    const currentPassword = data.get("currentPassword") as string;
    const newPassword = data.get("newPassword") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setPending(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setSuccess(true);
      form.reset();
    } else {
      const body = await res.json();
      setError(body.error || "Failed to change password.");
    }
    setPending(false);
  }

  const inputType = showPasswords ? "text" : "password";
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2";

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-sm">
            Password updated successfully.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input name="currentPassword" type={inputType} required autoComplete="current-password" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input name="newPassword" type={inputType} required minLength={8} autoComplete="new-password" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm New Password</label>
          <input name="confirmPassword" type={inputType} required minLength={8} autoComplete="new-password" className={inputClass} />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
            className="rounded"
          />
          Show passwords
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg transition"
        >
          {pending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
