import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { couchStyles } from "@/lib/config";
import CheckoutForm from "./CheckoutForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({ where: { id } });
  if (!couch) return { title: "Checkout" };
  return { title: `Checkout — ${couch.title}` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!couch || couch.status === "sold" || !couch.sellPrice) notFound();

  const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-sm">
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="text-amber-800 font-medium">Demo Mode</span>
          <span className="text-amber-700">— Stripe is not connected yet. No charges will be made.</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <Link href={`/inventory/${couch.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Listing
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Order Summary — Left Column */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-8">
              {/* Couch Image */}
              {couch.images.length > 0 ? (
                <div className="aspect-[4/3] bg-gray-100">
                  <img src={couch.images[0].url} alt={couch.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center justify-center text-gray-300">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
                  </svg>
                  <p className="text-sm mt-2">Photo coming soon</p>
                </div>
              )}

              <div className="p-5">
                <h2 className="font-semibold text-lg">{couch.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{styleLabel} · {couch.color} · {couch.fabricType}</p>

                {/* Order breakdown */}
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${couch.sellPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-400">Calculated at pickup</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${couch.sellPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form — Right Column */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <CheckoutForm
              couchId={couch.id}
              couchTitle={couch.title}
              price={couch.sellPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
