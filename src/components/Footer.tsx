import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { LogoMark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-ranch-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <LogoMark className="w-9 h-9" />
              <h3 className="text-white font-bold text-lg">{siteConfig.name}</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{siteConfig.tagline}</p>
            {siteConfig.email && (
              <p className="text-sm mt-3">
                <a href={`mailto:${siteConfig.email}`} className="text-brand-300 hover:text-brand-200 transition">
                  {siteConfig.email}
                </a>
              </p>
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/inventory" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Browse Couches
                </Link>
              </li>
              <li>
                <Link href="/inquiry" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Find My Couch
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  Sell Your Couch
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Policy</h4>
            <div className="bg-ranch-800/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed text-gray-400">
                All sales are final. No returns or exchanges. We accept Cash, Venmo, Cash App, and Credit Card.
              </p>
              <Link
                href="/policies"
                className="inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200 transition mt-3"
              >
                View Full Terms &amp; Policies
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
