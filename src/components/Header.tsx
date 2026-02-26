"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { LogoMark } from "@/components/Logo";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ranch-800 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoMark className="w-9 h-9 group-hover:scale-105 transition-transform" />
            <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <NavLink href="/inventory">Browse Couches</NavLink>
            <NavLink href="/inquiry">Find My Couch</NavLink>
            <NavLink href="/sell">Sell Your Couch</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
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
          <nav className="md:hidden pb-4 pt-2 space-y-1 border-t border-white/10">
            <MobileNavLink href="/inventory" onClick={() => setOpen(false)}>Browse Couches</MobileNavLink>
            <MobileNavLink href="/inquiry" onClick={() => setOpen(false)}>Find My Couch</MobileNavLink>
            <MobileNavLink href="/sell" onClick={() => setOpen(false)}>Sell Your Couch</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setOpen(false)}>About</MobileNavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-brand-200 transition"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-brand-200 transition"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
