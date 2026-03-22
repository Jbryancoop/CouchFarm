"use client";

import { useState, useCallback } from "react";
import { CouchCard } from "@/components/CouchCard";
import InventoryFilter from "@/components/InventoryFilter";
import Link from "next/link";
import type { Couch, CouchImage } from "@prisma/client";

type CouchWithImage = Couch & { images: CouchImage[] };

interface InventoryContentProps {
  couches: CouchWithImage[];
  styles: { value: string; label: string }[];
  colors: string[];
  initialStyle?: string;
  initialColor?: string;
}

export default function InventoryContent({
  couches,
  styles,
  colors,
  initialStyle = "",
  initialColor = "",
}: InventoryContentProps) {
  const [filtered, setFiltered] = useState<CouchWithImage[]>(() =>
    applyFilters(couches, initialStyle, initialColor, "")
  );

  const handleFilter = useCallback(
    (filters: { style: string; color: string; search: string }) => {
      setFiltered(applyFilters(couches, filters.style, filters.color, filters.search));
    },
    [couches]
  );

  return (
    <>
      <InventoryFilter
        styles={styles}
        colors={colors}
        initialStyle={initialStyle}
        initialColor={initialColor}
        totalCount={filtered.length}
        onFilter={handleFilter}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              background: "#E6FAFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg
              style={{ width: "2rem", height: "2rem", opacity: 0.3 }}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <p
            className="nb-heading"
            style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}
          >
            No couches match your filters right now
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--nb-gray)",
              marginBottom: "1.5rem",
            }}
          >
            Try adjusting your filters or tell us what you&apos;re looking for
          </p>
          <Link href="/inquiry" className="nb-btn nb-btn--primary">
            Tell us what you need &rarr;
          </Link>
        </div>
      ) : (
        <>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--nb-gray)",
              marginBottom: "1.5rem",
            }}
          >
            {filtered.length} couch{filtered.length !== 1 ? "es" : ""} available
          </p>
          <div className="nb-grid-3">
            {filtered.map((couch) => (
              <CouchCard key={couch.id} couch={couch} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function applyFilters(
  couches: CouchWithImage[],
  style: string,
  color: string,
  search: string
): CouchWithImage[] {
  const q = search.toLowerCase().trim();

  return couches.filter((couch) => {
    if (style && couch.style !== style) return false;
    if (color && couch.color !== color) return false;
    if (q) {
      const haystack = [
        couch.title,
        couch.color,
        couch.fabricType,
        couch.style,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
