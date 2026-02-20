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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Sell Your Couch to Us</h1>
      <p className="text-gray-600 mb-8">
        Have a quality couch you no longer need? Tell us about it and we&apos;ll
        get back to you with an offer. We buy couches in good condition and pay fair prices.
      </p>
      <SellForm ref_source={params.ref} />
    </div>
  );
}
