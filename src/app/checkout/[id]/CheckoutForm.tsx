"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutForm({
  couchId,
  couchTitle,
  price,
}: {
  couchId: string;
  couchTitle: string;
  price: number;
}) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);

    // Demo only: no payment processor is connected. Simulate a brief delay,
    // then route to the reservation confirmation.
    setTimeout(() => {
      const params = new URLSearchParams({
        couch: couchTitle,
        amount: price.toString(),
      });
      router.push(`/checkout/success?${params.toString()}`);
    }, 2000);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Contact Information */}
      <div className="nb-card--static" style={{ padding: "1.5rem" }}>
        <h2 className="nb-heading" style={{ fontSize: "1.125rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="nb-step-number">1</span>
          Contact Information
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="nb-grid-2">
            <div>
              <label className="nb-label">Full Name *</label>
              <input type="text" required placeholder="John Doe" className="nb-input" />
            </div>
            <div>
              <label className="nb-label">Email *</label>
              <input type="email" required placeholder="john@example.com" className="nb-input" />
            </div>
          </div>
          <div>
            <label className="nb-label">Phone (optional)</label>
            <input type="tel" placeholder="(303) 555-0123" className="nb-input" />
          </div>
        </div>
      </div>

      {/* Mock Stripe Card Input */}
      <div className="nb-card--static" style={{ padding: "1.5rem" }}>
        <h2 className="nb-heading" style={{ fontSize: "1.125rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="nb-step-number">2</span>
          Payment
        </h2>

        <div style={{ background: "var(--nb-cream)", border: "var(--nb-border)", borderRadius: "var(--ccf-radius-sm)", padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <svg style={{ width: "1.5rem", height: "1.5rem", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div style={{ fontSize: "0.875rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Demo checkout — no payment is collected</p>
            <p style={{ color: "var(--nb-gray)" }}>
              Online payments aren&apos;t connected yet. Submitting this form reserves the
              couch and our team will contact you to arrange payment and pickup. No card
              details are entered or stored.
            </p>
          </div>
        </div>
      </div>

      {/* Terms agreement */}
      <p style={{ fontSize: "0.75rem", color: "var(--nb-gray)", textAlign: "center" }}>
        By completing this purchase you agree to our{" "}
        <Link href="/policies" target="_blank" style={{ color: "var(--ccf-cyan-dark)", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 700 }}>
          Terms &amp; Policies
        </Link>
        , including all sales being final with no returns or refunds.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing}
        className="nb-btn nb-btn--primary"
        style={{ width: "100%", padding: "1rem", fontSize: "1.0625rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
      >
        {processing ? (
          <>
            <svg style={{ width: "1.25rem", height: "1.25rem", animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reserve for ${price.toLocaleString()}
          </>
        )}
      </button>
    </form>
  );
}
