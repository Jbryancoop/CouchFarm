"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { siteConfig } from "@/lib/config";

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(0, 57, 134, 0.97)" : "var(--ccf-navy)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        color: "var(--ccf-white)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 30px rgba(0, 57, 134, 0.25)" : "none",
      }}
    >
      <div className="nb-container" style={{ padding: "0 var(--ccf-gutter)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? "5rem" : "7.5rem", transition: "height 0.3s ease" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
            <Image
              src="/brand/cow-circle.png"
              alt="Colorado Couch Farm"
              width={160}
              height={160}
              style={{
                width: scrolled ? "4rem" : "6rem",
                height: scrolled ? "4rem" : "6rem",
                transition: "all 0.3s ease",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
              }}
              priority
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: scrolled ? "1.25rem" : "1.5rem",
                lineHeight: 1.15,
                transition: "font-size 0.3s ease",
              }}>
                {siteConfig.name}
              </span>
              <span className="nb-desktop-only" style={{
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 500,
                fontSize: "0.75rem",
                opacity: 0.7,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}>
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="nb-desktop-only" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <NavLink href="/inventory">Browse Couches</NavLink>
            <NavLink href="/inquiry">Find My Couch</NavLink>
            <NavLink href="/sell">Sell Your Couch</NavLink>
            <NavLink href="/about">About</NavLink>
            {siteConfig.phone && (
              <a
                href={`tel:${siteConfig.phone}`}
                className="nb-lg-only"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  opacity: 0.8,
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "0.875rem",
                  fontFamily: "var(--ccf-font-display)",
                  fontWeight: 600,
                }}
              >
                <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {siteConfig.phone}
              </a>
            )}
            <Link
              href="/inventory"
              style={{
                marginLeft: "0.5rem",
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5rem 1.25rem",
                background: "var(--ccf-cyan)",
                color: "var(--ccf-navy)",
                fontFamily: "var(--ccf-font-display)",
                fontWeight: 700,
                fontSize: "0.8125rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "var(--ccf-radius-pill)",
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--ccf-sunny)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--ccf-cyan)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Shop Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="nb-mobile-only"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            style={{
              padding: "0.5rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            <div style={{ width: "1.5rem", height: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <span
                style={{
                  display: "block",
                  height: "2px",
                  width: "1.25rem",
                  background: "white",
                  borderRadius: "2px",
                  position: "absolute",
                  transition: "all 0.3s ease",
                  transform: open ? "rotate(45deg)" : "translateY(-6px)",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  width: "1.25rem",
                  background: "white",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  width: "1.25rem",
                  background: "white",
                  borderRadius: "2px",
                  position: "absolute",
                  transition: "all 0.3s ease",
                  transform: open ? "rotate(-45deg)" : "translateY(6px)",
                }}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <nav
          style={{
            overflow: "hidden",
            transition: "max-height 0.3s ease, opacity 0.3s ease",
            maxHeight: open ? "24rem" : "0",
            opacity: open ? 1 : 0,
          }}
        >
          <div style={{ borderTop: "1px solid rgba(13, 213, 255, 0.2)", paddingTop: "0.5rem", paddingBottom: "1rem" }}>
            <MobileNavLink href="/inventory" onClick={() => setOpen(false)}>Browse Couches</MobileNavLink>
            <MobileNavLink href="/inquiry" onClick={() => setOpen(false)}>Find My Couch</MobileNavLink>
            <MobileNavLink href="/sell" onClick={() => setOpen(false)}>Sell Your Couch</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setOpen(false)}>About</MobileNavLink>
            {siteConfig.phone && (
              <a
                href={`tel:${siteConfig.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  color: "var(--ccf-cyan)",
                  textDecoration: "none",
                  fontFamily: "var(--ccf-font-display)",
                  fontWeight: 600,
                }}
                onClick={() => setOpen(false)}
              >
                <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {siteConfig.phone}
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="nb-nav-link" style={{ color: "inherit" }}>
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "block",
        padding: "0.75rem",
        textDecoration: "none",
        color: "rgba(255,255,255,0.9)",
        fontFamily: "var(--ccf-font-display)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        fontSize: "0.9375rem",
        borderRadius: "var(--ccf-radius-sm)",
        transition: "background 0.2s ease",
      }}
    >
      {children}
    </Link>
  );
}
