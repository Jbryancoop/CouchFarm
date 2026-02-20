import { prisma } from "@/lib/db";
import { CouchCard } from "@/components/CouchCard";
import { couchStyles } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Browse Couches" };

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string; color?: string; ref?: string }>;
}) {
  const params = await searchParams;

  // Track marketing link click
  if (params.ref) {
    await prisma.marketingLink.updateMany({
      where: { slug: params.ref },
      data: { clicks: { increment: 1 } },
    });
  }

  const where: Record<string, unknown> = { status: "available" };
  if (params.style) where.style = params.style;
  if (params.color) where.color = params.color;

  const couches = await prisma.couch.findMany({
    where,
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Our Couches</h1>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 mb-8">
        <select
          name="style"
          defaultValue={params.style || ""}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">All Styles</option>
          {couchStyles.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition"
        >
          Filter
        </button>
        {(params.style || params.color) && (
          <a href="/inventory" className="text-sm text-gray-500 hover:text-gray-700 self-center">
            Clear filters
          </a>
        )}
      </form>

      {couches.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">No couches match your filters right now.</p>
          <a href="/inquiry" className="text-brand-600 hover:text-brand-700 font-medium">
            Tell us what you&apos;re looking for &rarr;
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {couches.map((couch) => (
            <CouchCard key={couch.id} couch={couch} />
          ))}
        </div>
      )}
    </div>
  );
}
