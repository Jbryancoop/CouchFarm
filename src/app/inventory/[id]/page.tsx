import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { couchStyles } from "@/lib/config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({ where: { id } });
  if (!couch) return { title: "Not Found" };
  return { title: couch.title };
}

export default async function CouchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const couch = await prisma.couch.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!couch || couch.status === "sold") notFound();

  const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <Link href="/inventory" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Inventory
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {couch.images.length > 0 ? (
              couch.images.map((img, idx) => (
                <div key={img.id} className={`${idx === 0 ? "aspect-[4/3]" : "aspect-[4/3]"} bg-gray-100 rounded-2xl overflow-hidden shadow-sm`}>
                  <img src={img.url} alt={img.alt || couch.title} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                <svg className="w-20 h-20 mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
                </svg>
                <p className="text-sm font-medium">Photo coming soon</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-3">{couch.title}</h1>
            {couch.sellPrice ? (
              <p className="text-3xl font-bold text-brand-600 mb-6">
                ${couch.sellPrice.toLocaleString()}
              </p>
            ) : (
              <span className="inline-block bg-ranch-50 text-ranch-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
                Contact for Price
              </span>
            )}

            {/* Details grid */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Style" value={styleLabel} />
                <Detail label="Color" value={couch.color} />
                <Detail label="Fabric" value={couch.fabricType} />
                {(couch.length || couch.width || couch.height) && (
                  <Detail
                    label="Dimensions"
                    value={[
                      couch.length && `${couch.length}" L`,
                      couch.width && `${couch.width}" W`,
                      couch.height && `${couch.height}" H`,
                    ]
                      .filter(Boolean)
                      .join(" × ")}
                  />
                )}
              </div>
            </div>

            {couch.notes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-gray-900">Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{couch.notes}</p>
              </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-ranch-50 to-ranch-100/50 border border-ranch-200 rounded-2xl p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-ranch-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                Interested in this couch?
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {couch.sellPrice
                  ? "Buy now online or contact us to schedule a viewing. All sales are final."
                  : "Contact us to schedule a viewing or ask questions. All sales are final."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Buy Now — only shown when price exists */}
                {couch.sellPrice && (
                  <Link
                    href={`/checkout/${couch.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    Buy Now
                  </Link>
                )}

                <Link
                  href={`/inquiry?couch=${couch.id}`}
                  className={`inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition shadow-sm ${
                    couch.sellPrice
                      ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      : "bg-brand-500 hover:bg-brand-600 text-white"
                  }`}
                >
                  Inquire
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Payment info */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>We accept Credit Card, Cash, Venmo, and Cash App</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <p className="font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
