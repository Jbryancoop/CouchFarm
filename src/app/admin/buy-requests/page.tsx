import { prisma } from "@/lib/db";
import { couchStyles, conditions } from "@/lib/config";
import { UpdateStatusButton } from "@/components/admin/UpdateStatusButton";

export default async function AdminBuyRequestsPage() {
  const requests = await prisma.buyRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Buy Requests ({requests.length})</h1>

      <div className="space-y-4">
        {requests.length === 0 && (
          <p className="text-gray-500 text-center py-8">No buy requests yet.</p>
        )}
        {requests.map((req) => {
          const styleLabel = couchStyles.find((s) => s.value === req.style)?.label || req.style;
          const condLabel = conditions.find((c) => c.value === req.condition)?.label || req.condition;
          return (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold">{req.name}</h3>
                  <p className="text-sm text-gray-500">{req.email}{req.phone && ` · ${req.phone}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                  <UpdateStatusButton
                    id={req.id}
                    type="buy-request"
                    currentStatus={req.status}
                    options={["new", "reviewing", "accepted", "declined"]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {req.brand && <Detail label="Brand" value={req.brand} />}
                {styleLabel && <Detail label="Style" value={styleLabel} />}
                {req.color && <Detail label="Color" value={req.color} />}
                {condLabel && <Detail label="Condition" value={condLabel} />}
                {req.age && <Detail label="Age" value={req.age} />}
                {req.askingPrice && <Detail label="Asking Price" value={`$${req.askingPrice}`} />}
              </div>

              {req.description && (
                <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">{req.description}</p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500 text-xs">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    reviewing: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}
