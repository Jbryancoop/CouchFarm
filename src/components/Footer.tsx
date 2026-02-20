import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">{siteConfig.name}</h3>
            <p className="text-sm">{siteConfig.tagline}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/inventory" className="hover:text-white transition">Browse Couches</Link></li>
              <li><Link href="/inquiry" className="hover:text-white transition">Find My Couch</Link></li>
              <li><Link href="/sell" className="hover:text-white transition">Sell Your Couch</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Policy</h4>
            <p className="text-sm">All sales are final. No returns or exchanges.</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
