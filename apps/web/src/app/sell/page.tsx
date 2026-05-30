import type { Metadata } from "next";
import { SellForm } from "./SellForm";

export const metadata: Metadata = { title: "Sell Your Couch" };

export default async function SellPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      {/* Page header */}
      <section style={{ background: "var(--ccf-navy)", color: "#fff", padding: "3.5rem 0" }}>
        <div className="nb-container" style={{ maxWidth: "48rem", textAlign: "center" }}>
          <h1 className="nb-display" style={{ color: "#fff", marginBottom: "0.5rem" }}>Sell Your Couch to Us</h1>
          <p style={{ opacity: 0.8 }}>
            Have a quality couch you no longer need? Tell us about it and we&apos;ll get back to you with an offer.
          </p>
        </div>
      </section>

      <div className="nb-container" style={{ maxWidth: "40rem", padding: "2.5rem 1.5rem" }}>
        <SellForm ref_source={params.ref} />
      </div>
    </div>
  );
}
