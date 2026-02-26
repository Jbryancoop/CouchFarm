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
      <section className="bg-gradient-to-br from-ranch-800 to-ranch-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Your Perfect Couch</h1>
          <p className="text-ranch-200">
            Tell us what you&apos;re looking for and we&apos;ll reach out when we have a match.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <InquiryForm couchId={params.couch} ref_source={params.ref} />
      </div>
    </div>
  );
}
