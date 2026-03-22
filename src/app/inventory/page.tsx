import { prisma } from "@/lib/db";
import { couchStyles, couchColors } from "@/lib/config";
import InventoryContent from "./InventoryContent";
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

  const couches = await prisma.couch.findMany({
    where: { status: "available" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Page header */}
      <section style={{ background: "var(--ccf-navy)", color: "#fff", padding: "3.5rem 0" }}>
        <div className="nb-container" style={{ textAlign: "center" }}>
          <h1 className="nb-display" style={{ color: "#fff", marginBottom: "0.5rem" }}>Browse Our Couches</h1>
          <p style={{ opacity: 0.8 }}>Quality pre-owned couches at great prices</p>
        </div>
      </section>

      <div className="nb-container" style={{ padding: "2.5rem 1.5rem" }}>
        <InventoryContent
          couches={couches}
          styles={[...couchStyles]}
          colors={[...couchColors]}
          initialStyle={params.style}
          initialColor={params.color}
        />
      </div>
    </div>
  );
}
