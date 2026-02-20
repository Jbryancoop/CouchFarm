"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ranch-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-tight">
            {siteConfig.name}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/inventory" className="hover:text-brand-200 transition">
              Browse Couches
            </Link>
            <Link href="/inquiry" className="hover:text-brand-200 transition">
              Find My Couch
            </Link>
            <Link href="/sell" className="hover:text-brand-200 transition">
              Sell Your Couch
            </Link>
            <Link href="/about" className="hover:text-brand-200 transition">
              About
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden pb-4 space-y-2 text-sm font-medium">
            <Link href="/inventory" className="block py-2 hover:text-brand-200" onClick={() => setOpen(false)}>
              Browse Couches
            </Link>
            <Link href="/inquiry" className="block py-2 hover:text-brand-200" onClick={() => setOpen(false)}>
              Find My Couch
            </Link>
            <Link href="/sell" className="block py-2 hover:text-brand-200" onClick={() => setOpen(false)}>
              Sell Your Couch
            </Link>
            <Link href="/about" className="block py-2 hover:text-brand-200" onClick={() => setOpen(false)}>
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
