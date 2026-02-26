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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          Contact Information
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
            <input
              type="tel"
              placeholder="(303) 555-0123"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Mock Stripe Card Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Card Details
        </h2>

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                maxLength={19}
                className="stripe-input w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 pr-20 font-mono tracking-wide focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {/* Card brand icons */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <svg className="w-8 h-5 text-gray-300" viewBox="0 0 36 24" fill="currentColor">
                  <rect width="36" height="24" rx="4" fill="#1A1F71" opacity="0.15"/>
                  <path d="M15.5 15.5l2-7h2.5l-2 7h-2.5zm6.5-7l2.5 4.8.4-4.8h2.3l-.7 7h-2.1l-2.6-5-.5 5h-2.3l.7-7h2.3zm-11.5 0h3c1.5 0 2.5.8 2.2 2.2-.3 1.8-1.8 2.8-3.5 2.8h-1.5l-.5 2h-2.5l2.3-7z" fill="#1A1F71" opacity="0.4"/>
                </svg>
                <svg className="w-8 h-5 text-gray-300" viewBox="0 0 36 24" fill="currentColor">
                  <rect width="36" height="24" rx="4" fill="#EB001B" opacity="0.1"/>
                  <circle cx="14" cy="12" r="6" fill="#EB001B" opacity="0.2"/>
                  <circle cx="22" cy="12" r="6" fill="#F79E1B" opacity="0.2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
              <input
                type="text"
                placeholder="MM / YY"
                maxLength={7}
                className="stripe-input w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 font-mono tracking-wide focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  className="stripe-input w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 font-mono tracking-wide focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Powered by Stripe badge */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
          <span>Powered by <strong className="text-gray-500">Stripe</strong></span>
        </div>
      </div>

      {/* Terms agreement */}
      <p className="text-xs text-gray-500 text-center">
        By completing this purchase you agree to our{" "}
        <Link href="/policies" target="_blank" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800 transition">
          Terms &amp; Policies
        </Link>
        , including all sales being final with no returns or refunds.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-lg"
      >
        {processing ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Pay ${price.toLocaleString()}
          </>
        )}
      </button>

      {/* Security footer */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pb-4">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          SSL Encrypted
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure Payment
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          PCI Compliant
        </span>
      </div>
    </form>
  );
}
