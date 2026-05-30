"use client";

import { useState } from "react";
import { couchStyles, couchColors } from "@/lib/config";
import { submitInquiry } from "./actions";
import { useToast } from "@/components/Toast";

export function InquiryForm({ couchId, ref_source }: { couchId?: string; ref_source?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitInquiry(formData);

    if (result.success) {
      setSubmitted(true);
      showToast("Request submitted! We'll reach out when we have a match.", "success");
    } else {
      setError(result.error || "Something went wrong. Please try again.");
      showToast(result.error || "Something went wrong. Please try again.", "error");
    }
    setPending(false);
  }

  if (submitted) {
    return (
      <div className="nb-card--static" style={{ padding: "2.5rem", textAlign: "center", background: "var(--ccf-chalk)" }}>
        <div style={{ width: "4rem", height: "4rem", background: "var(--ccf-navy)", color: "#fff", border: "var(--nb-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <svg style={{ width: "2rem", height: "2rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="nb-heading" style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Request Submitted!</h2>
        <p style={{ color: "var(--nb-gray)" }}>
          Thanks for reaching out! We&apos;ll review your preferences and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {error && (
        <div style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: "var(--ccf-radius-sm)", padding: "1rem", fontSize: "0.875rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <svg style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0, marginTop: "0.125rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      <input type="hidden" name="source" value={ref_source || ""} />
      {couchId && <input type="hidden" name="couchId" value={couchId} />}
      {/* Spam honeypot — hidden from real users, ignored by them, filled by bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {/* Contact Info */}
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend className="nb-heading" style={{ fontSize: "1.125rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="nb-step-number">1</span>
          Your Information
        </legend>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="nb-grid-2">
            <div>
              <label className="nb-label">Name *</label>
              <input name="name" required className="nb-input" />
            </div>
            <div>
              <label className="nb-label">Email *</label>
              <input name="email" type="email" required className="nb-input" />
            </div>
          </div>
          <div>
            <label className="nb-label">Phone (optional)</label>
            <input name="phone" type="tel" className="nb-input" />
          </div>
        </div>
      </fieldset>

      {/* Preferences */}
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend className="nb-heading" style={{ fontSize: "1.125rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="nb-step-number">2</span>
          What Are You Looking For?
        </legend>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="nb-grid-2">
            <div>
              <label className="nb-label">Preferred Style</label>
              <select name="preferredStyle" className="nb-select">
                <option value="">Any style</option>
                {couchStyles.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="nb-label">Preferred Color</label>
              <select name="preferredColor" className="nb-select">
                <option value="">Any color</option>
                {couchColors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="nb-card--static" style={{ padding: "1rem", display: "flex", gap: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="checkbox" name="hasSleeper" value="true" />
              <span>Sleeper</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="checkbox" name="hasReclining" value="true" />
              <span>Reclining</span>
            </label>
          </div>

          <div className="nb-grid-2">
            <div>
              <label className="nb-label">Budget Min ($)</label>
              <input name="budgetMin" type="number" min="0" className="nb-input" />
            </div>
            <div>
              <label className="nb-label">Budget Max ($)</label>
              <input name="budgetMax" type="number" min="0" className="nb-input" />
            </div>
          </div>

          <div>
            <label className="nb-label">Anything else we should know?</label>
            <textarea name="message" rows={3} className="nb-textarea" />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="nb-btn nb-btn--primary"
        style={{ width: "100%", padding: "0.875rem", fontSize: "0.9375rem" }}
      >
        {pending ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
