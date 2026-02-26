import Link from "next/link";
import Image from "next/image";
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
      <section className="relative text-white overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-ranch-900/85 via-ranch-800/80 to-ranch-900/85" />
        {/* Subtle decorative accents */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-ranch-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <svg className="w-4 h-4 text-brand-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-ranch-100">Colorado&apos;s Trusted Couch Source</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Find Your Perfect
            <span className="block text-brand-300">Couch</span>
          </h1>
          <p className="text-lg md:text-xl text-ranch-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-brand-500/25 hover:shadow-brand-400/30"
            >
              Browse Couches
            </Link>
            <Link
              href="/inquiry"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition"
            >
              Tell Us What You Need
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Three simple steps to finding your perfect couch</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                title: "Browse or Tell Us",
                desc: "Check our current inventory or submit a request with your style, color, and budget preferences.",
                color: "brand",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
                title: "We Find Your Match",
                desc: "Our team sources quality couches daily. We'll match you with the perfect piece.",
                color: "ranch",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: "Pick Up & Enjoy",
                desc: "Visit our ranch location to see your couch in person and take it home same day.",
                color: "brand",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${item.color === "brand" ? "bg-brand-50 text-brand-600" : "bg-ranch-50 text-ranch-600"} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Recent Inventory */}
      {recentCouches.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">
                  {featured.length > 0 ? "Featured Couches" : "Latest Arrivals"}
                </h2>
                <p className="text-gray-500 mt-1">Hand-picked selections from our inventory</p>
              </div>
              <Link
                href="/inventory"
                className="hidden sm:inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium group"
              >
                View All
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCouches.map((couch) => (
                <CouchCard key={couch.id} couch={couch} />
              ))}
            </div>
            <div className="sm:hidden text-center mt-8">
              <Link href="/inventory" className="text-brand-600 hover:text-brand-700 font-medium">
                View All Couches &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sell CTA */}
      <section className="relative text-white py-20 md:py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ranch-900/90 to-ranch-800/85" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-brand-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Have a Couch to Sell?</h2>
          <p className="text-ranch-200 mb-8 max-w-xl mx-auto leading-relaxed">
            We buy quality couches in good condition. Submit your couch details and we&apos;ll get back to you with an offer.
          </p>
          <Link
            href="/sell"
            className="inline-block bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-brand-500/25"
          >
            Sell Your Couch
          </Link>
        </div>
      </section>
    </div>
  );
}
