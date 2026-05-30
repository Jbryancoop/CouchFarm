import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation Received",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ couch?: string; amount?: string }>;
}) {
  const params = await searchParams;
  const couchTitle = params.couch || "Your Couch";
  const amount = params.amount ? Number(params.amount) : 0;

  return (
    <div>
      {/* Demo Mode Banner */}
      <div style={{ background: "var(--nb-yellow)", borderBottom: "1px solid var(--ccf-gray-light)" }}>
        <div className="nb-container" style={{ padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <svg style={{ width: "1rem", height: "1rem", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <strong>Demo Mode</strong>
          <span>&mdash; This is a simulated confirmation. No payment was collected.</span>
        </div>
      </div>

      <div className="nb-container" style={{ maxWidth: "32rem", padding: "4rem 1.5rem", textAlign: "center" }}>
        {/* Checkmark */}
        <div style={{ width: "5rem", height: "5rem", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <svg style={{ width: "2.5rem", height: "2.5rem", color: "#16a34a" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="nb-display" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Reservation Received!</h1>
        <p style={{ color: "var(--nb-gray)", marginBottom: "2rem" }}>Your couch is reserved. Our team will contact you to arrange payment and pickup.</p>

        {/* Order Summary Card */}
        <div className="nb-card--static" style={{ padding: "1.5rem", textAlign: "left", marginBottom: "1.5rem" }}>
          <h2 className="nb-label" style={{ marginBottom: "1rem" }}>Order Summary</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--nb-gray)" }}>Item</span>
              <span style={{ fontWeight: 700 }}>{couchTitle}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--nb-gray)" }}>Amount Due</span>
              <span className="nb-price">${amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="nb-card--static" style={{ background: "var(--nb-cream)", padding: "1.5rem", textAlign: "left", marginBottom: "2rem" }}>
          <h2 className="nb-heading" style={{ fontSize: "1rem", marginBottom: "1rem" }}>What Happens Next</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <li style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
              <span className="nb-step-number" style={{ flexShrink: 0 }}>1</span>
              <span>You&apos;ll receive a confirmation email with your order details.</span>
            </li>
            <li style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
              <span className="nb-step-number" style={{ flexShrink: 0 }}>2</span>
              <span>Our team will reach out within 24 hours to schedule your pickup or delivery.</span>
            </li>
            <li style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
              <span className="nb-step-number" style={{ flexShrink: 0 }}>3</span>
              <span>Pick up your couch at our location &mdash; or ask about delivery options!</span>
            </li>
          </ol>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
          <Link href="/inventory" className="nb-btn nb-btn--secondary">
            Browse More Couches
          </Link>
          <Link href="/" className="nb-btn nb-btn--primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
