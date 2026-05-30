import { siteConfig } from "@/lib/config";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      {/* Page header */}
      <section style={{ background: "var(--ccf-navy)", color: "#fff", padding: "3.5rem 0" }}>
        <div className="nb-container" style={{ textAlign: "center" }}>
          <h1 className="nb-display" style={{ color: "#fff", marginBottom: "0.5rem" }}>About {siteConfig.name}</h1>
          <p style={{ opacity: 0.8 }}>Colorado&apos;s destination for quality pre-owned couches</p>
        </div>
      </section>

      <div className="nb-container" style={{ maxWidth: "48rem", padding: "3rem 1.5rem" }}>
        <p style={{ fontSize: "1.125rem", color: "var(--nb-gray)", lineHeight: 1.7, marginBottom: "3rem" }}>
          Welcome to {siteConfig.name} — what started as a passion for finding great deals on furniture
          has grown into a trusted business with hundreds of five-star reviews and a loyal customer base.
        </p>

        {/* What We Do */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 className="nb-heading" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>What We Do</h2>
          <p style={{ color: "var(--nb-gray)", lineHeight: 1.7 }}>
            We source, inspect, and sell quality couches at great prices. Whether you&apos;re looking for a
            classic modular sectional, a cozy L-shape, or a sleeper sofa, we&apos;ve got you covered. We
            specialize in popular styles that are hard to find at retail prices.
          </p>
        </div>

        {/* Our Promise */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 className="nb-heading" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Our Promise</h2>
          <div className="nb-grid-2">
            {[
              "Every couch is personally inspected for quality",
              "Honest descriptions and real photos",
              "Fair, transparent pricing",
              "Friendly, knowledgeable team",
            ].map((item) => (
              <div key={item} className="nb-card--static" style={{ padding: "1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{ color: "var(--ccf-cyan)", fontWeight: 900, fontSize: "1.25rem", lineHeight: 1 }}>{"\u2713"}</span>
                <span style={{ fontSize: "0.875rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visit Us */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 className="nb-heading" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Visit Us</h2>
          <p style={{ color: "var(--nb-gray)", lineHeight: 1.7 }}>
            Come visit our location to see our full selection in person.
            Our inventory changes regularly, so check back often or submit a request for exactly what you need.
          </p>
        </div>

        {/* Sell to Us */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 className="nb-heading" style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Sell to Us</h2>
          <p style={{ color: "var(--nb-gray)", lineHeight: 1.7 }}>
            Have a quality couch you no longer need? We buy couches in good condition.{" "}
            <Link href="/sell" style={{ color: "var(--ccf-cyan-dark)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Submit your couch details
            </Link>{" "}
            and we&apos;ll get back to you with an offer.
          </p>
        </div>

        {/* Sales Policy callout */}
        <div className="nb-card--static" style={{ background: "var(--ccf-sunny)", padding: "1.5rem" }}>
          <h3 className="nb-heading" style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Sales Policy</h3>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
            All sales are final. No returns or exchanges. We encourage all customers to inspect their
            couch in person before purchasing. We accept Cash, Venmo, and Cash App.
          </p>
        </div>
      </div>
    </div>
  );
}
