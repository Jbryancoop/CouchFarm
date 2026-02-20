"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type User = { id: string; name: string; email: string; role: string };

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/buy-requests", label: "Buy Requests" },
  { href: "/admin/sales", label: "Sales" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/team", label: "Team" },
];

export function AdminNav({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6 overflow-x-auto">
            <Link href="/admin" className="font-bold text-ranch-700 shrink-0">
              Admin
            </Link>
            {navItems.map((item) => {
              // Only show team management to admins
              if (item.href === "/admin/team" && user.role !== "admin") return null;
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm shrink-0 py-4 border-b-2 transition ${
                    active
                      ? "border-brand-500 text-brand-600 font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span className="text-xs text-gray-500 hidden sm:block">{user.name}</span>
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
              View Site
            </Link>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
