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

    // Simulate Stripe processing delay
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
          Card Details
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Card Number */}
          <div>
            <label className="nb-label">Card number</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                maxLength={19}
                className="nb-input"
                style={{ fontFamily: "monospace", letterSpacing: "0.05em", paddingRight: "5rem" }}
              />
              {/* Card brand icons */}
              <div style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <svg style={{ width: "2rem", height: "1.25rem", color: "#ccc" }} viewBox="0 0 36 24" fill="currentColor">
                  <rect width="36" height="24" rx="0" fill="#1A1F71" opacity="0.15"/>
                  <path d="M15.5 15.5l2-7h2.5l-2 7h-2.5zm6.5-7l2.5 4.8.4-4.8h2.3l-.7 7h-2.1l-2.6-5-.5 5h-2.3l.7-7h2.3zm-11.5 0h3c1.5 0 2.5.8 2.2 2.2-.3 1.8-1.8 2.8-3.5 2.8h-1.5l-.5 2h-2.5l2.3-7z" fill="#1A1F71" opacity="0.4"/>
                </svg>
                <svg style={{ width: "2rem", height: "1.25rem", color: "#ccc" }} viewBox="0 0 36 24" fill="currentColor">
                  <rect width="36" height="24" rx="0" fill="#EB001B" opacity="0.1"/>
                  <circle cx="14" cy="12" r="6" fill="#EB001B" opacity="0.2"/>
                  <circle cx="22" cy="12" r="6" fill="#F79E1B" opacity="0.2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Expiry + CVC */}
          <div className="nb-grid-2">
            <div>
              <label className="nb-label">Expiration</label>
              <input
                type="text"
                placeholder="MM / YY"
                maxLength={7}
                className="nb-input"
                style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
              />
            </div>
            <div>
              <label className="nb-label">CVC</label>
              <input
                type="text"
                placeholder="123"
                maxLength={4}
                className="nb-input"
                style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
              />
            </div>
          </div>
        </div>

        {/* Powered by Stripe badge */}
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "var(--nb-border)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--nb-gray)" }}>
          <svg style={{ width: "1rem", height: "1rem" }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
          <span>Powered by <strong>Stripe</strong></span>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Pay ${price.toLocaleString()}
          </>
        )}
      </button>

      {/* Security footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", fontSize: "0.75rem", color: "var(--nb-gray)", paddingBottom: "1rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          SSL Encrypted
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure Payment
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          PCI Compliant
        </span>
      </div>
    </form>
  );
}
