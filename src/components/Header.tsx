"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { siteConfig } from "@/lib/config";
import { LogoMark } from "@/components/Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 text-white transition-all duration-500 ${
        scrolled
          ? "bg-ranch-800/95 backdrop-blur-lg shadow-lg shadow-black/10"
          : "bg-ranch-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoMark
              className={`transition-all duration-300 group-hover:scale-105 ${
                scrolled ? "w-8 h-8" : "w-9 h-9"
              }`}
            />
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
            aria-expanded={open}
          >
            <div className="w-6 h-6 flex flex-col items-center justify-center relative">
              <span
                className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 absolute ${
                  open ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${
                  open ? "opacity-0 scale-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 absolute ${
                  open ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu — always rendered, animated via max-height + opacity */}
        <nav
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open
              ? "max-h-64 opacity-100 pb-4 pt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 border-t border-white/10 pt-2">
            <MobileNavLink href="/inventory" onClick={() => setOpen(false)}>Browse Couches</MobileNavLink>
            <MobileNavLink href="/inquiry" onClick={() => setOpen(false)}>Find My Couch</MobileNavLink>
            <MobileNavLink href="/sell" onClick={() => setOpen(false)}>Sell Your Couch</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setOpen(false)}>About</MobileNavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="nav-underline px-3 py-2 rounded-lg hover:bg-white/10 hover:text-brand-200 transition"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-brand-200 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
