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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/inventory" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        &larr; Back to Inventory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {couch.images.length > 0 ? (
            couch.images.map((img) => (
              <div key={img.id} className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                <img src={img.url} alt={img.alt || couch.title} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{couch.title}</h1>
          {couch.sellPrice && (
            <p className="text-2xl font-bold text-brand-600 mb-4">
              ${couch.sellPrice.toLocaleString()}
            </p>
          )}

          <div className="space-y-3 mb-6">
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
                  .join(" x ")}
              />
            )}
          </div>

          {couch.notes && (
            <div className="mb-6">
              <h3 className="font-semibold mb-1">Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{couch.notes}</p>
            </div>
          )}

          <div className="bg-ranch-50 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Interested in this couch?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Contact us to schedule a viewing or ask questions. All sales are final.
            </p>
            <Link
              href={`/inquiry?couch=${couch.id}`}
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Inquire About This Couch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
