import { prisma } from "@/lib/db";
import { couchStyles } from "@/lib/config";
import { UpdateStatusButton } from "@/components/admin/UpdateStatusButton";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.customerInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Inquiries ({inquiries.length})</h1>

      <div className="space-y-4">
        {inquiries.length === 0 && (
          <p className="text-gray-500 text-center py-8">No inquiries yet.</p>
        )}
        {inquiries.map((inq) => {
          const styleLabel = couchStyles.find((s) => s.value === inq.preferredStyle)?.label || inq.preferredStyle;
          return (
            <div key={inq.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold">{inq.name}</h3>
                  <p className="text-sm text-gray-500">{inq.email}{inq.phone && ` · ${inq.phone}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={inq.status} />
                  <UpdateStatusButton
                    id={inq.id}
                    type="inquiry"
                    currentStatus={inq.status}
                    options={["new", "contacted", "converted", "closed"]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {styleLabel && <Detail label="Style" value={styleLabel} />}
                {inq.preferredColor && <Detail label="Color" value={inq.preferredColor} />}
                {inq.hasSleeper && <Detail label="Sleeper" value="Yes" />}
                {inq.hasReclining && <Detail label="Reclining" value="Yes" />}
                {(inq.budgetMin || inq.budgetMax) && (
                  <Detail
                    label="Budget"
                    value={`${inq.budgetMin ? `$${inq.budgetMin}` : "Any"} – ${inq.budgetMax ? `$${inq.budgetMax}` : "Any"}`}
                  />
                )}
                {inq.source && <Detail label="Source" value={inq.source} />}
              </div>

              {inq.message && (
                <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg p-3">{inq.message}</p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {new Date(inq.createdAt).toLocaleString()}
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
    contacted: "bg-yellow-100 text-yellow-700",
    converted: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}
