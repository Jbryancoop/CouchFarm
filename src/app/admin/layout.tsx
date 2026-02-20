import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</div>
    </div>
  );
}
