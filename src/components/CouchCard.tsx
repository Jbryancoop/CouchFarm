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
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.alt || couch.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
            <svg className="w-14 h-14 mb-2" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
              <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3a3 3 0 00-3 3v4h2v2h2v-2h14v2h2v-2h2v-4a3 3 0 00-3-3zM6 6h12v3.17A3 3 0 0016 12H8a3 3 0 00-2-2.83V6zM3 12a1 1 0 011-1h1a1 1 0 011 1v2H3v-2zm18 2h-2v-2a1 1 0 011-1h1a1 1 0 011 1v2z" />
            </svg>
            <span className="text-xs text-gray-400">Photo coming soon</span>
          </div>
        )}
        {couch.sellPrice && (
          <span className="absolute top-3 right-3 bg-brand-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
            ${couch.sellPrice.toLocaleString()}
          </span>
        )}
        {!couch.sellPrice && (
          <span className="absolute top-3 right-3 bg-ranch-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            Contact for Price
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-600 transition">
          {couch.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="bg-ranch-50 text-ranch-700 px-2.5 py-1 rounded-full font-medium">{styleLabel}</span>
          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{couch.color}</span>
          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{couch.fabricType}</span>
        </div>
      </div>
    </Link>
  );
}
