import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { couchStyles } from "@/lib/config";
import CheckoutForm from "./CheckoutForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({ where: { id } });
  if (!couch) return { title: "Checkout" };
  return { title: `Checkout — ${couch.title}` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!couch || couch.status === "sold" || !couch.sellPrice) notFound();

  const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;

  return (
    <div>
      {/* Demo Mode Banner */}
      <div style={{ background: "var(--nb-yellow)", borderBottom: "1px solid var(--ccf-gray-light)" }}>
        <div className="nb-container" style={{ padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <svg style={{ width: "1rem", height: "1rem", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <strong>Demo Mode</strong>
          <span>&mdash; Stripe is not connected yet. No charges will be made.</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: "var(--ccf-chalk)", borderBottom: "1px solid var(--ccf-gray-light)" }}>
        <div className="nb-container" style={{ padding: "0.75rem 1.5rem" }}>
          <Link href={`/inventory/${couch.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--nb-gray)", textDecoration: "none", fontWeight: 700 }}>
            <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Listing
          </Link>
        </div>
      </div>

      <div className="nb-container" style={{ padding: "2.5rem 1.5rem" }}>
        <h1 className="nb-display" style={{ fontSize: "2rem", marginBottom: "2rem" }}>Checkout</h1>

        <div className="nb-grid-2" style={{ alignItems: "flex-start", gap: "2rem" }}>
          {/* Order Summary — Left Column */}
          <div style={{ order: 2 }}>
            <div className="nb-card--static" style={{ overflow: "hidden", position: "sticky", top: "2rem" }}>
              {/* Couch Image */}
              {couch.images.length > 0 ? (
                <div style={{ aspectRatio: "4/3", background: "#f3f3f3" }}>
                  <img src={couch.images[0].url} alt={couch.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                <div style={{ aspectRatio: "4/3", background: "var(--nb-cream)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--nb-gray)" }}>
                  <svg style={{ width: "4rem", height: "4rem" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
                  </svg>
                  <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Photo coming soon</p>
                </div>
              )}

              <div style={{ padding: "1.25rem", borderTop: "var(--nb-border)" }}>
                <h2 className="nb-heading" style={{ fontSize: "1.125rem" }}>{couch.title}</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--nb-gray)", marginTop: "0.25rem" }}>{styleLabel} · {couch.color} · {couch.fabricType}</p>

                {/* Order breakdown */}
                <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "var(--nb-border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--nb-gray)" }}>Subtotal</span>
                    <span style={{ fontWeight: 700 }}>${couch.sellPrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--nb-gray)" }}>Tax</span>
                    <span style={{ color: "var(--nb-gray)" }}>Calculated at pickup</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "var(--nb-border)" }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span className="nb-price" style={{ fontSize: "1.25rem" }}>${couch.sellPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form — Right Column */}
          <div style={{ order: 1 }}>
            <CheckoutForm
              couchId={couch.id}
              couchTitle={couch.title}
              price={couch.sellPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
