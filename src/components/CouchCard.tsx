"use client";

import Link from "next/link";
import type { Couch, CouchImage } from "@prisma/client";
import { couchStyles } from "@/lib/config";
import FavoriteButton from "@/components/FavoriteButton";

type CouchWithImage = Couch & { images: CouchImage[] };

export function CouchCard({ couch }: { couch: CouchWithImage }) {
  const image = couch.images[0];
  const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;

  return (
    <Link
      href={`/inventory/${couch.id}`}
      className="nb-card"
      style={{ display: "block", textDecoration: "none", color: "inherit", overflow: "hidden" }}
    >
      <div className="nb-card-image" style={{
        aspectRatio: "4/3",
        background: "var(--ccf-cyan-bg)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} style={{ position: "absolute", top: "0.75rem", left: "0.75rem", zIndex: 2 }}>
          <FavoriteButton couchId={couch.id} size="sm" />
        </div>
        {image ? (
          <img
            src={image.url}
            alt={image.alt || couch.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ccf-gray)" }}>
            <svg style={{ width: "3.5rem", height: "3.5rem", marginBottom: "0.5rem", opacity: 0.3 }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
            </svg>
            <span style={{ fontSize: "0.75rem" }}>Photo coming soon</span>
          </div>
        )}
        {couch.sellPrice && (
          <span
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: "var(--ccf-cherry)",
              color: "var(--ccf-white)",
              padding: "0.375rem 0.875rem",
              borderRadius: "var(--ccf-radius-pill)",
              fontFamily: "var(--ccf-font-display)",
              fontWeight: 700,
              fontSize: "0.9375rem",
            }}
          >
            ${couch.sellPrice.toLocaleString()}
          </span>
        )}
        {!couch.sellPrice && (
          <span
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: "var(--ccf-navy)",
              color: "var(--ccf-white)",
              padding: "0.375rem 0.75rem",
              borderRadius: "var(--ccf-radius-pill)",
              fontFamily: "var(--ccf-font-display)",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            Contact for Price
          </span>
        )}
      </div>
      <div style={{ padding: "1.125rem" }}>
        <h3 style={{
          fontFamily: "var(--ccf-font-display)",
          fontWeight: 700,
          fontSize: "1.0625rem",
          marginBottom: "0.625rem",
        }}>
          {couch.title}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          <span className="nb-badge nb-badge--cyan" style={{ fontSize: "0.6875rem" }}>{styleLabel}</span>
          <span className="nb-badge" style={{ fontSize: "0.6875rem", background: "var(--ccf-chalk)" }}>{couch.color}</span>
          <span className="nb-badge" style={{ fontSize: "0.6875rem", background: "var(--ccf-chalk)" }}>{couch.fabricType}</span>
        </div>
      </div>
    </Link>
  );
}
