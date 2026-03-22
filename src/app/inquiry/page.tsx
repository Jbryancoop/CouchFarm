import type { Metadata } from "next";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = { title: "Find My Couch" };

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ couch?: string; ref?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      {/* Page header */}
      <section style={{ background: "var(--ccf-navy)", color: "#fff", padding: "3.5rem 0" }}>
        <div className="nb-container" style={{ textAlign: "center" }}>
          <h1 className="nb-display" style={{ color: "#fff", marginBottom: "0.5rem" }}>Find Your Perfect Couch</h1>
          <p style={{ opacity: 0.8 }}>Tell us what you&apos;re looking for and we&apos;ll reach out when we have a match.</p>
        </div>
      </section>

      <div className="nb-container" style={{ maxWidth: "40rem", padding: "2.5rem 1.5rem" }}>
        <InquiryForm couchId={params.couch} ref_source={params.ref} />
      </div>
    </div>
  );
}
