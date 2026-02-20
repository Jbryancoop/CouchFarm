"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Invalid credentials");
    }
    setPending(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">{siteConfig.name}</h1>
        <p className="text-center text-gray-500 mb-8">Admin Portal</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-ranch-600 hover:bg-ranch-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
