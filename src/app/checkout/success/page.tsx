import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
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
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-sm">
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-amber-800 font-medium">Demo Mode</span>
          <span className="text-amber-700">— This is a simulated confirmation. No payment was processed.</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        {/* Animated checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">Your payment has been processed successfully.</p>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-left mb-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Item</span>
              <span className="font-medium">{couchTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-bold text-green-600">${amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-ranch-50 rounded-2xl border border-ranch-200 p-6 text-left mb-8">
          <h2 className="font-semibold text-ranch-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            What Happens Next
          </h2>
          <ol className="space-y-3 text-sm text-ranch-700">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-ranch-200 rounded-full flex items-center justify-center text-xs font-bold text-ranch-800 shrink-0">1</span>
              <span>You&apos;ll receive a confirmation email with your order details.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-ranch-200 rounded-full flex items-center justify-center text-xs font-bold text-ranch-800 shrink-0">2</span>
              <span>Our team will reach out within 24 hours to schedule your pickup or delivery.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-ranch-200 rounded-full flex items-center justify-center text-xs font-bold text-ranch-800 shrink-0">3</span>
              <span>Pick up your couch at our ranch location — or ask about delivery options!</span>
            </li>
          </ol>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition"
          >
            Browse More Couches
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-ranch-700 hover:bg-ranch-800 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
