import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminSalesPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.sellPrice, 0);
  const totalCost = sales.reduce((sum, s) => sum + (s.buyPrice || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sales ({sales.length})</h1>
        <Link
          href="/admin/sales/new"
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          + Record Sale
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Cost</p>
          <p className="text-xl font-bold">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">Profit</p>
          <p className={`text-xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${totalProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {sales.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No sales recorded yet.</p>
        ) : (
          <div className="divide-y">
            {sales.map((sale) => (
              <div key={sale.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{sale.couchTitle}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {sale.customerName && <span>Customer: {sale.customerName}</span>}
                    <span>Method: {sale.paymentMethod}</span>
                    {sale.soldBy && <span>Sold by: {sale.soldBy}</span>}
                    {sale.source && <span>Source: {sale.source}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-600">${sale.sellPrice.toLocaleString()}</p>
                  {sale.buyPrice != null && (
                    <p className="text-xs text-gray-500">
                      Cost: ${sale.buyPrice.toLocaleString()} · Profit: ${(sale.sellPrice - sale.buyPrice).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
