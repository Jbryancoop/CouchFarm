import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { couchStyles } from "@/lib/config";
import { ImageLightbox } from "@/components/ImageLightbox";
import FavoriteButton from "@/components/FavoriteButton";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({ where: { id } });
  if (!couch) return { title: "Not Found" };
  return { title: couch.title };
}

export default async function CouchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!couch || couch.status === "sold") notFound();

  const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div style={{ background: "var(--ccf-chalk)", borderBottom: "1px solid var(--ccf-gray-light)", padding: "0.75rem 0" }}>
        <div className="nb-container">
          <Link href="/inventory" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--nb-gray)", textDecoration: "none", fontWeight: 700 }}>
            <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Inventory
          </Link>
        </div>
      </div>

      <div className="nb-container" style={{ padding: "2rem 1.5rem 3rem" }}>
        <div className="nb-grid-2" style={{ gap: "2.5rem", alignItems: "start" }}>
          {/* Images */}
          <div>
            {couch.images.length > 0 ? (
              <ImageLightbox images={couch.images.map(img => ({ id: img.id, url: img.url, alt: img.alt }))} title={couch.title} />
            ) : (
              <div style={{ aspectRatio: "4/3", borderRadius: "var(--ccf-radius)", background: "var(--nb-cream)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--nb-gray)" }}>
                <svg style={{ width: "5rem", height: "5rem", marginBottom: "0.75rem", opacity: 0.3 }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
                </svg>
                <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Photo coming soon</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <h1 className="nb-display" style={{ fontSize: "2rem" }}>{couch.title}</h1>
              <FavoriteButton couchId={couch.id} size="md" />
            </div>
            {couch.sellPrice ? (
              <p className="nb-price" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
                ${couch.sellPrice.toLocaleString()}
              </p>
            ) : (
              <span className="nb-badge nb-badge--purple" style={{ marginBottom: "1.5rem", display: "inline-block" }}>
                Contact for Price
              </span>
            )}

            {/* Details grid */}
            <div className="nb-card--static" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Detail label="Style" value={styleLabel} />
                <Detail label="Color" value={couch.color} />
                <Detail label="Fabric" value={couch.fabricType} />
                {(couch.length || couch.width || couch.height) && (
                  <Detail
                    label="Dimensions"
                    value={[
                      couch.length && `${couch.length}" L`,
                      couch.width && `${couch.width}" W`,
                      couch.height && `${couch.height}" H`,
                    ]
                      .filter(Boolean)
                      .join(" × ")}
                  />
                )}
              </div>
            </div>

            {couch.notes && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 className="nb-heading" style={{ fontSize: "0.9375rem", marginBottom: "0.5rem" }}>Notes</h3>
                <p style={{ color: "var(--nb-gray)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{couch.notes}</p>
              </div>
            )}

            {/* CTA Card */}
            <div className="nb-card--static" style={{ background: "var(--ccf-navy)", color: "#fff", padding: "1.5rem", borderRadius: "var(--ccf-radius)" }}>
              <h3 className="nb-heading" style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#fff" }}>
                Interested in this couch?
              </h3>
              <p style={{ fontSize: "0.875rem", opacity: 0.85, marginBottom: "1rem", lineHeight: 1.6 }}>
                {couch.sellPrice
                  ? "Buy now online or contact us to schedule a viewing. All sales are final."
                  : "Contact us to schedule a viewing or ask questions. All sales are final."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {couch.sellPrice && (
                  <Link
                    href={`/checkout/${couch.id}`}
                    className="nb-btn"
                    style={{ background: "var(--ccf-cherry)", color: "#fff", border: "none", borderRadius: "var(--ccf-radius-pill)" }}
                  >
                    Buy Now &mdash; ${couch.sellPrice.toLocaleString()}
                  </Link>
                )}
                <Link
                  href={`/inquiry?couch=${couch.id}`}
                  className="nb-btn nb-btn--secondary"
                  style={{ background: "#fff", color: "var(--nb-black)", borderRadius: "var(--ccf-radius-pill)" }}
                >
                  Inquire &rarr;
                </Link>
              </div>
            </div>

            {/* Payment info */}
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--nb-gray)" }}>
              <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>We accept Credit Card, Cash, Venmo, and Cash App</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="nb-label" style={{ fontSize: "0.6875rem" }}>{label}</span>
      <p style={{ fontWeight: 700, marginTop: "0.125rem" }}>{value}</p>
    </div>
  );
}
