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
      <section className="bg-gradient-to-br from-ranch-800 to-ranch-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Sell Your Couch to Us</h1>
          <p className="text-ranch-200">
            Have a quality couch you no longer need? Tell us about it and we&apos;ll get back to you with an offer.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <SellForm ref_source={params.ref} />
      </div>
    </div>
  );
}
