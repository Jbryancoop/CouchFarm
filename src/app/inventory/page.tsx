import { prisma } from "@/lib/db";
import { CouchCard } from "@/components/CouchCard";
import { couchStyles } from "@/lib/config";
import Link from "next/link";
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
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-br from-ranch-800 to-ranch-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Browse Our Couches</h1>
          <p className="text-ranch-200">Quality pre-owned couches at great prices</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters */}
        <form className="flex flex-wrap items-center gap-3 mb-8 bg-gray-50 rounded-xl p-4">
          <span className="text-sm font-medium text-gray-500">Filter by:</span>
          <select
            name="style"
            defaultValue={params.style || ""}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
          >
            <option value="">All Styles</option>
            {couchStyles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition shadow-sm"
          >
            Filter
          </button>
          {(params.style || params.color) && (
            <a href="/inventory" className="text-sm text-gray-400 hover:text-gray-600 transition">
              &times; Clear filters
            </a>
          )}
        </form>

        {couches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-lg text-gray-400 mb-2 font-medium">No couches match your filters right now</p>
            <p className="text-sm text-gray-400 mb-6">Try adjusting your filters or tell us what you&apos;re looking for</p>
            <Link href="/inquiry" className="text-brand-600 hover:text-brand-700 font-medium">
              Tell us what you need &rarr;
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">{couches.length} couch{couches.length !== 1 ? "es" : ""} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {couches.map((couch) => (
                <CouchCard key={couch.id} couch={couch} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
