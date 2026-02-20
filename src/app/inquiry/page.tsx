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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Find Your Perfect Couch</h1>
      <p className="text-gray-600 mb-8">
        Tell us what you&apos;re looking for and we&apos;ll reach out when we have a match.
        We source quality couches daily and love helping people find the right fit.
      </p>
      <InquiryForm couchId={params.couch} ref_source={params.ref} />
    </div>
  );
}
