import Link from "next/link";
import type { Couch, CouchImage } from "@prisma/client";
import { couchStyles } from "@/lib/config";

type CouchWithImage = Couch & { images: CouchImage[] };

export function CouchCard({ couch }: { couch: CouchWithImage }) {
  const image = couch.images[0];
  const styleLabel = couchStyles.find((s) => s.value === couch.style)?.label || couch.style;

  return (
    <Link
      href={`/inventory/${couch.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.alt || couch.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {couch.sellPrice && (
          <span className="absolute top-2 right-2 bg-brand-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            ${couch.sellPrice.toLocaleString()}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-brand-600 transition">
          {couch.title}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">{styleLabel}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">{couch.color}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">{couch.fabricType}</span>
        </div>
      </div>
    </Link>
  );
}
