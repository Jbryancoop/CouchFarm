"use client";

import { useState, useEffect, useCallback } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: 50,
        height: 50,
        borderRadius: "50%",
        border: "none",
        backgroundColor: "var(--ccf-navy, #003986)",
        color: "var(--ccf-white, #FFFFFF)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease, scale 0.2s ease",
        boxShadow: "var(--ccf-shadow, 0 2px 8px rgba(0,0,0,0.15))",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.scale = "1.1";
        el.style.boxShadow = "0 0 20px rgba(13, 213, 255, 0.5)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.scale = "1";
        el.style.boxShadow = "var(--ccf-shadow, 0 2px 8px rgba(0,0,0,0.15))";
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M10 16V4M10 4L4 10M10 4L16 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
