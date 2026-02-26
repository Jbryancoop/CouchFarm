import { siteConfig } from "@/lib/config";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-br from-ranch-800 to-ranch-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About {siteConfig.name}</h1>
          <p className="text-ranch-200 text-lg">Colorado&apos;s destination for quality pre-owned couches</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-10">
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to {siteConfig.name} — what started as a passion for finding great deals on furniture
            has grown into a trusted business with hundreds of five-star reviews and a loyal customer base.
          </p>

          <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              What We Do
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We source, inspect, and sell quality couches at great prices. Whether you&apos;re looking for a
              classic modular sectional, a cozy L-shape, or a sleeper sofa, we&apos;ve got you covered. We
              specialize in popular styles that are hard to find at retail prices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-ranch-50 text-ranch-600 rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Our Promise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Every couch is personally inspected for quality",
                "Honest descriptions and real photos",
                "Fair, transparent pricing",
                "Friendly, knowledgeable team",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <svg className="w-5 h-5 text-ranch-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              Visit Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Come visit our ranch location to see our full selection in person.
              Our inventory changes regularly, so check back often or submit a request for exactly what you need.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-ranch-50 text-ranch-600 rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Sell to Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Have a quality couch you no longer need? We buy couches in good condition.{" "}
              <Link href="/sell" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                Submit your couch details
              </Link>{" "}
              and we&apos;ll get back to you with an offer.
            </p>
          </div>

          <div className="bg-ranch-50 border border-ranch-200 rounded-2xl p-6 mt-10">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-ranch-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Sales Policy
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              All sales are final. No returns or exchanges. We encourage all customers to inspect their
              couch in person before purchasing. We accept Cash, Venmo, and Cash App.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
