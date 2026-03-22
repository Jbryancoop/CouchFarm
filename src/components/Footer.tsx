import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--ccf-navy-dark)",
        color: "var(--ccf-white)",
        marginTop: "auto",
      }}
    >
      <div className="nb-container" style={{ padding: "3.5rem var(--ccf-gutter)" }}>
        <div className="nb-grid-3">
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1rem" }}>
              <Image
                src="/brand/cow-circle.png"
                alt="Colorado Couch Farm"
                width={56}
                height={56}
                style={{ width: "3.25rem", height: "3.25rem", objectFit: "contain" }}
              />
              <span style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: "1.125rem",
              }}>
                {siteConfig.name}
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", opacity: 0.6, lineHeight: 1.6 }}>{siteConfig.tagline}</p>
            {siteConfig.phone && (
              <p style={{ fontSize: "0.875rem", marginTop: "0.75rem" }}>
                <a href={`tel:${siteConfig.phone}`} style={{ color: "var(--ccf-cyan)", textDecoration: "none", fontWeight: 600 }}>
                  {siteConfig.phone}
                </a>
              </p>
            )}
            {siteConfig.email && (
              <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                <a href={`mailto:${siteConfig.email}`} style={{ color: "var(--ccf-cyan)", textDecoration: "none", fontWeight: 600 }}>
                  {siteConfig.email}
                </a>
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="nb-label" style={{ marginBottom: "1rem", color: "var(--ccf-cyan)" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/inventory", label: "Browse Couches" },
                { href: "/inquiry", label: "Find My Couch" },
                { href: "/sell", label: "Sell Your Couch" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nb-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy box */}
          <div>
            <h4 className="nb-label" style={{ marginBottom: "1rem", color: "var(--ccf-cyan)" }}>Policy</h4>
            <div
              style={{
                border: "1px solid rgba(13, 213, 255, 0.2)",
                borderRadius: "var(--ccf-radius-sm)",
                padding: "1.25rem",
              }}
            >
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, opacity: 0.6 }}>
                All sales are final. No returns or exchanges. We accept Cash, Venmo, Cash App, and Credit Card.
              </p>
              <Link
                href="/policies"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.875rem",
                  color: "var(--ccf-cyan)",
                  textDecoration: "none",
                  fontWeight: 700,
                  marginTop: "0.75rem",
                }}
              >
                View Full Terms &amp; Policies
                <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(13, 213, 255, 0.15)", margin: "2.5rem 0 1.5rem" }} />
        <div style={{ textAlign: "center", fontSize: "0.75rem", opacity: 0.4 }}>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
