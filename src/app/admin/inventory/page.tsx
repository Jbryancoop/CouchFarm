import { prisma } from "@/lib/db";
import Link from "next/link";
import { couchStyles } from "@/lib/config";
import { DeleteCouchButton } from "./DeleteCouchButton";

export default async function AdminInventoryPage() {
  const couches = await prisma.couch.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory ({couches.length})</h1>
        <Link
          href="/admin/inventory/new"
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          + Add Couch
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Mobile card view */}
        <div className="md:hidden divide-y">
          {couches.map((couch) => {
            const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;
            return (
              <div key={couch.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                    {couch.images[0] ? (
                      <img src={couch.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/inventory/${couch.id}`} className="font-medium hover:text-brand-600">
                      {couch.title}
                    </Link>
                    <p className="text-xs text-gray-500">{styleLabel} &middot; {couch.color}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={couch.status} />
                      {couch.sellPrice && <span className="text-sm font-medium">${couch.sellPrice}</span>}
                    </div>
                  </div>
                  <DeleteCouchButton id={couch.id} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Couch</th>
              <th className="px-4 py-3">Style</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Buy Price</th>
              <th className="px-4 py-3">Sell Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {couches.map((couch) => {
              const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;
              return (
                <tr key={couch.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                        {couch.images[0] ? (
                          <img src={couch.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                            No img
                          </div>
                        )}
                      </div>
                      <Link href={`/admin/inventory/${couch.id}`} className="font-medium hover:text-brand-600">
                        {couch.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{styleLabel}</td>
                  <td className="px-4 py-3">{couch.color}</td>
                  <td className="px-4 py-3">{couch.buyPrice ? `$${couch.buyPrice}` : "—"}</td>
                  <td className="px-4 py-3">{couch.sellPrice ? `$${couch.sellPrice}` : "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={couch.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/inventory/${couch.id}`} className="text-brand-600 hover:text-brand-700">
                        Edit
                      </Link>
                      <DeleteCouchButton id={couch.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {couches.length === 0 && (
          <p className="p-8 text-center text-gray-500">No couches in inventory. Add your first one!</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    sold: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
