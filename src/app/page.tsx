import Link from "next/link";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/config";
import { CouchCard } from "@/components/CouchCard";

export default async function HomePage() {
  const featured = await prisma.couch.findMany({
    where: { status: "available", featured: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const recentCouches = featured.length > 0
    ? featured
    : await prisma.couch.findMany({
        where: { status: "available" },
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        take: 6,
        orderBy: { createdAt: "desc" },
      });

  return (
    <div>
      {/* Hero */}
      <section className="bg-ranch-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{siteConfig.name}</h1>
          <p className="text-lg md:text-xl text-ranch-100 mb-8 max-w-2xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Browse Couches
            </Link>
            <Link
              href="/inquiry"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Tell Us What You Need
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Browse or Tell Us", desc: "Check our current inventory or submit a request with your style, color, and budget preferences." },
              { step: "2", title: "We Find Your Match", desc: "Our team sources quality couches daily. We'll match you with the perfect piece." },
              { step: "3", title: "Pick Up & Enjoy", desc: "Visit our ranch location to see your couch in person and take it home same day." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Recent Inventory */}
      {recentCouches.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {featured.length > 0 ? "Featured Couches" : "Latest Arrivals"}
              </h2>
              <Link href="/inventory" className="text-brand-600 hover:text-brand-700 font-medium">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCouches.map((couch) => (
                <CouchCard key={couch.id} couch={couch} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sell CTA */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Couch to Sell?</h2>
          <p className="text-gray-600 mb-6">
            We buy quality couches in good condition. Submit your couch details and we&apos;ll get back to you with an offer.
          </p>
          <Link
            href="/sell"
            className="inline-block bg-ranch-600 hover:bg-ranch-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Sell Your Couch
          </Link>
        </div>
      </section>
    </div>
  );
}
