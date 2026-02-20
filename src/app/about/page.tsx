import { siteConfig } from "@/lib/config";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About {siteConfig.name}</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-600">
          Welcome to {siteConfig.name} — Colorado&apos;s destination for quality pre-owned couches.
          What started as a passion for finding great deals on furniture has grown into a trusted
          business with hundreds of five-star reviews and a loyal customer base.
        </p>

        <h2 className="text-xl font-semibold mt-8">What We Do</h2>
        <p className="text-gray-600">
          We source, inspect, and sell quality couches at great prices. Whether you&apos;re looking for a
          classic modular sectional, a cozy L-shape, or a sleeper sofa, we&apos;ve got you covered. We
          specialize in popular styles that are hard to find at retail prices.
        </p>

        <h2 className="text-xl font-semibold mt-8">Our Promise</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Every couch is personally inspected for quality</li>
          <li>Honest descriptions and real photos</li>
          <li>Fair, transparent pricing</li>
          <li>Friendly, knowledgeable team</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Visit Us</h2>
        <p className="text-gray-600">
          Come visit our ranch location to see our full selection in person.
          Our inventory changes regularly, so check back often or submit a request for exactly what you need.
        </p>

        <h2 className="text-xl font-semibold mt-8">Sell to Us</h2>
        <p className="text-gray-600">
          Have a quality couch you no longer need? We buy couches in good condition.{" "}
          <Link href="/sell" className="text-brand-600 hover:text-brand-700 font-medium">
            Submit your couch details
          </Link>{" "}
          and we&apos;ll get back to you with an offer.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
          <h3 className="font-semibold mb-2">Sales Policy</h3>
          <p className="text-sm text-gray-600">
            All sales are final. No returns or exchanges. We encourage all customers to inspect their
            couch in person before purchasing. We accept Cash, Venmo, and Cash App.
          </p>
        </div>
      </div>
    </div>
  );
}
