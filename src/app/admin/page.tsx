import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalInventory,
    availableCount,
    soldCount,
    newInquiries,
    newBuyRequests,
    recentSales,
    totalRevenue,
    totalCost,
  ] = await Promise.all([
    prisma.couch.count(),
    prisma.couch.count({ where: { status: "available" } }),
    prisma.couch.count({ where: { status: "sold" } }),
    prisma.customerInquiry.count({ where: { status: "new" } }),
    prisma.buyRequest.count({ where: { status: "new" } }),
    prisma.sale.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.sale.aggregate({ _sum: { sellPrice: true } }),
    prisma.sale.aggregate({ _sum: { buyPrice: true } }),
  ]);

  const revenue = totalRevenue._sum.sellPrice || 0;
  const cost = totalCost._sum.buyPrice || 0;
  const profit = revenue - cost;

  const stats = [
    { label: "Available Couches", value: availableCount, href: "/admin/inventory" },
    { label: "Total Inventory", value: totalInventory, href: "/admin/inventory" },
    { label: "Sold", value: soldCount, href: "/admin/sales" },
    { label: "New Inquiries", value: newInquiries, href: "/admin/inquiries", highlight: newInquiries > 0 },
    { label: "New Buy Requests", value: newBuyRequests, href: "/admin/buy-requests", highlight: newBuyRequests > 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`p-4 rounded-xl border transition hover:shadow-sm ${
              stat.highlight ? "bg-brand-50 border-brand-200" : "bg-white border-gray-200"
            }`}
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">${revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold text-gray-600">${cost.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Profit</p>
          <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${profit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Recent Sales</h2>
          <Link href="/admin/sales" className="text-sm text-brand-600 hover:text-brand-700">
            View All
          </Link>
        </div>
        {recentSales.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No sales recorded yet.</p>
        ) : (
          <div className="divide-y">
            {recentSales.map((sale) => (
              <div key={sale.id} className="px-4 py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{sale.couchTitle}</span>
                  {sale.customerName && (
                    <span className="text-gray-500 ml-2">to {sale.customerName}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-600">${sale.sellPrice.toLocaleString()}</span>
                  <span className="text-gray-400 ml-2 text-xs">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
