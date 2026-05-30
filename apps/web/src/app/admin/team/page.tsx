import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AddUserForm } from "./AddUserForm";
import { ToggleUserButton } from "./ToggleUserButton";

export default async function AdminTeamPage() {
  const currentUser = await requireAuth("admin").catch(() => null);
  if (!currentUser) redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add User Form */}
        <div className="lg:col-span-1">
          <AddUserForm />
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="divide-y">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {user.name}
                      {user.id === currentUser.id && (
                        <span className="text-xs text-gray-400 ml-2">(you)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                      {!user.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                          Disabled
                        </span>
                      )}
                    </div>
                  </div>
                  {user.id !== currentUser.id && (
                    <ToggleUserButton id={user.id} active={user.active} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
